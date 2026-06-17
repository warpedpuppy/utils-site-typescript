import { CollisionDetectionObject } from "../../../../types/types";
import { Point } from "../../../../types/shapes";
import { LineLength } from "../../../../core-functions/LineLength";

function calculateTriangleData(startPoint: Point, endPoint: Point) {
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
}

export const TriangleDataFromLine: CollisionDetectionObject = {
  keyFunction: calculateTriangleData,
  dependencies: [],
  functionString: `
  function calculateTriangleData(startPoint: Point, endPoint: Point) {
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
