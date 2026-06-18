import { CollisionDetectionObject } from "../../../../types/types";
import { QuadraticBezier as QuadraticBezierFn } from "../../../../core-functions/QuadraticBezier";
import QuadraticBezierSource from "../../../../core-functions/QuadraticBezier.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const QuadraticBezier: CollisionDetectionObject = {
  keyFunction: QuadraticBezierFn,
  dependencies: [],
  interfaces: ["Point"],
  functionString: extractFunctionString(QuadraticBezierSource),
};
