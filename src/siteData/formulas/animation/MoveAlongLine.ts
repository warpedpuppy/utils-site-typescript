import { CollisionDetectionObject } from "../../../types/types";
import { Point } from "../../../types/shapes";

export const MoveAlongLine: CollisionDetectionObject = {
  keyFunction: function MoveAlongLine(
    origin: Point,
    destination: Point,
    ratio: number
  ) {
    let x = origin.x + ratio * (destination.x - origin.x);
    let y = origin.y + ratio * (destination.y - origin.y);
    return { x, y };
  },
  dependencies: [],
  functionString: `
  function MoveAlongLine(
    origin: Point,
    destination: Point,
    ratio: number
  ) {
    let x = origin.x + ratio * (destination.x - origin.x);
    let y = origin.y + ratio * (destination.y - origin.y);
    return { x, y };
  }`,
};
