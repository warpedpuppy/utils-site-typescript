/**
 * Convert an angle from degrees to radians.
 *
 * @param degree - Angle in degrees.
 * @returns The equivalent angle in radians.
 * @example
 * degToRad(180); // => 3.141592653589793
 */
export function degToRad(degree: number): number {
  return degree * (Math.PI / 180);
}
