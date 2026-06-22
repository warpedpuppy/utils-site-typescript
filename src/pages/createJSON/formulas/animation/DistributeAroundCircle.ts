import { CollisionDetectionObject } from "../../../../types/types";
import { distribute as distributeFn } from "@utilspalooza/core/DistributeAroundCircle";
import DistributeAroundCircleSource from "@utilspalooza/core/DistributeAroundCircle.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const DistributeAroundCircle: CollisionDetectionObject = {
  keyFunction: distributeFn,
  dependencies: [],
  interfaces: ["Point"],
  functionString: extractFunctionString(DistributeAroundCircleSource),
};
