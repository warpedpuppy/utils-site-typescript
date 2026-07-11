import { describe, expect, it } from "vitest";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import { CODEPEN_FUNCTION_SOURCES } from "./generatedCodepenSources";
// @ts-expect-error — plain .mjs build script, no type declarations.
import { generateCodepenSources } from "../../../scripts/generate-codepen-sources.mjs";

// Fences for the build-time CodePen source pipeline (2026-07-11 review, WP2B):
// the committed generated module must match a fresh generation from the
// canonical TypeScript sources, every generated string must be valid
// JavaScript, and the pen files must never regrow runtime
// Function.prototype.toString() serialization (which production minification
// breaks — that was the root cause of every shipped payload throwing
// ReferenceError).

describe("generated CodePen sources", () => {
  it("committed generatedCodepenSources.ts matches a fresh generation", () => {
    const fresh = generateCodepenSources() as Record<string, string>;
    expect(CODEPEN_FUNCTION_SOURCES).toEqual(fresh);
  });

  it("every generated source parses as standalone JavaScript", () => {
    const failures: string[] = [];
    for (const [name, source] of Object.entries(CODEPEN_FUNCTION_SOURCES)) {
      try {
        new vm.Script(source);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failures.push(`${name}: ${message}`);
      }
      if (!source.includes(name)) {
        failures.push(`${name}: generated source lost its identifier`);
      }
    }
    expect(failures).toEqual([]);
  });

  it("pen files contain no .toString() in executable code", () => {
    // Kept simple and exact on purpose: the files must not contain the
    // substring at all. Any comment that needs to discuss serialization should
    // describe the generated-source pipeline instead.
    const penFiles = [
      "src/pages/studio/pens-examples.ts",
      "src/pages/studio/pens.ts",
    ];
    const offenders = penFiles.filter((file) =>
      readFileSync(file, "utf8").includes(".toString()")
    );
    expect(offenders).toEqual([]);
  });
});
