import { CollisionDetectionObject } from "../../../../types/types";
import { SineCurve as SineCurveFn } from "../../../../core-functions/SineCurve";
import SineCurveSource from "../../../../core-functions/SineCurve.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const SineCurve: CollisionDetectionObject = {
  keyFunction: SineCurveFn,
  dependencies: [],
  functionString: extractFunctionString(SineCurveSource),
};
