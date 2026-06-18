import { CollisionDetectionObject } from "../../../../types/types";
import { sphereLighting as sphereLightingFn } from "../../../../core-functions/SphereLighting";
import SphereLightingSource from "../../../../core-functions/SphereLighting.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const SphereLighting: CollisionDetectionObject = {
  keyFunction: sphereLightingFn,
  dependencies: [],
  functionString: extractFunctionString(SphereLightingSource),
};
