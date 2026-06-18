// NOTE: MoveAlongLine and GetPointOnLine (usefulLittleThings/GetPointOnLine.ts)
// are mathematically identical — both compute linear interpolation between two
// points: x = start.x + t*(end.x - start.x).  They exist separately because
// they serve different UI sections ("animations" vs "useful little things"), but
// the underlying equation is the same.  If you ever consolidate, this is the
// right place to start.

import { CollisionDetectionObject } from "../../../../types/types";
import { MoveAlongLine as MoveAlongLineFn } from "../../../../core-functions/MoveAlongLine";
import MoveAlongLineSource from "../../../../core-functions/MoveAlongLine.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const MoveAlongLine: CollisionDetectionObject = {
  keyFunction: MoveAlongLineFn,
  dependencies: [],
  interfaces: ["Point"],
  functionString: extractFunctionString(MoveAlongLineSource),
};
