import { CollisionDetectionObject } from "../../../../types/types";
import { Point } from "../../../../types/shapes";
import { TriangleDataFromLine as TriangleDataFromLineFn } from "../../../../core-functions/GetTriangleData";
import { LineLength } from "../../../../core-functions/LineLength";

export const TriangleDataFromLine: CollisionDetectionObject = {
  keyFunction: TriangleDataFromLineFn,
  dependencies: [],
  interfaces: ["Point"],
  functionString: `
  function TriangleDataFromLine(startPoint: Point, endPoint: Point) {
    let hypotenuse = LineLength({ startPoint, endPoint });
    let adjacent = LineLength({
      startPoint,
      endPoint: {
        x: endPoint.x,
        y: startPoint.y,
      },
    });
    let opposite = LineLength({
      startPoint: {
        x: endPoint.x,
        y: startPoint.y,
      },
      endPoint,
    });

    let oh = opposite / hypotenuse;
    let angle1 = Math.asin(oh);
    let angleInDegrees = Math.floor(angle1 * (180 / Math.PI));
    let remainingAngle = 180 - angleInDegrees - 90;

    return { angleInDegrees, remainingAngle, hypotenuse, adjacent, opposite };
  }`,
};
