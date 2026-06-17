import { CollisionDetectionObject } from "../../../../types/types";
import { Point } from "../../../../types/shapes";
export const GetPointOnLine: CollisionDetectionObject = {
  keyFunction: function GetPointOnLine(
    start: Point,
    end: Point,
    percentage: number
  ) {
    let x = start.x + percentage * (end.x - start.x);
    let y = start.y + percentage * (end.y - start.y);
    return {
      x,
      y,
    };
  },
  dependencies: [],
  functionString: `
   function GetPointOnLine(
    start: Point,
    end: Point,
    percentage: number
  ) {
    let x = start.x + percentage * (end.x - start.x);
    let y = start.y + percentage * (end.y - start.y);
    return {
      x,
      y,
    };
  }
  `,
};
