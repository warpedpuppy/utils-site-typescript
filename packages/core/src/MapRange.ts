/**
 * Re-map a number from one range into another (also known as "remap").
 *
 * Linear and unclamped: a value outside the input range maps proportionally
 * outside the output range. Pair with {@link clamp} if you need it bounded.
 *
 * @param value - The input value.
 * @param inMin - Start of the input range.
 * @param inMax - End of the input range.
 * @param outMin - Start of the output range.
 * @param outMax - End of the output range.
 * @returns `value` rescaled from the input range to the output range.
 * @example
 * mapRange(5, 0, 10, 0, 100); // => 50
 * mapRange(0.5, 0, 1, -180, 180); // => 0
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}
