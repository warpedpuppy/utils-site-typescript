import { Line, Circle } from "../../../../types/shapes";
import { PointCircle } from "./PointCircle";
import { LinePoint } from "./LinePoint";
import { LineLength } from "../../animation/LineLength";
import { CollisionDetectionObject } from "../../../../types/types";

export const LineCircle: CollisionDetectionObject = {
  keyFunction: function LineCircle(line: Line, circle: Circle) {
    let inside1 = PointCircle.keyFunction(line.startPoint, circle);
    let inside2 = PointCircle.keyFunction(line.endPoint, circle);
    if (inside1 || inside2) return true;

    // get length of the line
    let len = LineLength.keyFunction(line);

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

    let onSegment = LinePoint.keyFunction(line, { x: closestX, y: closestY });
    if (!onSegment) return false;

    let tempLine = {
      startPoint: { x: closestX, y: closestY },
      endPoint: { x: circle.x, y: circle.y },
    };
    let distance = LineLength.keyFunction(tempLine);

    if (distance <= circle.radius) {
      return true;
    }
    return false;
  },
  dependencies: [
    PointCircle.functionString,
    LinePoint.functionString,
    LineLength.functionString,
  ],
  functionString: `
  function LineCircle(line: Line, circle: Circle) {
    let inside1 = PointCircle(line.startPoint, circle);
    let inside2 = PointCircle(line.endPoint, circle);
    if (inside1 || inside2) return true;
  
    let len = LineLength(line);
  
    let dot =
      ((circle.x - line.startPoint.x) * (line.endPoint.x - line.startPoint.x) +
        (circle.y - line.startPoint.y) * (line.endPoint.y - line.startPoint.y)) /
      Math.pow(len, 2);
  
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
  `,
};
