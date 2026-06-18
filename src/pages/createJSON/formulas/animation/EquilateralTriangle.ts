import { CollisionDetectionObject } from "../../../../types/types";
import { EquilateralTriangle as EquilateralTriangleFn } from "../../../../core-functions/EquilateralTriangle";
import EquilateralTriangleSource from "../../../../core-functions/EquilateralTriangle.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const EquilateralTriangle: CollisionDetectionObject = {
  keyFunction: EquilateralTriangleFn,
  dependencies: [],
  interfaces: ["Point"],
  functionString: extractFunctionString(EquilateralTriangleSource),
};
