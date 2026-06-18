import { Point } from '../types/shapes';

export function GetRotation(
  currentPoint: Point,
  destinationPoint: Point
) {
  return Math.atan2(
    destinationPoint.y - currentPoint.y,
    destinationPoint.x - currentPoint.x
  );
}
