import { CollisionDetectionObject } from "../../../../types/types";
import { smoothstep as SmoothstepFn } from "@utilspalooza/core/Smoothstep";
import SmoothstepSource from "@utilspalooza/core/Smoothstep.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const smoothstep: CollisionDetectionObject = {
  keyFunction: SmoothstepFn,
  dependencies: [],
  functionString: extractFunctionString(SmoothstepSource),
};
