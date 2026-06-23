import { Point, Circle } from '../types';

/**
 * Test whether a point falls inside a circle (object-argument form of `pointToCircle`).
 *
 * @param point - The point to test.
 * @param circle - The circle (`x`, `y`, `radius`).
 * @returns `true` if the point is within the circle.
 * @example
 * pointCircle({ x: 1, y: 1 }, { x: 0, y: 0, radius: 5 }); // => true
 */
export function pointCircle(point: Point, circle: Circle) {
  let distX = point.x - circle.x;
  let distY = point.y - circle.y;
  let distance = Math.sqrt(distX * distX + distY * distY);
  return distance <= circle.radius;
}
