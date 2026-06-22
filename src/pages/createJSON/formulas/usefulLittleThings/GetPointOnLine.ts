import { CollisionDetectionObject } from "../../../../types/types";
import { getPointOnLine as getPointOnLineFn } from "@utilspalooza/core/GetPointOnLine";
import GetPointOnLineSource from "@utilspalooza/core/GetPointOnLine.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const GetPointOnLine: CollisionDetectionObject = {
  keyFunction: getPointOnLineFn,
  dependencies: [],
  interfaces: ["Point"],
  functionString: extractFunctionString(GetPointOnLineSource),
};
