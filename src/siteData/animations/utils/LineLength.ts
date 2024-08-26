import { Point } from "../../../types/types";

export function LineLength(startPoint: Point, endPoint: Point) {
  let a = startPoint.x - endPoint.x;
  let b = startPoint.y - endPoint.y;
  return Math.sqrt(a * a + b * b);
}
