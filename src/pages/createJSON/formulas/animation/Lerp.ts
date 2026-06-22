import { CollisionDetectionObject } from "../../../../types/types";
import { Lerp as LerpFn } from "@utilspalooza/core/Lerp";
import LerpSource from "@utilspalooza/core/Lerp.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const Lerp: CollisionDetectionObject = {
  keyFunction: LerpFn,
  dependencies: [],
  functionString: extractFunctionString(LerpSource),
};
