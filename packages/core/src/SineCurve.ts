/**
 * Oscillate a value smoothly around a baseline using a sine wave.
 *
 * Pure and deterministic: pass the current `time` (e.g. `performance.now()`) and the
 * same inputs always produce the same output — so it's easy to test and reproduce.
 *
 * @param startingValue - The baseline the result oscillates around.
 * @param differential - The amplitude (how far above/below the baseline it swings).
 * @param speed - Oscillation speed multiplier applied to `time`.
 * @param time - The current time in milliseconds (e.g. `performance.now()`).
 * @returns The oscillating value at the given moment.
 * @example
 * const y = sineCurve(200, 50, 0.002, performance.now()); // bob around y=200 by ±50
 */
export function sineCurve(
  startingValue: number,
  differential: number,
  speed: number,
  time: number,
): number {
  return startingValue + Math.sin(time * speed) * differential;
}
