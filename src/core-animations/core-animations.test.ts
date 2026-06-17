import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, "../..");

function readSrc(relPath: string): string {
  return readFileSync(resolve(root, "src", relPath), "utf-8");
}

function extractImportPaths(source: string): string[] {
  const matches = source.matchAll(/from\s+["']([^"']+)["']/g);
  return Array.from(matches, (m) => m[1]);
}

// ─── Test 1: Consolidation Rule ──────────────────────────────────────────────
// All animations must live in src/core-animations/ and nowhere else.

describe("Consolidation rule: all animations in core-animations", () => {
  const siteData = readSrc("SiteData.ts");
  const paths = extractImportPaths(siteData);

  it("SiteData.ts has no imports from pages/examples/animations", () => {
    const violations = paths.filter((p) => p.includes("pages/examples/animations"));
    expect(violations).toEqual([]);
  });
});

describe("pens-examples.ts consolidation", () => {
  const pensExamples = readSrc("pages/studio/pens-examples.ts");
  const paths = extractImportPaths(pensExamples);

  it("has no imports from pages/examples/animations", () => {
    const violations = paths.filter((p) => p.includes("pages/examples/animations"));
    expect(violations).toEqual([]);
  });
});

// ─── Test 2: Collision animations are in core-animations ────────────────────

describe("Collision detection animations — location verification", () => {
  const siteData = readSrc("SiteData.ts");

  const collisionAnimations = [
    "PointToCircle",
    "CircleToCircle",
    "RectToRect",
    "PointToRect",
    "CircleToRect",
    "LineToCircle",
    "LineToLine",
    "LineToPoint",
    "LineToRect",
    "PolygonToPolygonCollision",
  ];

  for (const anim of collisionAnimations) {
    it(`${anim}: SiteData imports from core-animations`, () => {
      expect(siteData).toContain(`"./core-animations/${anim}"`);
    });
  }
});

// ─── Test 3: Point-to-Circle animation uses canonical draw function ─────────

describe("Point-to-Circle: CodePen uses canonical draw function", () => {
  const pensExamples = readSrc("pages/studio/pens-examples.ts");
  const pointToCircleAnim = readSrc("core-animations/PointToCircle.tsx");

  it("PointToCircle animation exports drawPointToCircle", () => {
    expect(pointToCircleAnim).toContain("export function drawPointToCircle");
  });

  it("pens-examples imports drawPointToCircleFunctionString from core-animations", () => {
    expect(pensExamples).toContain(
      'import { drawPointToCircleFunctionString } from "../../core-animations/PointToCircle'
    );
  });

  it("CodePen calls drawPointToCircle in animation loop", () => {
    expect(pensExamples).toContain("drawPointToCircle(ctx");
  });
});
