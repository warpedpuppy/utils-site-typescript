import { Line, Point } from '../types';

/**
 * Test whether a point lies on a line segment (object-argument form).
 *
 * Projects the point onto the segment, clamps that projection to the segment
 * bounds, and checks whether the nearest point lands within a built-in `0.1`
 * unit tolerance.
 *
 * @param line - The line segment (`startPoint`, `endPoint`).
 * @param point - The point to test.
 * @returns `true` if the point sits on the segment within the built-in `0.1` tolerance.
 * @remarks
 * The tolerance here is fixed at `0.1`. If you need to choose it, use the flat
 * {@link lineToPoint}, which takes an explicit `threshold` argument.
 * @example
 * linePoint({ startPoint: { x: 0, y: 0 }, endPoint: { x: 10, y: 0 } }, { x: 5, y: 0 }); // => true
 */
export function linePoint(line: Line, point: Point): boolean {
  const threshold = 0.1;
  const dx = line.endPoint.x - line.startPoint.x;
  const dy = line.endPoint.y - line.startPoint.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    const pointDx = point.x - line.startPoint.x;
    const pointDy = point.y - line.startPoint.y;
    return pointDx * pointDx + pointDy * pointDy <= threshold * threshold;
  }

  const projection =
    ((point.x - line.startPoint.x) * dx + (point.y - line.startPoint.y) * dy) / lengthSquared;
  const t = Math.max(0, Math.min(1, projection));
  const closestX = line.startPoint.x + t * dx;
  const closestY = line.startPoint.y + t * dy;
  const distanceX = point.x - closestX;
  const distanceY = point.y - closestY;

  return distanceX * distanceX + distanceY * distanceY <= threshold * threshold;
}
