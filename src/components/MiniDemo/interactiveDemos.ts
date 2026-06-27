// ─────────────────────────────────────────────────────────────────────────────
// interactiveDemos — docs-altitude "play with the arguments" descriptors.
//
// PROOF OF CONCEPT (mapRange only). This is the slider version of a scalar
// mini-demo: instead of auto-sweeping a baked-in input like scalarTransforms.ts,
// the reader drags the function's REAL arguments and watches the live call +
// canvas update. The math is still single-sourced from @utilspalooza/core — this
// file never re-implements it, it only describes which args are draggable and
// how to invoke the core function with them.
//
// Deliberately SEPARATE from scalarTransforms.ts: that registry is shared with
// the /examples animation classes (anti-drift), and its `sample(t)` bakes the
// constants in. Interactivity lives here so /examples keeps auto-playing and the
// two-altitude line stays crisp (CLAUDE.md, "Docs are friendly, visual, ELI5").
// ─────────────────────────────────────────────────────────────────────────────

import { mapRange } from "@utilspalooza/core/MapRange";

/** One draggable argument of an interactive scalar demo. */
export interface DemoArg {
  /** Name as it reads in the call, e.g. "v", "inMin", "outMax". */
  name: string;
  min: number;
  max: number;
  step: number;
  /** Starting value. */
  value: number;
  /**
   * The swept input. Exactly one arg is the input: it auto-animates across its
   * [min, max] until the reader grabs its slider, then it scrubs manually.
   */
  input?: boolean;
}

/** A scalar function whose arguments are exposed as live sliders in the docs. */
export interface InteractiveScalarDemo {
  /** Core export name, e.g. "mapRange". Keys the /api wiring. */
  fnName: string;
  /** Args in call order. */
  args: DemoArg[];
  /** Invoke the live core function with the current argument values. */
  call: (a: number[]) => number;
  /** Index into `args` of the swept input. */
  inputIndex: number;
  /** Left (input) pane range, derived from the current args. */
  inputRange: (a: number[]) => { min: number; max: number };
  /** Right (output) pane range, derived from the current args. */
  outputRange: (a: number[]) => { min: number; max: number };
}

export const mapRangeInteractive: InteractiveScalarDemo = {
  fnName: "mapRange",
  // Ranges are chosen so inMin can't cross inMax (and outMin can't cross outMax),
  // which keeps the live call from ever dividing by zero in a teaching tool.
  args: [
    { name: "v", min: 0, max: 100, step: 1, value: 50, input: true },
    { name: "inMin", min: 0, max: 40, step: 1, value: 0 },
    { name: "inMax", min: 60, max: 140, step: 1, value: 100 },
    { name: "outMin", min: 0, max: 120, step: 1, value: 0 },
    { name: "outMax", min: 200, max: 360, step: 1, value: 360 },
  ],
  call: ([v, inMin, inMax, outMin, outMax]) => mapRange(v, inMin, inMax, outMin, outMax),
  inputIndex: 0,
  inputRange: ([, inMin, inMax]) => ({ min: inMin, max: inMax }),
  outputRange: ([, , , outMin, outMax]) => ({ min: outMin, max: outMax }),
};

/** Keyed by core export name, mirroring MINI_DEMOS in ApiDocs. */
export const INTERACTIVE_DEMOS: Record<string, InteractiveScalarDemo> = {
  mapRange: mapRangeInteractive,
};
