import { Circle } from '../types';

/**
 * Test whether two circles overlap (object-argument form of `circleToCircle`).
 *
 * @param circle1 - First circle (`x`, `y`, `radius`).
 * @param circle2 - Second circle (`x`, `y`, `radius`).
 * @returns `true` if the circles touch or overlap.
 * @example
 * circleCircle({ x: 0, y: 0, radius: 5 }, { x: 6, y: 0, radius: 5 }); // => true
 */
export function circleCircle(circle1: Circle, circle2: Circle) {
  let distX = circle1.x - circle2.x;
  let distY = circle1.y - circle2.y;
  let distance = Math.sqrt(distX * distX + distY * distY);
  return distance <= circle1.radius + circle2.radius;
}
