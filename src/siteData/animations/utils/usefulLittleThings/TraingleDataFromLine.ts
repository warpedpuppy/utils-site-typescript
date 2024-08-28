import { CollisionDetectionObject } from "../../../../types/types";
import { LineLength } from "../animation/LineLength";
import { Point } from "../../../../types/shapes";

export const TriangleDataFromLine: CollisionDetectionObject = {
  keyFunction: function TriangleDataFromLine(
    startPoint: Point,
    endPoint: Point
  ) {
    let hypotenuse = LineLength.keyFunction({ startPoint, endPoint });
    let adjacent = LineLength.keyFunction({
      startPoint,
      endPoint: {
        x: endPoint.x,
        y: startPoint.y,
      },
    });
    let opposite = LineLength.keyFunction({
      startPoint: {
        x: endPoint.x,
        y: startPoint.y,
      },
      endPoint,
    });

    let oh = opposite / hypotenuse;
    let angle1 = Math.asin(oh); // could have used acos or atan -- we have the data
    let angleInDegrees = Math.floor(angle1 * (180 / Math.PI));
    let remainingAngle = 180 - angleInDegrees - 90;

    return { angleInDegrees, remainingAngle, hypotenuse, adjacent, opposite };
  },
  dependencies: [LineLength.functionString],
  functionString: `
  function TriangleDataFromLine(
    startPoint: Point,
    endPoint: Point
  ) {
    let hypotenuse = LineLength.keyFunction(startPoint, endPoint);
    let adjacent = LineLength.keyFunction(startPoint, {
      x: endPoint.x,
      y: startPoint.y,
    });
    let opposite = LineLength.keyFunction(
      {
        x: endPoint.x,
        y: startPoint.y,
      },
      endPoint
    );

    let oh = opposite / hypotenuse;
    let angle1 = Math.asin(oh); // could have used acos or atan -- we have the data
    let angleInDegrees = Math.floor(angle1 * (180 / Math.PI));
    let remainingAngle = 180 - angleInDegrees - 90;

    return { angleInDegrees, remainingAngle, hypotenuse, adjacent, opposite };
  }
  `,
};
