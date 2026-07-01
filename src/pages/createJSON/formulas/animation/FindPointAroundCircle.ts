import { CollisionDetectionObject } from "../../../../types/types";
import { findPointAroundCircle as FindPointAroundCircleFn } from "@utilspalooza/core/FindPointAroundCircle";
import FindPointAroundCircleSource from "@utilspalooza/core/FindPointAroundCircle.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const findPointAroundCircle: CollisionDetectionObject = {
  keyFunction: FindPointAroundCircleFn,
  dependencies: [],
  interfaces: ["Point"],
  functionString: extractFunctionString(FindPointAroundCircleSource),
};
