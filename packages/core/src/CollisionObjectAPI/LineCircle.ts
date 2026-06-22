import { pointCircle } from "./PointCircle";
import { linePoint } from "./LinePoint";
import { lineLength } from "../LineLength";
import { Line, Circle } from '../types';

export function lineCircle(line: Line, circle: Circle) {
  let inside1 = pointCircle(line.startPoint, circle);
  let inside2 = pointCircle(line.endPoint, circle);
  if (inside1 || inside2) return true;

  // get length of the line
  let len = lineLength(line);

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

  let onSegment = linePoint(line, { x: closestX, y: closestY });
  if (!onSegment) return false;

  let tempLine = {
    startPoint: { x: closestX, y: closestY },
    endPoint: { x: circle.x, y: circle.y },
  };
  let distance = lineLength(tempLine);

  if (distance <= circle.radius) {
    return true;
  }
  return false;
}
