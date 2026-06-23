/**
 * Constrain a value to a range, so it never goes below `min` or above `max`.
 *
 * @param value - The value to constrain.
 * @param min - Lower bound.
 * @param max - Upper bound.
 * @returns `value` limited to the range `[min, max]`.
 * @example
 * clamp(15, 0, 10); // => 10
 * clamp(-3, 0, 10); // => 0
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
