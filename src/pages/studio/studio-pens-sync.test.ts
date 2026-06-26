import { describe, it, expect } from "vitest";
import SiteData from "../../SiteData";
import { CODEPEN_GALLERY } from "./pens";

/**
 * IRON RULE ENFORCEMENT (CLAUDE.md, "One canonical source per animation"):
 *
 *   "All animation classes and their standalone draw functions live in
 *    src/core-animations/. The Examples page and the CodePen pens both feed
 *    from here and must be identical."
 *
 * Today that rule is VIOLATED — the pens in pens-examples.ts are hand-written
 * copies, so they drift from the Examples animations and some are missing
 * entirely. These tests are the spec the fix must satisfy. They are EXPECTED TO
 * FAIL until the Studio pens are brought back into sync with the Examples page.
 *
 * Three guarantees:
 *   1. Same quantity   — one Studio dropdown pen per Examples animation.
 *   2. Same catalogue  — every animation has a pen with a matching slug, and no
 *                        pen exists without a corresponding animation.
 *   3. Same code       — each pen embeds its animation's canonical standalone
 *                        draw function VERBATIM (so they cannot drift).
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

// ─── The Studio dropdown: every pen the user can pick in /studio ─────────────
const penKeys = CODEPEN_GALLERY.map((p) => p.key);

// ─── Every core-animations module (for its standalone draw* functions) ───────
const animationModules = import.meta.glob("../../core-animations/*.{ts,tsx}", {
  eager: true,
}) as Record<string, Record<string, unknown>>;

describe("Studio pens stay in sync with the Examples page (iron rule)", () => {
  it("has exactly one Studio pen per Examples animation (same quantity)", () => {
    expect(penKeys.length).toBe(exampleAnimations.length);
  });

  it("every Examples animation has a pen with a matching slug, and there are no orphan pens", () => {
    const slugs = new Set(exampleAnimations.map((a) => a.slug));
    const keys = new Set(penKeys);

    const missingPens = [...slugs].filter((s) => !keys.has(s)).sort();
    const orphanPens = [...keys].filter((k) => !slugs.has(k)).sort();

    expect({ missingPens, orphanPens }).toEqual({
      missingPens: [],
      orphanPens: [],
    });
  });

  it("each pen embeds its animation's canonical standalone draw function verbatim (no drift)", () => {
    const failures: string[] = [];

    for (const [path, mod] of Object.entries(animationModules)) {
      if (path.includes(".test.")) continue;

      const cls = mod.default as AnimationClass | undefined;
      const slug = cls?.l;
      if (!slug) continue; // not an animation (base class / template / helper)
      if (!exampleAnimations.some((a) => a.slug === slug)) continue;

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
      if (drawFns.length === 0) {
        failures.push(
          `${slug}: animation exports no standalone draw* function for the pen to share (iron rule requires one)`
        );
        continue;
      }
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
