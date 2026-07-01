// ─────────────────────────────────────────────────────────────────────────────
// scalarTransforms — the single source for the "numbers in motion" transform
// demos (lerp, inverseLerp, mapRange, clamp, wrap, smoothstep, smootherstep).
//
// Unlike pingPong (a generator: one number, same on both sides), each of these
// turns an INPUT into an OUTPUT, so its mini-demo must show input → output. To
// keep the /api docs host and the /examples animation class from drifting, BOTH
// import the SAME demo entry from here: the input sweep + the live core call live
// in one place, and the math itself is still single-sourced from @utilspalooza/core.
//
// Each `sample(t)` takes a monotonically advancing time and returns the input it
// fed to the real core function plus that function's output. The host/class just
// advances `t` by SCALAR_DEMO_STEP per frame and draws the result via
// drawScalarMiniDemo in transform mode.
// ─────────────────────────────────────────────────────────────────────────────

import { lerp } from "@utilspalooza/core/Lerp";
import { inverseLerp } from "@utilspalooza/core/InverseLerp";
import { mapRange } from "@utilspalooza/core/MapRange";
import { clamp } from "@utilspalooza/core/Clamp";
import { wrap } from "@utilspalooza/core/Wrap";
import { smoothstep, smootherstep } from "@utilspalooza/core/Smoothstep";
import { pingPong } from "@utilspalooza/core/PingPong";

/** Time advanced per animation frame. Shared so /api and /examples run identically. */
export const SCALAR_DEMO_STEP = 1 / 160;

export interface ScalarTransformDemo {
  /** Examples slug (`static l`) + ApiDocs MINI_DEMO_KEYS entry. */
  slug: string;
  /** Examples title (`static t`). */
  title: string;
  /** Output domain peak: the output dot reads `value / length`. */
  length: number;
  /** Caption drawn at the top of the demo, e.g. `clamp(v, 0, 100)`. */
  label: string;
  /** Lower bound of the input pane's display range. */
  inputMin: number;
  /** Upper bound of the input pane's display range. */
  inputMax: number;
  /** ELI5 string shown above the /examples canvas. */
  eli5: string;
  /** Drive the demo: time → the input fed to core + the resulting output. */
  sample: (t: number) => { input: number; value: number };
}

/** A 0 → 1 → 0 triangle sweep (one cycle per `t` span of 2), reused as a dial. */
const dial = (t: number): number => pingPong(t, 1);

export const lerpDemo: ScalarTransformDemo = {
  slug: "lerp",
  title: "lerp",
  length: 100,
  label: "lerp(0, 100, t)",
  inputMin: 0,
  inputMax: 1,
  eli5:
    "lerp blends from one number to another. The input on the left is a 0→1 dial; " +
    "the output on the right slides at a steady pace from 0 to 100 as the dial turns. " +
    "A plain straight-line blend — the workhorse behind almost every smooth motion.",
  sample: (t) => {
    const f = dial(t);
    return { input: f, value: lerp(0, 100, f) };
  },
};

export const inverseLerpDemo: ScalarTransformDemo = {
  slug: "inverse-lerp",
  title: "inverse lerp",
  length: 1,
  label: "inverseLerp(0, 100, v)",
  inputMin: 0,
  inputMax: 100,
  eli5:
    "inverseLerp is lerp run backwards. Feed it a value between 0 and 100 (left) and " +
    "it answers “how far along is that?” as a 0→1 fraction (right). Handy for turning a " +
    "raw measurement into progress.",
  sample: (t) => {
    const v = dial(t) * 100;
    return { input: v, value: inverseLerp(0, 100, v) };
  },
};

export const mapRangeDemo: ScalarTransformDemo = {
  slug: "map-range",
  title: "map range",
  length: 360,
  label: "mapRange(v, 0,100, 0,360)",
  inputMin: 0,
  inputMax: 100,
  eli5:
    "mapRange rescales a number from one range into another. Here a 0→100 input (left) " +
    "becomes a 0→360° output (right): same position along the track, brand-new units.",
  sample: (t) => {
    const v = dial(t) * 100;
    return { input: v, value: mapRange(v, 0, 100, 0, 360) };
  },
};

export const clampDemo: ScalarTransformDemo = {
  slug: "clamp",
  title: "clamp",
  length: 100,
  label: "clamp(v, 0, 100)",
  inputMin: -30,
  inputMax: 130,
  eli5:
    "clamp pins a value inside a range. Watch the input on the left slide past both ends, " +
    "while the output dot on the right sticks to the walls at 0 and 100 — it simply refuses " +
    "to go any further.",
  sample: (t) => {
    const v = dial(t) * 160 - 30; // overshoots [0,100] on both ends
    return { input: v, value: clamp(v, 0, 100) };
  },
};

export const wrapDemo: ScalarTransformDemo = {
  slug: "wrap",
  title: "wrap",
  length: 100,
  label: "wrap(v, 0, 100)",
  inputMin: 0,
  inputMax: 300,
  eli5:
    "wrap loops a value around a range instead of stopping at the edge. As the input climbs " +
    "(left), the output (right) snaps back to 0 every time it passes 100 — like an object " +
    "leaving one side of the screen and reappearing on the other.",
  sample: (t) => {
    const v = (t * 125) % 300; // a raw climbing-and-resetting driver
    return { input: v, value: wrap(v, 0, 100) };
  },
};

export const smoothstepDemo: ScalarTransformDemo = {
  slug: "smoothstep",
  title: "smoothstep",
  length: 1,
  label: "smoothstep(0, 100, x)",
  inputMin: 0,
  inputMax: 100,
  eli5:
    "smoothstep eases instead of sliding. The input on the left moves at a constant speed, " +
    "but the output on the right starts slow, speeds up through the middle, and eases out again " +
    "— soft at both ends. Compare it to lerp's perfectly steady glide.",
  sample: (t) => {
    const x = dial(t) * 100;
    return { input: x, value: smoothstep(0, 100, x) };
  },
};

export const smootherstepDemo: ScalarTransformDemo = {
  slug: "smootherstep",
  title: "smootherstep",
  length: 1,
  label: "smootherstep(0, 100, x)",
  inputMin: 0,
  inputMax: 100,
  eli5:
    "smootherstep is smoothstep with even softer starts and stops. The input on the left still " +
    "moves at a constant speed, but the output on the right lingers a little longer near both " +
    "ends before committing to the middle of the trip.",
  sample: (t) => {
    const x = dial(t) * 100;
    return { input: x, value: smootherstep(0, 100, x) };
  },
};

/** Pedagogical order, matching the ApiDocs "Numbers in motion" concept group. */
export const SCALAR_TRANSFORM_DEMOS: ScalarTransformDemo[] = [
  lerpDemo,
  inverseLerpDemo,
  mapRangeDemo,
  clampDemo,
  wrapDemo,
  smoothstepDemo,
  smootherstepDemo,
];
