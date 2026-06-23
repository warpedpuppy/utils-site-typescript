/**
 * The inverse of {@link lerp}: find the fraction `t` that produces `value` between `a` and `b`.
 *
 * Answers "how far along am I?" — e.g. turning a current value into a 0–1 progress.
 *
 * @param a - Range start (where the result is 0).
 * @param b - Range end (where the result is 1).
 * @param value - The value to locate within the range.
 * @returns The fraction `t` such that `lerp(a, b, t) === value`. Returns `0` if `a === b`.
 * @example
 * inverseLerp(0, 100, 25); // => 0.25
 * inverseLerp(20, 40, 30); // => 0.5
 */
export function inverseLerp(a: number, b: number, value: number): number {
  return a === b ? 0 : (value - a) / (b - a);
}
