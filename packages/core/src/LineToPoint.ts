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
 * @example
 * lineToPoint(0, 0, 10, 0, 5, 0, 0.5); // => true
 */
export function lineToPoint(x1: number, y1: number, x2: number, y2: number, px: number, py: number, threshold: number): boolean {
  let dx = x2 - x1, dy = y2 - y1;
  let t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
  let lx = x1 + t * dx, ly = y1 + t * dy;
  let ddx = px - lx, ddy = py - ly;
  return ddx * ddx + ddy * ddy <= threshold * threshold;
}
