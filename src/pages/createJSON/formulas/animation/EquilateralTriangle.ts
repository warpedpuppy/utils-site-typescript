import { CollisionDetectionObject } from "../../../../types/types";
import { equilateralTriangle as EquilateralTriangleFn } from "@utilspalooza/core/EquilateralTriangle";
import EquilateralTriangleSource from "@utilspalooza/core/EquilateralTriangle.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const equilateralTriangle: CollisionDetectionObject = {
  keyFunction: EquilateralTriangleFn,
  dependencies: [],
  interfaces: ["Point"],
  functionString: extractFunctionString(EquilateralTriangleSource),
};
