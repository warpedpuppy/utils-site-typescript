import { CollisionDetectionObject } from "../../../../types/types";
import { QuadraticBezier as QuadraticBezierFn } from "@utilspalooza/core/QuadraticBezier";
import QuadraticBezierSource from "@utilspalooza/core/QuadraticBezier.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const QuadraticBezier: CollisionDetectionObject = {
  keyFunction: QuadraticBezierFn,
  dependencies: [],
  interfaces: ["Point"],
  functionString: extractFunctionString(QuadraticBezierSource),
};
