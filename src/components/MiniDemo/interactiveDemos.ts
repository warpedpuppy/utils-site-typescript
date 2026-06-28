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

import { lerp } from "@utilspalooza/core/Lerp";
import { inverseLerp } from "@utilspalooza/core/InverseLerp";
import { mapRange } from "@utilspalooza/core/MapRange";
import { clamp } from "@utilspalooza/core/Clamp";
import { wrap } from "@utilspalooza/core/Wrap";
import { pingPong } from "@utilspalooza/core/PingPong";
import { smoothstep, smootherstep } from "@utilspalooza/core/Smoothstep";

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

export const lerpInteractive: InteractiveScalarDemo = {
  fnName: "lerp",
  args: [
    { name: "a", min: 0, max: 80, step: 1, value: 0 },
    { name: "b", min: 100, max: 200, step: 1, value: 100 },
    { name: "t", min: 0, max: 1, step: 0.01, value: 0.5, input: true },
  ],
  call: ([a, b, t]) => lerp(a, b, t),
  inputIndex: 2,
  inputRange: () => ({ min: 0, max: 1 }),
  outputRange: ([a, b]) => ({ min: a, max: b }),
};

export const inverseLerpInteractive: InteractiveScalarDemo = {
  fnName: "inverseLerp",
  args: [
    { name: "a", min: 0, max: 80, step: 1, value: 0 },
    { name: "b", min: 100, max: 200, step: 1, value: 100 },
    { name: "value", min: 0, max: 200, step: 1, value: 50, input: true },
  ],
  call: ([a, b, v]) => inverseLerp(a, b, v),
  inputIndex: 2,
  inputRange: ([a, b]) => ({ min: a, max: b }),
  outputRange: () => ({ min: 0, max: 1 }),
};

export const clampInteractive: InteractiveScalarDemo = {
  fnName: "clamp",
  // value deliberately overshoots both walls so the reader sees the pin.
  args: [
    { name: "value", min: -20, max: 120, step: 1, value: 50, input: true },
    { name: "min", min: 0, max: 40, step: 1, value: 20 },
    { name: "max", min: 60, max: 100, step: 1, value: 80 },
  ],
  call: ([v, mn, mx]) => clamp(v, mn, mx),
  inputIndex: 0,
  inputRange: () => ({ min: -20, max: 120 }),
  outputRange: () => ({ min: -20, max: 120 }),
};

export const wrapInteractive: InteractiveScalarDemo = {
  fnName: "wrap",
  // value climbs 0→250 so the reader sees it loop through [min, max) multiple times.
  args: [
    { name: "value", min: 0, max: 250, step: 1, value: 0, input: true },
    { name: "min", min: 0, max: 20, step: 1, value: 0 },
    { name: "max", min: 50, max: 150, step: 1, value: 100 },
  ],
  call: ([v, mn, mx]) => wrap(v, mn, mx),
  inputIndex: 0,
  inputRange: () => ({ min: 0, max: 250 }),
  outputRange: ([, mn, mx]) => ({ min: mn, max: mx }),
};

export const pingPongInteractive: InteractiveScalarDemo = {
  fnName: "pingPong",
  // t climbs 0→40 (4 full cycles at length=10) so the bounce is obvious.
  args: [
    { name: "t", min: 0, max: 40, step: 0.1, value: 0, input: true },
    { name: "length", min: 5, max: 30, step: 1, value: 10 },
  ],
  call: ([t, length]) => pingPong(t, length),
  inputIndex: 0,
  inputRange: () => ({ min: 0, max: 40 }),
  outputRange: ([, length]) => ({ min: 0, max: length }),
};

export const smoothstepInteractive: InteractiveScalarDemo = {
  fnName: "smoothstep",
  args: [
    { name: "edge0", min: 0, max: 80, step: 1, value: 0 },
    { name: "edge1", min: 100, max: 200, step: 1, value: 100 },
    { name: "x", min: -20, max: 220, step: 1, value: 50, input: true },
  ],
  call: ([e0, e1, x]) => smoothstep(e0, e1, x),
  inputIndex: 2,
  inputRange: ([e0, e1]) => ({ min: e0, max: e1 }),
  outputRange: () => ({ min: 0, max: 1 }),
};

export const smootherstepInteractive: InteractiveScalarDemo = {
  fnName: "smootherstep",
  args: [
    { name: "edge0", min: 0, max: 80, step: 1, value: 0 },
    { name: "edge1", min: 100, max: 200, step: 1, value: 100 },
    { name: "x", min: -20, max: 220, step: 1, value: 50, input: true },
  ],
  call: ([e0, e1, x]) => smootherstep(e0, e1, x),
  inputIndex: 2,
  inputRange: ([e0, e1]) => ({ min: e0, max: e1 }),
  outputRange: () => ({ min: 0, max: 1 }),
};

/** Keyed by core export name, mirroring MINI_DEMOS in ApiDocs. */
export const INTERACTIVE_DEMOS: Record<string, InteractiveScalarDemo> = {
  lerp: lerpInteractive,
  inverseLerp: inverseLerpInteractive,
  mapRange: mapRangeInteractive,
  clamp: clampInteractive,
  wrap: wrapInteractive,
  pingPong: pingPongInteractive,
  smoothstep: smoothstepInteractive,
  smootherstep: smootherstepInteractive,
};
