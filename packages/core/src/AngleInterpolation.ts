/**
 * Normalize an angle to the range `(-π, π]`.
 *
 * Collapses any angle (including ones that have wound past a full turn) to its
 * canonical equivalent, so `3π` and `π` are treated as the same direction.
 *
 * @param radians - The angle to normalize, in radians.
 * @returns The equivalent angle in `(-π, π]`.
 * @example
 * wrapAngle(3 * Math.PI); // => ~3.14159 (π)
 */
export function wrapAngle(radians: number): number {
  return Math.atan2(Math.sin(radians), Math.cos(radians));
}

/**
 * The smallest signed angle to rotate from `a` to `b`, taking the short way around.
 *
 * Solves the classic "360° seam" problem: rotating from 350° to 10° should be
 * `+20°`, not `-340°`. Positive results turn counter-clockwise.
 *
 * @param a - Start angle in radians.
 * @param b - Target angle in radians.
 * @returns The shortest signed delta in `(-π, π]`.
 * @example
 * shortestAngleBetween(0, Math.PI / 2); // => Math.PI / 2
 */
export function shortestAngleBetween(a: number, b: number): number {
  return wrapAngle(b - a);
}

/**
 * Interpolate between two angles along the shortest arc (no spinning the long way around).
 *
 * The angle-aware cousin of {@link lerp} — use it to smoothly rotate something
 * toward a target heading without sudden flips at the 0/360° boundary.
 *
 * @param a - Start angle in radians, returned when `t` is 0.
 * @param b - Target angle in radians, returned when `t` is 1.
 * @param t - Interpolation factor, 0–1.
 * @returns The interpolated angle in radians.
 * @example
 * lerpAngle(0, Math.PI / 2, 0.5); // => Math.PI / 4
 */
export function lerpAngle(a: number, b: number, t: number): number {
  return a + shortestAngleBetween(a, b) * t;
}
