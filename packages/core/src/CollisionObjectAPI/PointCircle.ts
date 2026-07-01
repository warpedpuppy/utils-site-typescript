import { Point, Circle } from '../types';

/**
 * Test whether a point falls inside or on a circle (object-argument form of `pointToCircle`).
 *
 * @param point - The point to test.
 * @param circle - The circle (`x`, `y`, `radius`).
 * @returns `true` if the point is within `radius` of the circle center.
 * @example
 * pointCircle({ x: 1, y: 1 }, { x: 0, y: 0, radius: 5 }); // => true
 */
export function pointCircle(point: Point, circle: Circle): boolean {
  const dx = point.x - circle.x;
  const dy = point.y - circle.y;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}
