import { CollisionDetectionObject } from "../../../../types/types";
import { clamp as ClampFn } from "@utilspalooza/core/Clamp";
import ClampSource from "@utilspalooza/core/Clamp.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const clamp: CollisionDetectionObject = {
  keyFunction: ClampFn,
  dependencies: [],
  functionString: extractFunctionString(ClampSource),
};
