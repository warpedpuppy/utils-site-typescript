/**
 * Test whether a point falls inside (or on the edge of) a circle.
 *
 * @param px - Point x.
 * @param py - Point y.
 * @param cx - Circle center x.
 * @param cy - Circle center y.
 * @param radius - Circle radius.
 * @returns `true` if the point is within `radius` of the center.
 * @example
 * pointToCircle(1, 1, 0, 0, 5); // => true
 */
export function pointToCircle(px: number, py: number, cx: number, cy: number, radius: number): boolean {
  let dx = px - cx, dy = py - cy;
  return Math.sqrt(dx * dx + dy * dy) <= radius;
}
