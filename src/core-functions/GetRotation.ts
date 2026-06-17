export function GetRotation(
  currentPoint: { x: number; y: number },
  destinationPoint: { x: number; y: number }
) {
  return Math.atan2(
    destinationPoint.y - currentPoint.y,
    destinationPoint.x - currentPoint.x
  );
}
