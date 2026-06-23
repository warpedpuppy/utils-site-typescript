import { Point } from './types';

/**
 * Find the point a given percentage of the way around a circle.
 *
 * @param circleCenter - Center of the circle.
 * @param radius - Radius of the circle.
 * @param percentageAroundCircle - Position around the circle, `0`–`100`. 0 is at 3 o'clock; 25 is at 6 o'clock.
 * @returns The `{ x, y }` point on the circle at that percentage.
 * @example
 * findPointAroundCircle({ x: 0, y: 0 }, 10, 25); // => { x: 0, y: 10 }
 */
export function findPointAroundCircle(
  circleCenter: Point,
  radius: number,
  percentageAroundCircle: number
) {
  let totalCircleRadians = Math.PI * 2;
  let percent = percentageAroundCircle / 100;
  const x = circleCenter.x + radius * Math.cos(totalCircleRadians * percent);
  const y = circleCenter.y + radius * Math.sin(totalCircleRadians * percent);
  return { x, y };
}
