import { Point } from './types';

/**
 * Get the angle (in radians) pointing from one point toward another.
 *
 * Handy for rotating a sprite so it "faces" a target. Uses `Math.atan2`, so the
 * result is in the range `-π`…`π`, measured clockwise from the positive x-axis.
 *
 * @param currentPoint - The point doing the looking.
 * @param destinationPoint - The point being looked at.
 * @returns The heading angle in radians.
 * @example
 * getRotation({ x: 0, y: 0 }, { x: 0, y: 1 }); // => Math.PI / 2
 */
export function getRotation(
  currentPoint: Point,
  destinationPoint: Point
): number {
  return Math.atan2(
    destinationPoint.y - currentPoint.y,
    destinationPoint.x - currentPoint.x
  );
}
