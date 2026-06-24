import { Line } from './types';

/**
 * Get the length of a line segment.
 *
 * @param line - A line with `startPoint` and `endPoint`.
 * @returns The straight-line distance between the two endpoints.
 * @example
 * lineLength({ startPoint: { x: 0, y: 0 }, endPoint: { x: 3, y: 4 } }); // => 5
 */
export function lineLength(line: Line): number {
  const { startPoint, endPoint } = line;
  let a = startPoint.x - endPoint.x;
  let b = startPoint.y - endPoint.y;
  return Math.sqrt(a * a + b * b);
}
