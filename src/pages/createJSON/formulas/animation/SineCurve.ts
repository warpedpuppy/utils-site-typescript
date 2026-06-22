import { CollisionDetectionObject } from "../../../../types/types";
import { SineCurve as SineCurveFn } from "@utilspalooza/core/SineCurve";
import SineCurveSource from "@utilspalooza/core/SineCurve.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const SineCurve: CollisionDetectionObject = {
  keyFunction: SineCurveFn,
  dependencies: [],
  functionString: extractFunctionString(SineCurveSource),
};
