import { CollisionDetectionObject } from "../../../types/types";
import { Point } from "../../../types/shapes";

export const GetRotation: CollisionDetectionObject = {
  keyFunction: function GetRotation(
    currentPoint: Point,
    destinationPoint: Point
  ) {
    return Math.atan2(
      destinationPoint.y - currentPoint.y,
      destinationPoint.x - currentPoint.x
    );
  },
  dependencies: [],
  functionString: `
  function GetRotation(
    currentPoint: Point,
    destinationPoint: Point
  ) {
    return Math.atan2(
      destinationPoint.y - currentPoint.y,
      destinationPoint.x - currentPoint.x
    );
  }`,
};
