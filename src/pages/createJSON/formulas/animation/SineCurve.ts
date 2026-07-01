import { CollisionDetectionObject } from "../../../../types/types";
import { sineCurve as SineCurveFn } from "@utilspalooza/core/SineCurve";
import SineCurveSource from "@utilspalooza/core/SineCurve.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const sineCurve: CollisionDetectionObject = {
  keyFunction: SineCurveFn,
  dependencies: [],
  functionString: extractFunctionString(SineCurveSource),
};
