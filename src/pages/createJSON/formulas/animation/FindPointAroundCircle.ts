import { CollisionDetectionObject } from "../../../../types/types";
import { FindPointAroundCircle as FindPointAroundCircleFn } from "../../../../core-functions/FindPointAroundCircle";
import FindPointAroundCircleSource from "../../../../core-functions/FindPointAroundCircle.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const FindPointAroundCircle: CollisionDetectionObject = {
  keyFunction: FindPointAroundCircleFn,
  dependencies: [],
  interfaces: ["Point"],
  functionString: extractFunctionString(FindPointAroundCircleSource),
};
