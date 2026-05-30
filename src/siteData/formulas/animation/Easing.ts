import { CollisionDetectionObject } from "../../../types/types";

// The keyFunction is easeInOutQuad — the most widely used easing.
// The functionString shows the full family so users can copy what they need.
export const Easing: CollisionDetectionObject = {
  keyFunction: function easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  dependencies: [],
  functionString: `
  // t must be in the range 0–1 (start → end of animation).

  // ── Linear ────────────────────────────────────────────────────────────────
  function linear(t: number) { return t; }

  // ── Quadratic ────────────────────────────────────────────────────────────
  function easeInQuad(t: number)    { return t * t; }
  function easeOutQuad(t: number)   { return t * (2 - t); }
  function easeInOutQuad(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  // ── Cubic ────────────────────────────────────────────────────────────────
  function easeInCubic(t: number)    { return t * t * t; }
  function easeOutCubic(t: number)   { return (--t) * t * t + 1; }
  function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  // ── Elastic ──────────────────────────────────────────────────────────────
  function easeOutElastic(t: number) {
    if (t === 0 || t === 1) return t;
    const c4 = (2 * Math.PI) / 3;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }

  // ── Bounce ───────────────────────────────────────────────────────────────
  function easeOutBounce(t: number) {
    const n1 = 7.5625, d1 = 2.75;
    if      (t < 1 / d1)       return n1 * t * t;
    else if (t < 2 / d1)       return n1 * (t -= 1.5   / d1) * t + 0.75;
    else if (t < 2.5 / d1)     return n1 * (t -= 2.25  / d1) * t + 0.9375;
    else                        return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }`,
};
