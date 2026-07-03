/**
 * Test whether a point lies on a line segment, within a tolerance.
 *
 * @param x1 - Segment start x.
 * @param y1 - Segment start y.
 * @param x2 - Segment end x.
 * @param y2 - Segment end y.
 * @param px - Point x.
 * @param py - Point y.
 * @param threshold - How close (in units) the point must be to count as "on the line".
 * @returns `true` if the point is within `threshold` of the segment.
 * @remarks
 * This flat form lets you choose the `threshold`. The object-argument {@link linePoint}
 * (`linePoint({ startPoint, endPoint }, { x, y })`) is the same closest-point test with a
 * fixed `0.1` tolerance baked in — reach for it when the default is fine and you want the
 * tidier call site.
 * @example
 * lineToPoint(0, 0, 10, 0, 5, 0, 0.5); // => true
 */
export function lineToPoint(x1: number, y1: number, x2: number, y2: number, px: number, py: number, threshold: number): boolean {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
  const lx = x1 + t * dx;
  const ly = y1 + t * dy;
  const ddx = px - lx;
  const ddy = py - ly;
  return ddx * ddx + ddy * ddy <= threshold * threshold;
}
