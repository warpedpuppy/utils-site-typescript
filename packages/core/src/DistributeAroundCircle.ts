import { Point } from './types';

/**
 * Evenly space N points around a circle (e.g. for a radial menu or clock face).
 *
 * @param circleCenter - Center of the circle.
 * @param radius - Radius of the circle.
 * @param totalItems - How many points to distribute. The first sits at angle 0 (3 o'clock).
 * @returns An array of `totalItems` points spread evenly around the circle.
 * @example
 * distributeAroundCircle({ x: 0, y: 0 }, 10, 4); // => 4 points at 3, 6, 9, 12 o'clock
 */
export function distributeAroundCircle(
  circleCenter: Point,
  radius: number,
  totalItems: number
): Point[] {
  const totalCircleRadians = Math.PI * 2;
  const returnArray: Point[] = [];
  for (let i = 0; i < totalItems; i++) {
    const percent = i / totalItems;
    returnArray.push({
      x: circleCenter.x + radius * Math.cos(totalCircleRadians * percent),
      y: circleCenter.y + radius * Math.sin(totalCircleRadians * percent),
    });
  }
  return returnArray;
}
