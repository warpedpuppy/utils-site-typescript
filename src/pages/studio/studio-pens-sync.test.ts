import { describe, it, expect } from "vitest";
import SiteData from "../../SiteData";
import { CODEPEN_GALLERY } from "./pens";

/**
 * Studio has two kinds of CodePens:
 *
 *   1. Example-derived pens keyed by the exact /examples manifest slug.
 *   2. Explicit Studio-only projects such as the Audio Visualizer.
 *
 * The catalogue sync rule is strict for #1: every included /examples animation
 * gets exactly one matching Studio pen. The draw-function identity rule is
 * currently scoped to the pens that have actually been canonicalized to embed
 * their `src/core-animations` standalone draw function verbatim.
 */

// ─── The Examples catalogue: every animation registered in SiteData ──────────
// (the single source both surfaces are supposed to feed from)
interface AnimationClass {
  l?: string; // slug  (static l)
  t?: string; // title (static t)
  include?: boolean;
}

const exampleAnimations: { slug: string; title: string }[] = [];
for (const category of Object.values(SiteData)) {
  for (const cls of Object.values(category as Record<string, AnimationClass>)) {
    if (cls && typeof cls.l === "string" && cls.include !== false) {
      exampleAnimations.push({ slug: cls.l, title: cls.t ?? cls.l });
    }
  }
}

const STUDIO_ONLY_KEYS = new Set(["audio-visualizer", "demystify-sine-cosine"]);

const CANONICAL_DRAW_PEN_KEYS = new Set([
  "angle-lerp-shortest-turn",
  "ball-bounce",
  "ball-orbiting-a-sun",
  "balls-bouncing-against-each-other",
  "color-families",
  "color-lerp",
  "distribute-around-circle",
  "easing-functions",
  "draw-star",
  "find-points-on-a-circle",
  "get-a-point-on-a-line",
  "line-length",
  "lerp-smooth-follow",
  "move-to-changing-point",
  "murmuration",
  "point-object-towards-another",
  "quadratic-bezier-curve",
  "sine-curve",
  "spring-damped-harmonic",
  "vector-reflection",
  "vector-rotation",
]);

// ─── The Studio dropdown: example-derived pens only ─────────────────────────
const examplePenKeys = CODEPEN_GALLERY
  .map((p) => p.key)
  .filter((key) => !STUDIO_ONLY_KEYS.has(key));

// ─── Every core-animations module (for its standalone draw* functions) ───────
const animationModules = import.meta.glob(
  ["../../core-animations/*.{ts,tsx}", "!../../core-animations/*.test.ts"],
  { eager: true }
) as Record<string, Record<string, unknown>>;

describe("Studio pens stay in sync with the Examples page", () => {
  it("has exactly one Studio pen per Examples animation (same quantity)", () => {
    expect(examplePenKeys.length).toBe(exampleAnimations.length);
  });

  it("every Examples animation has a pen with a matching slug, and there are no orphan pens", () => {
    const slugs = new Set(exampleAnimations.map((a) => a.slug));
    const keys = new Set(examplePenKeys);

    const missingPens = [...slugs].filter((s) => !keys.has(s)).sort();
    const orphanPens = [...keys].filter((k) => !slugs.has(k)).sort();

    expect({ missingPens, orphanPens }).toEqual({
      missingPens: [],
      orphanPens: [],
    });
  });

  it("canonicalized pens embed their animation's standalone draw function verbatim", () => {
    const failures: string[] = [];

    for (const [path, mod] of Object.entries(animationModules)) {
      if (path.includes(".test.")) continue;

      const cls = mod.default as AnimationClass | undefined;
      const slug = cls?.l;
      if (!slug) continue; // not an animation (base class / template / helper)
      if (!exampleAnimations.some((a) => a.slug === slug)) continue;
      if (!CANONICAL_DRAW_PEN_KEYS.has(slug)) continue;

      // The iron rule's "standalone draw functions" — module-level exports
      // named draw* that CodePen can embed via .toString().
      const drawFns = Object.entries(mod).filter(
        ([name, val]) => name.startsWith("draw") && typeof val === "function"
      ) as [string, (...args: unknown[]) => unknown][];

      const pen = CODEPEN_GALLERY.find((p) => p.key === slug);
      if (!pen) {
        failures.push(`${slug}: no Studio pen with a matching slug`);
        continue;
      }
      expect(drawFns.length, `${slug} exports at least one draw* function`).toBeGreaterThan(0);

      for (const [name, fn] of drawFns) {
        if (!pen.payload.js.includes(fn.toString())) {
          failures.push(
            `${slug}: pen does not embed ${name}() verbatim — they have drifted`
          );
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
