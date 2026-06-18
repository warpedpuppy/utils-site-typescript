import { CollisionDetectionObject } from "../../../../types/types";
import { GetRotation as GetRotationFn } from "../../../../core-functions/GetRotation";
import GetRotationSource from "../../../../core-functions/GetRotation.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const GetRotation: CollisionDetectionObject = {
  keyFunction: GetRotationFn,
  dependencies: [],
  interfaces: ["Point"],
  functionString: extractFunctionString(GetRotationSource),
};
