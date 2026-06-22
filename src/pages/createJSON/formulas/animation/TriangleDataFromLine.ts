import { CollisionDetectionObject } from "../../../../types/types";
import { Point } from "../../../../types/shapes";
import { triangleDataFromLine as TriangleDataFromLineFn } from "@utilspalooza/core/GetTriangleData";
import { lineLength } from "@utilspalooza/core/LineLength";

export const triangleDataFromLine: CollisionDetectionObject = {
  keyFunction: TriangleDataFromLineFn,
  dependencies: [],
  interfaces: ["Point"],
  functionString: `
  function triangleDataFromLine(startPoint: Point, endPoint: Point) {
    let hypotenuse = lineLength({ startPoint, endPoint });
    let adjacent = lineLength({
      startPoint,
      endPoint: {
        x: endPoint.x,
        y: startPoint.y,
      },
    });
    let opposite = lineLength({
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
