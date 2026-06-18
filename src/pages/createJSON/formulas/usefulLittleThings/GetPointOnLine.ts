import { CollisionDetectionObject } from "../../../../types/types";
import { getPointOnLine as getPointOnLineFn } from "../../../../core-functions/GetPointOnLine";
import GetPointOnLineSource from "../../../../core-functions/GetPointOnLine.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const GetPointOnLine: CollisionDetectionObject = {
  keyFunction: getPointOnLineFn,
  dependencies: [],
  functionString: extractFunctionString(GetPointOnLineSource),
};
