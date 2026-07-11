import { describe, expect, it } from "vitest";
import ts from "typescript";
import vm from "node:vm";
import coreApi from "../api/core-api.json";
import {
  EXPORT_CATALOG,
  EXPORT_CATALOG_EXCLUDED,
  getCatalogEntry,
} from "./exportCatalog";
import { EXPORT_CATALOG_DATA } from "./exportCatalogData";
import { formatExport, gatherSelection } from "./createJSONUtils/createJSONUtils";
// @ts-expect-error — plain .mjs build script, no type declarations.
import { generateExportCatalog } from "../../../scripts/generate-export-catalog.mjs";
import {
  lerp,
  clamp,
  mapRange,
  easeOutBounce,
  easeInOutCubic,
  circleCircle,
  lerpColorHsl,
  springValue,
  tweenValue,
} from "@utilspalooza/core";

// Non-negotiable export tests for the function-grained Copy Code catalog
// (2026-07-11 review, Work Package 3D). The old animation-grained pipeline
// shipped regex-stripped "JavaScript" that did not parse; these tests hold the
// new build-time TypeScript-compiler pipeline to "every output parses, and
// representative outputs run correctly".

const ALL_KEYS = EXPORT_CATALOG.map((e) => e.key);

const EASING_KEYS = [
  "linear",
  "easeIn",
  "easeInQuad",
  "easeInCubic",
  "easeInQuart",
  "easeInQuint",
  "easeOut",
  "easeOutQuad",
  "easeOutCubic",
  "easeOutQuart",
  "easeOutQuint",
  "easeInOut",
  "easeInOutQuad",
  "easeInOutCubic",
  "easeInOutQuart",
  "easeInOutQuint",
  "easeOutBounce",
  "easeOutElastic",
];

function parseErrors(code: string, lang: "ts" | "js"): string[] {
  const result = ts.transpileModule(code, {
    reportDiagnostics: true,
    fileName: lang === "ts" ? "snippet.ts" : "snippet.js",
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      allowJs: true,
    },
  });
  return (result.diagnostics ?? []).map((d) =>
    ts.flattenDiagnosticMessageText(d.messageText, " ")
  );
}

/** Builds a callable from a selection's ordered JS sources (deps first). */
function evaluateSelection(keys: string[]): Record<string, unknown> {
  const { picked, dependencies } = gatherSelection(keys);
  const body = [...dependencies, ...picked].map((e) => e.jsSource).join("\n");
  const names = [...dependencies, ...picked].map((e) => e.key);
  const factory = new Function(`${body};\nreturn { ${names.join(", ")} };`);
  return factory();
}

describe("export catalog integrity", () => {
  it("committed exportCatalogData.ts matches a fresh generation", () => {
    const fresh = generateExportCatalog() as {
      entries: unknown[];
      excluded: Record<string, string>;
    };
    expect(EXPORT_CATALOG_DATA).toEqual(fresh.entries);
    expect(EXPORT_CATALOG_EXCLUDED).toEqual(fresh.excluded);
  });

  it("catalog keys are unique", () => {
    expect(new Set(ALL_KEYS).size).toBe(ALL_KEYS.length);
  });

  it("catalog entries + exclusions cover core-api.json exactly, with reasons", () => {
    const apiNames = (coreApi as Array<{ name: string }>).map((e) => e.name);
    const covered = new Set([...ALL_KEYS, ...Object.keys(EXPORT_CATALOG_EXCLUDED)]);
    const missing = apiNames.filter((n) => !covered.has(n)).sort();
    const stale = [...covered].filter((n) => !apiNames.includes(n)).sort();
    const doubled = ALL_KEYS.filter((k) => k in EXPORT_CATALOG_EXCLUDED).sort();
    const reasonless = Object.entries(EXPORT_CATALOG_EXCLUDED)
      .filter(([, reason]) => !reason || reason.trim() === "")
      .map(([name]) => name);
    expect({ missing, stale, doubled, reasonless }).toEqual({
      missing: [],
      stale: [],
      doubled: [],
      reasonless: [],
    });
  });

  it("all 18 easing functions have separate entries", () => {
    const missing = EASING_KEYS.filter((k) => !getCatalogEntry(k));
    expect(missing).toEqual([]);
  });

  it("every dependency key exists in the catalog", () => {
    const dangling: string[] = [];
    for (const entry of EXPORT_CATALOG) {
      for (const dep of entry.dependencyKeys) {
        if (!getCatalogEntry(dep)) dangling.push(`${entry.key} → ${dep}`);
      }
    }
    expect(dangling).toEqual([]);
  });

  it("every tsSource parses as TypeScript", () => {
    const failures: string[] = [];
    for (const entry of EXPORT_CATALOG) {
      const errors = parseErrors(entry.tsSource, "ts");
      if (errors.length) failures.push(`${entry.key}: ${errors[0]}`);
    }
    expect(failures).toEqual([]);
  });

  it("every jsSource parses as JavaScript", () => {
    const failures: string[] = [];
    for (const entry of EXPORT_CATALOG) {
      try {
        new vm.Script(entry.jsSource);
      } catch (error) {
        failures.push(`${entry.key}: ${(error as Error).message}`);
      }
    }
    expect(failures).toEqual([]);
  });
});

describe("formatted export files parse", () => {
  it("every individual selection produces parseable TS and JS files", () => {
    const failures: string[] = [];
    for (const key of ALL_KEYS) {
      for (const lang of ["ts", "js"] as const) {
        const code = formatExport(lang, [key]);
        const errors = parseErrors(code, lang);
        if (errors.length) failures.push(`${key} (${lang}): ${errors[0]}`);
      }
    }
    expect(failures).toEqual([]);
  });

  it("the all-functions TS and JS files parse", () => {
    for (const lang of ["ts", "js"] as const) {
      expect(parseErrors(formatExport(lang, ALL_KEYS), lang)).toEqual([]);
    }
  });

  it("representative combinations parse in both languages", () => {
    const combos: string[][] = [
      ["lerp", "clamp"],
      ["circleCircle", "polygonCircle"],
      EASING_KEYS,
      ["lerpColor", "lerpColorHsl", "colorFamily", "rgbToCss", "rgbToHsl", "hslToRgb"],
      ["springValue", "criticalDamping"],
    ];
    const failures: string[] = [];
    for (const combo of combos) {
      for (const lang of ["ts", "js"] as const) {
        const errors = parseErrors(formatExport(lang, combo), lang);
        if (errors.length)
          failures.push(`${combo.join("+")} (${lang}): ${errors[0]}`);
      }
    }
    expect(failures).toEqual([]);
  });
});

describe("generated JavaScript executes like @utilspalooza/core", () => {
  it("scalar and easing snippets return the same values as the package", () => {
    const fns = evaluateSelection([
      "lerp",
      "clamp",
      "mapRange",
      "easeOutBounce",
      "easeInOutCubic",
    ]) as Record<string, (...args: number[]) => number>;
    expect(fns.lerp(0, 100, 0.25)).toBe(lerp(0, 100, 0.25));
    expect(fns.clamp(42, 0, 10)).toBe(clamp(42, 0, 10));
    expect(fns.mapRange(5, 0, 10, 0, 360)).toBe(mapRange(5, 0, 10, 0, 360));
    expect(fns.easeOutBounce(0.3)).toBe(easeOutBounce(0.3));
    expect(fns.easeInOutCubic(0.7)).toBe(easeInOutCubic(0.7));
  });

  it("collision, color, spring, and tween snippets match the package", () => {
    const fns = evaluateSelection([
      "circleCircle",
      "lerpColorHsl",
      "springValue",
      "tweenValue",
    ]) as Record<string, (...args: unknown[]) => unknown>;
    const a = { x: 0, y: 0, radius: 5 };
    const b = { x: 6, y: 0, radius: 5 };
    expect(fns.circleCircle(a, b)).toBe(circleCircle(a, b));
    expect(
      fns.lerpColorHsl({ r: 255, g: 0, b: 0 }, { r: 0, g: 0, b: 255 }, 0.5)
    ).toEqual(lerpColorHsl({ r: 255, g: 0, b: 0 }, { r: 0, g: 0, b: 255 }, 0.5));
    expect(fns.springValue({ value: 0, velocity: 0 }, 1)).toEqual(
      springValue({ value: 0, velocity: 0 }, 1)
    );
    expect(fns.tweenValue(0, 10, 250, 500)).toBe(tweenValue(0, 10, 250, 500));
  });
});
