import { CollisionDetectionObject } from "../../../../types/types";
import { distribute as distributeFn } from "../../../../core-functions/DistributeAroundCircle";
import DistributeAroundCircleSource from "../../../../core-functions/DistributeAroundCircle.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const DistributeAroundCircle: CollisionDetectionObject = {
  keyFunction: distributeFn,
  dependencies: [],
  interfaces: ["Point"],
  functionString: extractFunctionString(DistributeAroundCircleSource),
};
