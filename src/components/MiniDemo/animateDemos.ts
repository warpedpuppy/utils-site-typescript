export type AnimateDemoKind =
  | "tween-value"
  | "tween-object"
  | "ticker"
  | "loop"
  | "yoyo"
  | "delay"
  | "stagger";

export interface AnimateDemoDef {
  kind: AnimateDemoKind;
  fnName: string;
  hint: string;
}

export const ANIMATE_DEMOS: Record<string, AnimateDemoDef> = {
  tweenValue: {
    kind: "tween-value",
    fnName: "tweenValue",
    hint: "Elapsed time becomes one scalar value. Scrub time or let it auto-sweep.",
  },
  tweenObject: {
    kind: "tween-object",
    fnName: "tweenObject",
    hint: "One elapsed time sample updates several numeric properties together.",
  },
  tweenFrame: {
    kind: "tween-object",
    fnName: "tweenFrame",
    hint: "Same sampled object tween as tweenObject; this alias just frames the use case differently.",
  },
  ticker: {
    kind: "ticker",
    fnName: "ticker",
    hint: "This one owns the frame loop callback and hands you timing data every tick.",
  },
  loop: {
    kind: "loop",
    fnName: "loop",
    hint: "Elapsed time wraps back into a reusable 0..1 progress cycle.",
  },
  yoyo: {
    kind: "yoyo",
    fnName: "yoyo",
    hint: "Same time input, but the progress reverses at the end instead of jumping back to zero.",
  },
  delay: {
    kind: "delay",
    fnName: "delay",
    hint: "Nothing moves until the waiting period ends; then progress starts climbing.",
  },
  stagger: {
    kind: "stagger",
    fnName: "stagger",
    hint: "Each item gets the same tween, but starts later by index × staggerMs.",
  },
};
