import { CollisionDetectionObject } from "../../../../types/types";
import { quadraticBezier as QuadraticBezierFn } from "@utilspalooza/core/QuadraticBezier";
import QuadraticBezierSource from "@utilspalooza/core/QuadraticBezier.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const quadraticBezier: CollisionDetectionObject = {
  keyFunction: QuadraticBezierFn,
  dependencies: [],
  interfaces: ["Point"],
  functionString: extractFunctionString(QuadraticBezierSource),
};
