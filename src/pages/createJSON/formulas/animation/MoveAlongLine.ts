// NOTE: MoveAlongLine and GetPointOnLine (usefulLittleThings/GetPointOnLine.ts)
// are mathematically identical — both compute linear interpolation between two
// points: x = start.x + t*(end.x - start.x).  They exist separately because
// they serve different UI sections ("animations" vs "useful little things"), but
// the underlying equation is the same.  If you ever consolidate, this is the
// right place to start.

import { CollisionDetectionObject } from "../../../../types/types";
import { Point } from "../../../../types/shapes";

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
  interfaces: ["Point"],
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
