/**
 * Test whether a point falls inside (or on the edge of) a circle.
 *
 * @param px - Point x.
 * @param py - Point y.
 * @param cx - Circle center x.
 * @param cy - Circle center y.
 * @param radius - Circle radius.
 * @returns `true` if the point is within `radius` of the center.
 * @remarks
 * Flat, five-number form. For new code the **recommended** shape is the object-argument
 * {@link pointCircle} (`pointCircle({ x, y }, { x, y, radius })`). Both use the same
 * squared-distance comparison — comparing `dx² + dy²` against `radius²` avoids a `sqrt`
 * and gives the identical result for a non-negative radius.
 * @example
 * pointToCircle(1, 1, 0, 0, 5); // => true
 */
export function pointToCircle(px: number, py: number, cx: number, cy: number, radius: number): boolean {
  const dx = px - cx;
  const dy = py - cy;
  return dx * dx + dy * dy <= radius * radius;
}
