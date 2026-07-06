import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import animationManifest from "../animationManifest";

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

  it("SiteData.ts does not eagerly import core animation classes", () => {
    const violations = paths.filter((p) => p.includes("core-animations"));
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

// ─── Motion-gate rule: frames go through this.raf(), never raw rAF ──────────
// The base classes' raf() implements the reduced-motion gate (one still frame,
// then hold until the visitor presses play) and pause/resume. A subclass that
// calls requestAnimationFrame directly silently bypasses that gate — an a11y
// regression no other test would catch.

describe("Motion-gate rule: no direct requestAnimationFrame in animations", () => {
  const allowed = new Set([
    "AnimationBaseClass.tsx", // owns raf() — the one legitimate call site
    "animationTemplate.tsx", // owns raf() — the one legitimate call site
    "core-animations.test.ts", // this file mentions the string
  ]);

  const files = readdirSync(resolve(root, "src/core-animations")).filter(
    (f) => /\.tsx?$/.test(f) && !allowed.has(f)
  );

  it("scans a plausible number of animation files", () => {
    expect(files.length).toBeGreaterThan(40);
  });

  for (const file of files) {
    it(`${file} schedules frames only via this.raf()`, () => {
      const source = readSrc(`core-animations/${file}`);
      expect(source).not.toContain("requestAnimationFrame(");
    });
  }
});

// ─── Test 2: Collision animations are in core-animations ────────────────────

describe("Collision detection animations — location verification", () => {
  // The literal lazy-load thunks now live in the registry category file
  // (animationManifest.ts is a shim that derives the manifest from the records).
  const collisionRegistry = readSrc("registry/categories/collisionDetection.ts");

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
    it(`${anim}: the registry lazy-loads it from core-animations`, () => {
      expect(collisionRegistry).toContain(`import("../../core-animations/${anim}")`);
    });
  }
});

describe("Animation manifest metadata", () => {
  it("matches title/slug/include metadata on the loaded animation classes", async () => {
    const failures: string[] = [];

    for (const [categoryName, category] of Object.entries(animationManifest)) {
      for (const [animationKey, entry] of Object.entries(category)) {
        const { default: AnimationClass } = await entry.load();
        if (AnimationClass.t !== entry.title) {
          failures.push(
            `${categoryName}.${animationKey}: title ${entry.title} does not match ${AnimationClass.t}`
          );
        }
        if (AnimationClass.l !== entry.slug) {
          failures.push(
            `${categoryName}.${animationKey}: slug ${entry.slug} does not match ${AnimationClass.l}`
          );
        }
        if (AnimationClass.include !== entry.include) {
          failures.push(
            `${categoryName}.${animationKey}: include ${entry.include} does not match ${AnimationClass.include}`
          );
        }
      }
    }

    expect(failures).toEqual([]);
  });
});

// ─── Test 3: Point-to-Circle animation uses canonical draw function ─────────

describe("Point-to-Circle: CodePen uses canonical draw function", () => {
  const pensExamples = readSrc("pages/studio/pens-examples.ts");
  const pointToCircleAnim = readSrc("core-animations/PointToCircle.tsx");

  it("PointToCircle animation exports drawPointToCircle", () => {
    expect(pointToCircleAnim).toContain("export function drawPointToCircle");
  });

  it("pens-examples imports drawPointToCircle from core-animations", () => {
    expect(pensExamples).toContain(
      'import { drawPointToCircle } from "../../core-animations/PointToCircle'
    );
  });

  it("CodePen calls drawPointToCircle in animation loop", () => {
    expect(pensExamples).toContain("drawPointToCircle(");
  });
});
