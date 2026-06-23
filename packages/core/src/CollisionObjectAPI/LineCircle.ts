import { pointCircle } from "./PointCircle";
import { linePoint } from "./LinePoint";
import { lineLength } from "../LineLength";
import { Line, Circle } from '../types';

/**
 * Test whether a line segment intersects a circle (object-argument form of `lineToCircle`).
 *
 * Returns early if either endpoint is inside the circle; otherwise projects the
 * circle's center onto the segment and checks the closest point's distance.
 *
 * @param line - The line segment (`startPoint`, `endPoint`).
 * @param circle - The circle (`x`, `y`, `radius`).
 * @returns `true` if the segment touches or crosses the circle.
 * @example
 * lineCircle({ startPoint: { x: 0, y: 0 }, endPoint: { x: 10, y: 0 } }, { x: 5, y: 0, radius: 2 }); // => true
 */
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
