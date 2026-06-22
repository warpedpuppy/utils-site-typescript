import { CollisionDetectionObject } from "../../../../types/types";
import { triangleDataFromLine as TriangleDataFromLineFn } from "@utilspalooza/core/GetTriangleData";
import TriangleDataFromLineSource from "@utilspalooza/core/GetTriangleData.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const triangleDataFromLine: CollisionDetectionObject = {
  keyFunction: TriangleDataFromLineFn,
  dependencies: [],
  functionString: extractFunctionString(TriangleDataFromLineSource),
};
