import { describe, it, expect } from "vitest";
import SiteData from "../../SiteData";
import { CODEPEN_GALLERY } from "./pens";
import { ALL_RECORDS } from "../../registry";

/**
 * Studio has two kinds of CodePens:
 *
 *   1. Example-derived pens keyed by the exact /examples manifest slug.
 *   2. Explicit Studio-only projects such as the Audio Visualizer.
 *
 * The catalogue sync rule is strict for #1: every included /examples animation
 * gets exactly one matching Studio pen. The draw-function identity rule is
 * currently scoped to the pens that have actually been canonicalized to embed
 * their `src/core-animations` standalone draw function verbatim; effects
 * mounted through `@utilspalooza/effects` are explicit exceptions.
 */

// ─── The Examples catalogue: every animation registered in SiteData ──────────
// (the single source both surfaces are supposed to feed from)
// Shape of an animation CLASS's static metadata (read off `mod.default` below).
// These stay single-letter (`static t`/`static l`) — only the *manifest* keys
// were renamed to title/slug.
interface AnimationClass {
  l?: string; // slug  (static l)
  t?: string; // title (static t)
  include?: boolean;
}

// The manifest entries themselves now expose `slug`/`title` (not `l`/`t`).
const exampleAnimations: { slug: string; title: string }[] = [];
for (const category of Object.values(SiteData)) {
  for (const entry of Object.values(category)) {
    if (typeof entry.slug === "string" && entry.include !== false) {
      exampleAnimations.push({ slug: entry.slug, title: entry.title ?? entry.slug });
    }
  }
}

// These lists are now DERIVED from the registry's per-record `pen` field,
// replacing the hand-maintained Sets that used to live here (REGISTRY-
// CONSOLIDATION-SPEC step 6). Studio-only projects (the Audio Visualizer) are
// not animations and never enter the registry, so that stays a literal Set.
const STUDIO_ONLY_KEYS = new Set(["audio-visualizer"]);
const slugsWithPen = (...statuses: string[]): Set<string> =>
  new Set(
    ALL_RECORDS.filter((r) => statuses.includes(r.pen)).map((r) => r.slug)
  );

// Effects-backed pens (mounted via @utilspalooza/effects) are exempt from the
// standalone draw-function identity check.
const EFFECT_MOUNT_EXCEPTION_KEYS = slugsWithPen("effects-mount");

// Docs-first scalar primitives (the "numbers in motion" group). These appear on
// /examples via the shared scalar mini-demo but intentionally have NO CodePen
// pen — the mini-demo is never a pen source (CLAUDE.md, "Docs are friendly,
// visual, and ELI5"). They are therefore excluded from the pen-per-animation
// quantity and missing-pen checks below.
const MINI_DEMO_KEYS = slugsWithPen("mini-demo-no-pen");

// Animations expected to have a matching pen: everything on /examples except the
// docs-first scalar mini-demos.
const pennedAnimations = exampleAnimations.filter(
  (a) => !MINI_DEMO_KEYS.has(a.slug)
);

// Pens whose embedded draw function is identity-checked against the animation's
// standalone drawX(): the VM-booted canonical pens plus the identity-only
// canonical pens (bezier-curves, circle-field).
const CANONICAL_DRAW_PEN_KEYS = slugsWithPen("canonical-vm-tested", "canonical");

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
    expect(examplePenKeys.length).toBe(pennedAnimations.length);
  });

  it("every Examples animation has a pen with a matching slug, and there are no orphan pens", () => {
    const slugs = new Set(pennedAnimations.map((a) => a.slug));
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
      if (EFFECT_MOUNT_EXCEPTION_KEYS.has(slug)) continue;
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
