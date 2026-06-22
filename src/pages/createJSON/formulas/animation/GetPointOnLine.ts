// NOTE: GetPointOnLine and MoveAlongLine are mathematically identical
// both compute linear interpolation between two points: x = start.x + t*(end.x - start.x).

import { CollisionDetectionObject } from "../../../../types/types";
import { Point } from "../../../../types/shapes";
import { getPointOnLine } from "@utilspalooza/core/GetPointOnLine";

export const GetPointOnLine: CollisionDetectionObject = {
  keyFunction: getPointOnLine,
  dependencies: [],
  interfaces: ["Point"],
  functionString: `
  function getPointOnLine(
    startPoint: Point,
    endPoint: Point,
    percentage: number
  ) {
    let x = startPoint.x + percentage * (endPoint.x - startPoint.x);
    let y = startPoint.y + percentage * (endPoint.y - startPoint.y);
    return { x, y };
  }`,
};
