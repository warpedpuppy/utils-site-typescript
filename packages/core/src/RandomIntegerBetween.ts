/**
 * Pick a random integer in an inclusive range.
 *
 * @param min - Lowest possible value (inclusive).
 * @param max - Highest possible value (inclusive).
 * @returns A random integer `n` where `min <= n <= max`.
 * @example
 * randomIntegerBetween(1, 6); // => e.g. 4 (a six-sided die)
 */
export function randomIntegerBetween(min: number, max: number): number {
  max++;
  return Math.floor(Math.random() * (max - min) + min);
}
