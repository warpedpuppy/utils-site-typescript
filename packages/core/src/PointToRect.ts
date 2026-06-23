/**
 * Test whether a point falls inside (or on the edge of) an axis-aligned rectangle.
 *
 * @param px - Point x.
 * @param py - Point y.
 * @param rx - Rectangle left edge.
 * @param ry - Rectangle top edge.
 * @param rw - Rectangle width.
 * @param rh - Rectangle height.
 * @returns `true` if the point lies within the rectangle.
 * @example
 * pointToRect(5, 5, 0, 0, 10, 10); // => true
 */
export function pointToRect(px: number, py: number, rx: number, ry: number, rw: number, rh: number): boolean {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}
