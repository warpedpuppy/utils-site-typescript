import { PointCircle } from "./PointCircle";
import { LinePoint } from "./LinePoint";
import { LineLength } from "../LineLength";
import { Line, Circle } from '../../types/shapes';

export function LineCircle(line: Line, circle: Circle) {
  let inside1 = PointCircle(line.startPoint, circle);
  let inside2 = PointCircle(line.endPoint, circle);
  if (inside1 || inside2) return true;

  // get length of the line
  let len = LineLength(line);

  // get dot product of the line and circle
  let dot =
    ((circle.x - line.startPoint.x) * (line.endPoint.x - line.startPoint.x) +
      (circle.y - line.startPoint.y) *
        (line.endPoint.y - line.startPoint.y)) /
    Math.pow(len, 2);

  // find the closest point on the line
  let closestX =
    line.startPoint.x + dot * (line.endPoint.x - line.startPoint.x);
  let closestY =
    line.startPoint.y + dot * (line.endPoint.y - line.startPoint.y);

  let onSegment = LinePoint(line, { x: closestX, y: closestY });
  if (!onSegment) return false;

  let tempLine = {
    startPoint: { x: closestX, y: closestY },
    endPoint: { x: circle.x, y: circle.y },
  };
  let distance = LineLength(tempLine);

  if (distance <= circle.radius) {
    return true;
  }
  return false;
}
