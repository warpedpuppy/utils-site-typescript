import { CollisionDetectionObject } from "../../../../types/types";
import { CircleFromThreePoints as CircleFromThreePointsFn } from "../../../../core-functions/CircleFromThreePoints";
import CircleFromThreePointsSource from "../../../../core-functions/CircleFromThreePoints.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const CircleFromThreePoints: CollisionDetectionObject = {
  keyFunction: CircleFromThreePointsFn,
  dependencies: [],
  interfaces: ["Point"],
  functionString: extractFunctionString(CircleFromThreePointsSource),
};
