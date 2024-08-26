import { Line, Circle } from "../../../../../types/types";
import { PointCircle } from "./PointCircle";
import { LinePoint } from "./LinePoint";

export function LineCircle(line: Line, circle: Circle) {
  let inside1 = PointCircle(line.startPoint, circle);
  let inside2 = PointCircle(line.endPoint, circle);
  if (inside1 || inside2) return true;

  // get length of the line
  let distX = line.startPoint.x - line.endPoint.x;
  let distY = line.startPoint.y - line.endPoint.y;
  let len = Math.sqrt(distX * distX + distY * distY);

  // get dot product of the line and circle
  let dot =
    ((circle.x - line.startPoint.x) * (line.endPoint.x - line.startPoint.x) +
      (circle.y - line.startPoint.y) * (line.endPoint.y - line.startPoint.y)) /
    Math.pow(len, 2);

  // find the closest point on the line
  let closestX =
    line.startPoint.x + dot * (line.endPoint.x - line.startPoint.x);
  let closestY =
    line.startPoint.y + dot * (line.endPoint.y - line.startPoint.y);

  // is this point actually on the line segment?
  // if so keep going, but if not, return false
  let onSegment = LinePoint(line, { x: closestX, y: closestY });
  if (!onSegment) return false;

  // optionally, draw a circle at the closest
  // point on the line
  // fill(255,0,0);
  // noStroke();
  // ellipse(closestX, closestY, 20, 20);

  // get distance to closest point
  distX = closestX - circle.x;
  distY = closestY - circle.y;
  let distance = Math.sqrt(distX * distX + distY * distY);

  if (distance <= circle.radius) {
    return true;
  }
  return false;
}
