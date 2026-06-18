import { CollisionDetectionObject } from "../../../../types/types";
import { Lerp as LerpFn } from "../../../../core-functions/Lerp";
import LerpSource from "../../../../core-functions/Lerp.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const Lerp: CollisionDetectionObject = {
  keyFunction: LerpFn,
  dependencies: [],
  functionString: extractFunctionString(LerpSource),
};
