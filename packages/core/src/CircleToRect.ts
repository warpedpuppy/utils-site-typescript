/**
 * Test whether a circle overlaps an axis-aligned rectangle.
 *
 * Works by clamping the circle's center to the rectangle to find the closest
 * point on the rect, then checking if that point is within the radius.
 *
 * @param cx - Circle center x.
 * @param cy - Circle center y.
 * @param cr - Circle radius.
 * @param rx - Rectangle left edge.
 * @param ry - Rectangle top edge.
 * @param rw - Rectangle width.
 * @param rh - Rectangle height.
 * @returns `true` if the circle and rectangle overlap.
 * @example
 * circleToRect(3, 0, 5, 0, 0, 10, 10); // => true
 */
export function circleToRect(cx: number, cy: number, cr: number, rx: number, ry: number, rw: number, rh: number): boolean {
  let px = Math.max(rx, Math.min(cx, rx + rw));
  let py = Math.max(ry, Math.min(cy, ry + rh));
  let dx = cx - px, dy = cy - py;
  return dx * dx + dy * dy <= cr * cr;
}
