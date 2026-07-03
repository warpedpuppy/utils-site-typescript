import { Line } from './types';

/**
 * Get the length of a line segment.
 *
 * @param line - A line with `startPoint` and `endPoint`.
 * @returns The straight-line distance between the two endpoints.
 * @remarks
 * This is the segment-shaped spelling of Euclidean distance — the same measurement as
 * {@link distance} on two loose points, computed with `Math.hypot`.
 * @example
 * lineLength({ startPoint: { x: 0, y: 0 }, endPoint: { x: 3, y: 4 } }); // => 5
 */
export function lineLength(line: Line): number {
  const { startPoint, endPoint } = line;
  return Math.hypot(startPoint.x - endPoint.x, startPoint.y - endPoint.y);
}
