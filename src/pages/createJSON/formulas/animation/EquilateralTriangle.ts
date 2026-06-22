import { CollisionDetectionObject } from "../../../../types/types";
import { EquilateralTriangle as EquilateralTriangleFn } from "@utilspalooza/core/EquilateralTriangle";
import EquilateralTriangleSource from "@utilspalooza/core/EquilateralTriangle.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const EquilateralTriangle: CollisionDetectionObject = {
  keyFunction: EquilateralTriangleFn,
  dependencies: [],
  interfaces: ["Point"],
  functionString: extractFunctionString(EquilateralTriangleSource),
};
