import { CollisionDetectionObject } from "../../../../../types/types";
import { CircleCircle as CircleCircleImported } from "../../../../../core-functions/CollisionObjectAPI/CircleCircle";
import CircleCircleSource from "../../../../../core-functions/CollisionObjectAPI/CircleCircle.ts?raw";
import { extractFunctionString } from "../../extractFunctionString";

export const CircleCircle: CollisionDetectionObject = {
  keyFunction: CircleCircleImported,
  dependencies: [],
  interfaces: ["Circle"],
  functionString: extractFunctionString(CircleCircleSource),
};
