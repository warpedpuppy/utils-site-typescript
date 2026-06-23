/**
 * Linear easing — constant speed; the identity curve.
 *
 * @param t - Normalized time, 0–1.
 * @returns The eased value, equal to `t`.
 */
export function linear(t: number): number {
  return t;
}

/**
 * Quadratic ease-in — starts slow, accelerates toward the end.
 *
 * @param t - Normalized time, 0–1.
 * @returns The eased value (`t²`), 0 at `t=0` and 1 at `t=1`.
 */
export function easeIn(t: number): number {
  return t * t;
}

/**
 * Quadratic ease-out — starts fast, decelerates toward the end.
 *
 * @param t - Normalized time, 0–1.
 * @returns The eased value, 0 at `t=0` and 1 at `t=1`.
 */
export function easeOut(t: number): number {
  return t * (2 - t);
}

/**
 * Quadratic ease-in-out — accelerates then decelerates, symmetric about `t=0.5`.
 *
 * @param t - Normalized time, 0–1.
 * @returns The eased value, 0 at `t=0` and 1 at `t=1`.
 */
export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
