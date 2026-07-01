/**
 * Pick a random floating-point number in a half-open range.
 *
 * @param min - Lower bound (inclusive).
 * @param max - Upper bound (exclusive).
 * @returns A random number `n` where `min <= n < max`.
 * @example
 * randomNumberBetween(0, 1); // => e.g. 0.2738
 */
export function randomNumberBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
