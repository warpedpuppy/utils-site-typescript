import { Point } from './types';

/**
 * Find the point a given fraction of the way from one point to another.
 *
 * @param origin - Start point, returned when `ratio` is 0.
 * @param destination - End point, returned when `ratio` is 1.
 * @param ratio - Fraction of the way along; `0.5` is the midpoint.
 * @returns The interpolated `{ x, y }` point.
 * @example
 * moveAlongLine({ x: 0, y: 0 }, { x: 10, y: 20 }, 0.5); // => { x: 5, y: 10 }
 */
export function moveAlongLine(
  origin: Point,
  destination: Point,
  ratio: number
): Point {
  let x = origin.x + ratio * (destination.x - origin.x);
  let y = origin.y + ratio * (destination.y - origin.y);
  return { x, y };
}
