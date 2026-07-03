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
 * @remarks
 * This is the flat, six-number form. For new code the **recommended** shape is the
 * object-argument {@link circleCircle}, which reads `circleCircle({ x, y, radius }, …)`.
 * Both share the same squared-distance comparison (no `sqrt`, since comparing squared
 * lengths gives the identical answer for non-negative radii).
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
  const dx = x2 - x1;
  const dy = y2 - y1;
  const radii = r1 + r2;
  return dx * dx + dy * dy <= radii * radii;
}
