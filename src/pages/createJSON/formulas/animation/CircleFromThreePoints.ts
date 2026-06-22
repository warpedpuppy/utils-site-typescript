import { CollisionDetectionObject } from "../../../../types/types";
import { circleFromThreePoints as CircleFromThreePointsFn } from "@utilspalooza/core/CircleFromThreePoints";
import CircleFromThreePointsSource from "@utilspalooza/core/CircleFromThreePoints.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const circleFromThreePoints: CollisionDetectionObject = {
  keyFunction: CircleFromThreePointsFn,
  dependencies: [],
  interfaces: ["Point"],
  functionString: extractFunctionString(CircleFromThreePointsSource),
};
