import { CollisionDetectionObject } from "../../../../types/types";
import { inverseLerp as InverseLerpFn } from "@utilspalooza/core/InverseLerp";
import InverseLerpSource from "@utilspalooza/core/InverseLerp.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const inverseLerp: CollisionDetectionObject = {
  keyFunction: InverseLerpFn,
  dependencies: [],
  functionString: extractFunctionString(InverseLerpSource),
};
