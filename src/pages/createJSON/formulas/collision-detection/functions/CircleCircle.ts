import { CollisionDetectionObject } from "../../../../../types/types";
import { circleCircle as CircleCircleImported } from "@utilspalooza/core/CollisionObjectAPI/CircleCircle";
import CircleCircleSource from "@utilspalooza/core/CollisionObjectAPI/CircleCircle.ts?raw";
import { extractFunctionString } from "../../extractFunctionString";

export const circleCircle: CollisionDetectionObject = {
  keyFunction: CircleCircleImported,
  dependencies: [],
  interfaces: ["Circle"],
  functionString: extractFunctionString(CircleCircleSource),
};
