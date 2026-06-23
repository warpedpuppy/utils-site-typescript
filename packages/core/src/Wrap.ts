/**
 * Wrap a value into the half-open range `[min, max)`, looping around at the ends.
 *
 * Like a modulo that respects an arbitrary lower bound — values that run off one
 * end reappear at the other (think Asteroids-style screen wrap, or cyclic indices).
 *
 * @param value - The value to wrap.
 * @param min - Lower bound (inclusive).
 * @param max - Upper bound (exclusive).
 * @returns `value` mapped into `[min, max)`. Returns `min` if the range is empty.
 * @example
 * wrap(11, 0, 10); // => 1
 * wrap(-1, 0, 10); // => 9
 */
export function wrap(value: number, min: number, max: number): number {
  const range = max - min;
  if (range <= 0) return min;
  return ((((value - min) % range) + range) % range) + min;
}
