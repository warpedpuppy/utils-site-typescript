import { describe, expect, it } from "vitest";
import animationManifest from "../../animationManifest";
import coreApi from "./core-api.json";
import {
  ENTRY_DOCS,
  getEntryIntro,
  getEntryTabs,
  getEntryUsageLead,
  MODULE_GUIDES,
  getEntryVisual,
} from "./docsManifest";

interface ApiEntry {
  name: string;
  module: string;
  kind: string;
}

const apiEntries = coreApi as ApiEntry[];

function getExampleSlugs() {
  return new Set(
    Object.values(animationManifest).flatMap((category) =>
      Object.values(category).map((entry) => entry.slug),
    ),
  );
}

describe("api docs manifest", () => {
  it("guide key pieces all point at real exports in their module", () => {
    const exportIds = new Set(apiEntries.map((entry) => `${entry.module}:${entry.name}`));

    for (const [module, guide] of Object.entries(MODULE_GUIDES)) {
      for (const pieceName of guide.keyPieceNames) {
        expect(exportIds.has(`${module}:${pieceName}`)).toBe(true);
      }
    }
  });

  it("example visuals only point at real example routes", () => {
    const exampleSlugs = getExampleSlugs();

    for (const entry of apiEntries) {
      const visual = getEntryVisual(entry.name);
      if (visual.kind !== "example") continue;
      expect(visual.exampleSlug).toBeTruthy();
      expect(exampleSlugs.has(visual.exampleSlug!)).toBe(true);
    }
  });

  it("every export gets at least one docs tab", () => {
    for (const entry of apiEntries) {
      expect(getEntryTabs(entry).length).toBeGreaterThan(0);
    }
  });

  it("related-entry links point at real exports", () => {
    const exportNames = new Set(apiEntries.map((entry) => entry.name));

    for (const entry of apiEntries) {
      for (const related of getEntryIntro(entry).related) {
        expect(exportNames.has(related.name)).toBe(true);
      }
    }
  });

  it("every function export has a bespoke Explain It intro (easing family excepted)", () => {
    // Coverage reached 100% of function exports on 2026-07-05; this fence keeps
    // it there. A missing ENTRY_DOCS entry silently falls back to generated
    // boilerplate, so without this test the regression would be invisible.
    // The Easing module is the one sanctioned exception: its intros are built
    // from the shared family writeup plus each curve's own JSDoc line (which
    // api-docs-complete.test.ts enforces), so per-curve entries would only
    // duplicate that.
    const missing = apiEntries
      .filter((entry) => entry.kind === "function" && entry.module !== "Easing")
      .filter((entry) => {
        const doc = ENTRY_DOCS[entry.name];
        return !doc?.whatItIs?.trim() || !doc?.howToUse?.trim();
      })
      .map((entry) => `${entry.module}:${entry.name}`);

    expect(missing).toEqual([]);
  });

  it("angle interpolation entries get specific usage leads", () => {
    expect(getEntryUsageLead({ module: "AngleInterpolation", name: "lerpAngle" })).toContain("short turn");
    expect(getEntryUsageLead({ module: "AngleInterpolation", name: "shortestAngleBetween" })).toContain("signed shortest turn");
    expect(getEntryUsageLead({ module: "AngleInterpolation", name: "wrapAngle" })).toContain("370°");
  });

  // The Full Reference's default view is a table of contents whose rows render
  // each entry as "name + usage lead" — a blank lead would render a broken row.
  it("every export has a non-empty usage lead for the table-of-contents index", () => {
    const missing = apiEntries
      .filter(
        (entry) =>
          getEntryUsageLead({
            module: entry.module,
            name: entry.name,
            kind: entry.kind as "function" | "const" | "type",
          }).trim() === "",
      )
      .map((entry) => `${entry.module}:${entry.name}`);

    expect(missing).toEqual([]);
  });

  it("collision entries get shape-specific usage leads", () => {
    expect(getEntryUsageLead({ module: "PointToCircle", name: "pointToCircle" })).toBe(
      "This one helps answer: is this point inside the circle yet?",
    );
    expect(getEntryUsageLead({ module: "LineToLine", name: "lineToLine" })).toBe(
      "This one helps answer: are these lines crossing yet?",
    );
    expect(getEntryUsageLead({ module: "RectToRect", name: "rectToRect" })).toBe(
      "This one helps answer: are these rectangles overlapping yet?",
    );
  });
});
