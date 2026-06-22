import { CollisionDetectionObject } from "../../../../types/types";
import { sphereLighting as sphereLightingFn } from "@utilspalooza/core/SphereLighting";
import SphereLightingSource from "@utilspalooza/core/SphereLighting.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const SphereLighting: CollisionDetectionObject = {
  keyFunction: sphereLightingFn,
  dependencies: [],
  interfaces: ["Point"],
  functionString: extractFunctionString(SphereLightingSource),
};
