import { CollisionDetectionObject } from "../../../../types/types";
import { CircleFromThreePoints as CircleFromThreePointsFn } from "@utilspalooza/core/CircleFromThreePoints";
import CircleFromThreePointsSource from "@utilspalooza/core/CircleFromThreePoints.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const CircleFromThreePoints: CollisionDetectionObject = {
  keyFunction: CircleFromThreePointsFn,
  dependencies: [],
  interfaces: ["Point"],
  functionString: extractFunctionString(CircleFromThreePointsSource),
};
