import { AnimationInstance, CollisionDetectionObject } from "../types/types";

/** The seven sidebar categories, in display order. Do not reorder. */
export const CATEGORY_ORDER = [
  "motion & easing",
  "trig, angles & vectors",
  "collision detection",
  "numbers in motion",
  "geometry & shapes",
  "generative showpieces",
  "handy helpers",
] as const;

export type Category = (typeof CATEGORY_ORDER)[number];

/**
 * How this animation relates to the Studio CodePen catalogue. These values
 * replace the hand-maintained Sets currently living inside
 * studio-pens-sync.test.ts and studio-codepen-runtime.test.ts:
 *
 * - "canonical-vm-tested"  — pen embeds the standalone drawX() verbatim AND
 *                            is in the VM runtime smoke-test allowlist
 *                            (today: CANONICAL_DRAW_PEN_KEYS in
 *                            studio-codepen-runtime.test.ts).
 * - "canonical"            — pen embeds drawX() verbatim; identity-checked
 *                            but not VM-booted.
 * - "handwritten"          — pen exists but predates canonicalization; only
 *                            coverage is checked, not identity.
 * - "effects-mount"        — mounted via @utilspalooza/effects; exempt from
 *                            draw identity.
 * - "mini-demo-no-pen"     — docs-first scalar; deliberately has NO pen
 *                            (today: MINI_DEMO_KEYS). The no-pen rule is
 *                            CLAUDE.md law ("mini-demo is never a pen source").
 * - "hidden-no-pen"        — include:false record that has no Studio pen at
 *                            all (the hidden balls-bouncing duplicate). Its
 *                            old "canonical-vm-tested" label was stale data:
 *                            no pen ever existed post-canonicalization, and
 *                            the old gallery-driven VM test could not notice.
 */
export type PenStatus =
  | "canonical-vm-tested"
  | "canonical"
  | "handwritten"
  | "effects-mount"
  | "mini-demo-no-pen"
  | "hidden-no-pen";

export interface RegistryRecord {
  /** Canonical id: === manifest `slug`, === animation `static l`, === pen `key`. */
  slug: string;
  /** Sidebar/display title: === manifest `title`. */
  title: string;
  category: Category;
  /**
   * LEGACY manifest entry key ("ballBounce", "LerpAnimation", …). Copied
   * verbatim from today's animationManifest.ts. Used for the derived
   * manifest's object keys and therefore for localStorage selections.
   * NEVER invent or normalize these.
   */
  manifestKey: string;
  /** Mirrors today's optional `include: false` (hidden from sidebars). */
  include?: boolean;
  /** The existing formula wrapper object (=== manifest `formula`). */
  formula: CollisionDetectionObject;
  /** Literal dynamic import of the animation class (today's `load`). */
  load: () => Promise<{ default: new (containerId: string) => AnimationInstance }>;
  /**
   * Names of the @utilspalooza/core exports this animation teaches, exactly
   * as they appear in core-api.json `name` fields (e.g. ["lerp"],
   * ["boidsStep", "DEFAULT_BOIDS_OPTIONS"]). Drives the core-coverage test
   * (§7, test A4). Must be non-empty unless coreExports-exempt categories
   * apply — there are none in Phase A, so: non-empty, always.
   */
  coreExports: string[];
  /**
   * The ONE canonical @utilspalooza/core export name this animation primarily
   * teaches — used for every user-facing function label and docs deep-link
   * (`/api?fn=…`). This replaces reading `formula.keyFunction.name` at
   * runtime, which minification breaks in production. Must appear in this
   * record's `coreExports` and in core-api.json; `null` only when no core
   * function is a truthful target (pure showpieces / effects mounts).
   */
  primaryCoreExport: string | null;
  pen: PenStatus;
}

// ─── Legacy manifest shape (moved verbatim from animationManifest.ts) ─────────
// This is the new home of these interfaces; animationManifest.ts re-exports
// them so existing consumers keep working. registry/index.ts must never import
// from animationManifest.ts, hence types live here (types → registry → shim).

export interface AnimationManifestEntry {
  title: string;
  slug: string;
  include?: boolean;
  formula: CollisionDetectionObject;
  load: () => Promise<{ default: new (containerId: string) => AnimationInstance }>;
  /** Carried from RegistryRecord.primaryCoreExport — see that field's doc. */
  primaryCoreExport: string | null;
}

export interface AnimationManifest {
  [category: string]: Record<string, AnimationManifestEntry>;
}
