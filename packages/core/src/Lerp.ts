/**
 * Linearly interpolate between two numbers.
 *
 * @param a - Start value, returned when `t` is 0.
 * @param b - End value, returned when `t` is 1.
 * @param t - Interpolation factor. 0–1 stays within the range; values outside extrapolate.
 * @returns The interpolated value `a + (b - a) * t`.
 * @example
 * lerp(0, 100, 0.5); // => 50
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
