/**
 * Test whether two circles overlap (or touch).
 *
 * @param x1 - First circle center x.
 * @param y1 - First circle center y.
 * @param r1 - First circle radius.
 * @param x2 - Second circle center x.
 * @param y2 - Second circle center y.
 * @param r2 - Second circle radius.
 * @returns `true` if the distance between centers is `<= r1 + r2`.
 * @example
 * circleToCircle(0, 0, 5, 6, 0, 5); // => true
 */
export function circleToCircle(
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number,
): boolean {
  let dx = x2 - x1,
    dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy) <= r1 + r2;
}
