/**
 * Convert an angle from radians to degrees.
 *
 * @param radians - Angle in radians.
 * @returns The equivalent angle in degrees.
 * @example
 * radToDeg(Math.PI); // => 180
 */
export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}
