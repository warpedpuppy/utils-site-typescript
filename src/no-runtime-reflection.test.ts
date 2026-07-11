import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// Guard for CODE-QUALITY-SECURITY-REVIEW-2026-07-11 Work Package 2A: no
// user-facing name, docs link, or heading may be derived from Function.name —
// production minification rewrites those names, so labels and /api?fn= links
// silently break in the shipped bundle. The explicit identity lives in the
// registry as primaryCoreExport; use that instead.

const SCANNED_ROOTS = ["src/components", "src/pages", "src/services"];

const BANNED_PATTERNS = [
  "keyFunction.name",
  "keyFunction?.name",
  "animationObject.keyFunction.name",
];

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, out);
    } else if (/\.(ts|tsx)$/.test(entry) && !/\.test\.(ts|tsx)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

describe("no Function.name reflection in user-facing code", () => {
  it("keyFunction.name never reaches a component, page, or service", () => {
    const offenders: string[] = [];
    for (const root of SCANNED_ROOTS) {
      for (const file of walk(root)) {
        const source = readFileSync(file, "utf8");
        for (const pattern of BANNED_PATTERNS) {
          if (source.includes(pattern)) {
            offenders.push(`${file}: contains "${pattern}"`);
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
