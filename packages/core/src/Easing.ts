/**
 * Linear easing — constant speed; the identity curve.
 *
 * @param t - Normalized time, 0–1.
 * @returns The eased value, equal to `t`.
 * @example
 * linear(0.5); // => 0.5
 */
export function linear(t: number): number {
  return t;
}

/**
 * Quadratic ease-in — starts slow, accelerates toward the end.
 *
 * @param t - Normalized time, 0–1.
 * @returns The eased value (`t²`), 0 at `t=0` and 1 at `t=1`.
 * @example
 * easeIn(0.5); // => 0.25
 */
export function easeIn(t: number): number {
  return t * t;
}

/**
 * Quadratic ease-out — starts fast, decelerates toward the end.
 *
 * @param t - Normalized time, 0–1.
 * @returns The eased value, 0 at `t=0` and 1 at `t=1`.
 * @example
 * easeOut(0.5); // => 0.75
 */
export function easeOut(t: number): number {
  return t * (2 - t);
}

/**
 * Quadratic ease-in-out — accelerates then decelerates, symmetric about `t=0.5`.
 *
 * @param t - Normalized time, 0–1.
 * @returns The eased value, 0 at `t=0` and 1 at `t=1`.
 * @example
 * easeInOut(0.5); // => 0.5
 */
export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * Quadratic ease-in. Legacy alias from the vanilla JS utilities.
 *
 * @param t - Normalized time, 0-1.
 * @returns The eased value.
 * @example
 * easeInQuad(0.5); // => 0.25
 */
export function easeInQuad(t: number): number {
  return t * t;
}

/**
 * Quadratic ease-out. Legacy alias from the vanilla JS utilities.
 *
 * @param t - Normalized time, 0-1.
 * @returns The eased value.
 * @example
 * easeOutQuad(0.5); // => 0.75
 */
export function easeOutQuad(t: number): number {
  return t * (2 - t);
}

/**
 * Quadratic ease-in-out. Legacy alias from the vanilla JS utilities.
 *
 * @param t - Normalized time, 0-1.
 * @returns The eased value.
 * @example
 * easeInOutQuad(0.5); // => 0.5
 */
export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * Cubic ease-in.
 *
 * @param t - Normalized time, 0-1.
 * @returns The eased value.
 * @example
 * easeInCubic(0.5); // => 0.125
 */
export function easeInCubic(t: number): number {
  return t * t * t;
}

/**
 * Cubic ease-out.
 *
 * @param t - Normalized time, 0-1.
 * @returns The eased value.
 * @example
 * easeOutCubic(0.5); // => 0.875
 */
export function easeOutCubic(t: number): number {
  const u = t - 1;
  return u * u * u + 1;
}

/**
 * Cubic ease-in-out.
 *
 * @param t - Normalized time, 0-1.
 * @returns The eased value.
 * @example
 * easeInOutCubic(0.5); // => 0.5
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

/**
 * Quartic ease-in.
 *
 * @param t - Normalized time, 0-1.
 * @returns The eased value.
 * @example
 * easeInQuart(0.5); // => 0.0625
 */
export function easeInQuart(t: number): number {
  return t * t * t * t;
}

/**
 * Quartic ease-out.
 *
 * @param t - Normalized time, 0-1.
 * @returns The eased value.
 * @example
 * easeOutQuart(0.5); // => 0.9375
 */
export function easeOutQuart(t: number): number {
  const u = t - 1;
  return 1 - u * u * u * u;
}

/**
 * Quartic ease-in-out.
 *
 * @param t - Normalized time, 0-1.
 * @returns The eased value.
 * @example
 * easeInOutQuart(0.5); // => 0.5
 */
export function easeInOutQuart(t: number): number {
  if (t < 0.5) return 8 * t * t * t * t;
  const u = t - 1;
  return 1 - 8 * u * u * u * u;
}

/**
 * Quintic ease-in.
 *
 * @param t - Normalized time, 0-1.
 * @returns The eased value.
 * @example
 * easeInQuint(0.5); // => 0.03125
 */
export function easeInQuint(t: number): number {
  return t * t * t * t * t;
}

/**
 * Quintic ease-out.
 *
 * @param t - Normalized time, 0-1.
 * @returns The eased value.
 * @example
 * easeOutQuint(0.5); // => 0.96875
 */
export function easeOutQuint(t: number): number {
  const u = t - 1;
  return 1 + u * u * u * u * u;
}

/**
 * Quintic ease-in-out.
 *
 * @param t - Normalized time, 0-1.
 * @returns The eased value.
 * @example
 * easeInOutQuint(0.5); // => 0.5
 */
export function easeInOutQuint(t: number): number {
  if (t < 0.5) return 16 * t * t * t * t * t;
  const u = t - 1;
  return 1 + 16 * u * u * u * u * u;
}

/**
 * Elastic ease-out with a short overshoot.
 *
 * @param t - Normalized time, 0-1.
 * @returns The eased value.
 * @example
 * easeOutElastic(1); // => 1 (settles on the target after overshooting)
 */
export function easeOutElastic(t: number): number {
  const p = 0.3;
  return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1;
}

/**
 * Bounce ease-out using Robert Penner's common piecewise curve.
 *
 * @param t - Normalized time, 0-1.
 * @returns The eased value.
 * @example
 * easeOutBounce(1); // => 1 (lands exactly on the target)
 */
export function easeOutBounce(t: number): number {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  }
  if (t < 2 / 2.75) {
    const u = t - 1.5 / 2.75;
    return 7.5625 * u * u + 0.75;
  }
  if (t < 2.5 / 2.75) {
    const u = t - 2.25 / 2.75;
    return 7.5625 * u * u + 0.9375;
  }
  const u = t - 2.625 / 2.75;
  return 7.5625 * u * u + 0.984375;
}
