/**
 * Test whether a line segment intersects a circle.
 *
 * Finds the closest point on the segment to the circle's center and checks
 * whether it lies within the radius. This also handles degenerate zero-length
 * segments safely.
 *
 * @param x1 - Segment start x.
 * @param y1 - Segment start y.
 * @param x2 - Segment end x.
 * @param y2 - Segment end y.
 * @param cx - Circle center x.
 * @param cy - Circle center y.
 * @param cr - Circle radius.
 * @returns `true` if the segment touches or crosses the circle.
 * @example
 * lineToCircle(0, 0, 10, 0, 5, 0, 2); // => true
 */
export function lineToCircle(x1: number, y1: number, x2: number, y2: number, cx: number, cy: number, cr: number): boolean {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    const pointDx = cx - x1;
    const pointDy = cy - y1;
    return pointDx * pointDx + pointDy * pointDy <= cr * cr;
  }

  const projection = ((cx - x1) * dx + (cy - y1) * dy) / lengthSquared;
  const t = Math.max(0, Math.min(1, projection));
  const px = x1 + t * dx;
  const py = y1 + t * dy;
  const ddx = cx - px;
  const ddy = cy - py;
  return ddx * ddx + ddy * ddy <= cr * cr;
}
