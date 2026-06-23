import { Point } from './types';
/**
 * Euclidean (straight-line) distance between two points.
 *
 * @param p1 - First point.
 * @param p2 - Second point.
 * @returns The distance between `p1` and `p2`.
 * @example
 * distance({ x: 0, y: 0 }, { x: 3, y: 4 }); // => 5
 */
export function distance(p1: Point, p2: Point): number {
  let dx = p2.x - p1.x, dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}
