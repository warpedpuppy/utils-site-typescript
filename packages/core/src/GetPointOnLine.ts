import { Point } from './types';

/**
 * Find a point partway along the straight line between two points (lerp in 2D).
 *
 * @param p1 - Start point, returned when `t` is 0.
 * @param p2 - End point, returned when `t` is 1.
 * @param t - Fraction along the line; `0.5` is the midpoint.
 * @returns The interpolated `{ x, y }` point.
 * @example
 * getPointOnLine({ x: 0, y: 0 }, { x: 10, y: 20 }, 0.5); // => { x: 5, y: 10 }
 */
export function getPointOnLine(p1: Point, p2: Point, t: number) {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  return {x: lerp(p1.x, p2.x, t), y: lerp(p1.y, p2.y, t)};
}
