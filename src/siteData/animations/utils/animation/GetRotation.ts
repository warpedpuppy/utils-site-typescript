import { CollisionDetectionObject } from "../../../../types/types";
import { Point } from "../../../../types/shapes";

export const GetRotation: CollisionDetectionObject = {
  keyFunction: function GetRotation(
    destinationPoint: Point,
    zeroReference: Point
  ) {
    return Math.atan2(
      destinationPoint.y - zeroReference.y,
      destinationPoint.x - zeroReference.x
    );
  },
  dependencies: [],
  functionString: `
  function GetRotation(
    destinationPoint: Point,
    zeroReference: Point
  ) {
    return Math.atan2(
      destinationPoint.y - zeroReference.y,
      destinationPoint.x - zeroReference.x
    );
  }`,
};
