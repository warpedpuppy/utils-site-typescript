/**
 * Smooth Hermite interpolation between two edges — the classic GLSL `smoothstep`.
 *
 * Returns 0 below `edge0`, 1 above `edge1`, and an eased S-curve in between (flat
 * at both ends), giving gentler transitions than a raw linear ramp.
 *
 * @param edge0 - Lower edge; output is 0 at or below this.
 * @param edge1 - Upper edge; output is 1 at or above this.
 * @param x - The value to interpolate.
 * @returns A smoothly eased value in `[0, 1]`.
 * @example
 * smoothstep(0, 10, 5); // => 0.5
 * smoothstep(0, 10, -2); // => 0
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Ken Perlin's smoother variant of {@link smoothstep}.
 *
 * Uses a 5th-order curve so both the 1st *and* 2nd derivatives are zero at the
 * edges — even less perceptible "popping" at the start and end of the transition.
 *
 * @param edge0 - Lower edge; output is 0 at or below this.
 * @param edge1 - Upper edge; output is 1 at or above this.
 * @param x - The value to interpolate.
 * @returns A very smoothly eased value in `[0, 1]`.
 * @example
 * smootherstep(0, 10, 5); // => 0.5
 */
export function smootherstep(edge0: number, edge1: number, x: number): number {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * t * (t * (t * 6 - 15) + 10);
}
