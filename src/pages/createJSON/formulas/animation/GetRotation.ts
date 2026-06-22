import { CollisionDetectionObject } from "../../../../types/types";
import { getRotation as GetRotationFn } from "@utilspalooza/core/GetRotation";
import GetRotationSource from "@utilspalooza/core/GetRotation.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const getRotation: CollisionDetectionObject = {
  keyFunction: GetRotationFn,
  dependencies: [],
  interfaces: ["Point"],
  functionString: extractFunctionString(GetRotationSource),
};
