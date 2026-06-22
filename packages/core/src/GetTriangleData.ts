import { lineLength } from "./LineLength";
import { Point } from './types';

export function getTriangleData(p1: Point, p2: Point) {
  let dx = p2.x - p1.x, dy = p2.y - p1.y;
  return { dx, dy, distance: Math.sqrt(dx * dx + dy * dy) };
}

export function triangleDataFromLine(startPoint: Point, endPoint: Point) {
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
}
