import { CollisionDetectionObject } from "../../../../types/types";
import { TriangleDataFromLine as TriangleDataFromLineFn } from "@utilspalooza/core/GetTriangleData";
import TriangleDataFromLineSource from "@utilspalooza/core/GetTriangleData.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const TriangleDataFromLine: CollisionDetectionObject = {
  keyFunction: TriangleDataFromLineFn,
  dependencies: [],
  functionString: extractFunctionString(TriangleDataFromLineSource),
};
