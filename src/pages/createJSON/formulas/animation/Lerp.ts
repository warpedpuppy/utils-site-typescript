import { CollisionDetectionObject } from "../../../../types/types";
import { lerp as LerpFn } from "@utilspalooza/core/Lerp";
import LerpSource from "@utilspalooza/core/Lerp.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const lerp: CollisionDetectionObject = {
  keyFunction: LerpFn,
  dependencies: [],
  functionString: extractFunctionString(LerpSource),
};
