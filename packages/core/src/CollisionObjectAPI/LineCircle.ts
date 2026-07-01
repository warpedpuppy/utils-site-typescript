import { Line, Circle } from '../types';

/**
 * Test whether a line segment intersects a circle (object-argument form of `lineToCircle`).
 *
 * Projects the circle's center onto the segment, clamps that projection to the
 * segment bounds, and checks whether the closest point lies within the radius.
 * This also handles degenerate zero-length segments safely.
 *
 * @param line - The line segment (`startPoint`, `endPoint`).
 * @param circle - The circle (`x`, `y`, `radius`).
 * @returns `true` if the segment touches or crosses the circle.
 * @example
 * lineCircle({ startPoint: { x: 0, y: 0 }, endPoint: { x: 10, y: 0 } }, { x: 5, y: 0, radius: 2 }); // => true
 */
export function lineCircle(line: Line, circle: Circle): boolean {
  const dx = line.endPoint.x - line.startPoint.x;
  const dy = line.endPoint.y - line.startPoint.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    const pointDx = circle.x - line.startPoint.x;
    const pointDy = circle.y - line.startPoint.y;
    return pointDx * pointDx + pointDy * pointDy <= circle.radius * circle.radius;
  }

  const projection =
    ((circle.x - line.startPoint.x) * dx + (circle.y - line.startPoint.y) * dy) / lengthSquared;
  const t = Math.max(0, Math.min(1, projection));
  const closestX = line.startPoint.x + t * dx;
  const closestY = line.startPoint.y + t * dy;
  const distanceX = circle.x - closestX;
  const distanceY = circle.y - closestY;

  return distanceX * distanceX + distanceY * distanceY <= circle.radius * circle.radius;
}
