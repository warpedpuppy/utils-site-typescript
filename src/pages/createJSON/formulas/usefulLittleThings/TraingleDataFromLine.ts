import { CollisionDetectionObject } from "../../../../types/types";
import { TriangleDataFromLine as TriangleDataFromLineFn } from "../../../../core-functions/GetTriangleData";
import TriangleDataFromLineSource from "../../../../core-functions/GetTriangleData.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const TriangleDataFromLine: CollisionDetectionObject = {
  keyFunction: TriangleDataFromLineFn,
  dependencies: [],
  functionString: extractFunctionString(TriangleDataFromLineSource),
};
