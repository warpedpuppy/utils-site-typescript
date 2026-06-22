import { CollisionDetectionObject } from "../../../../types/types";
import { GetRandomColors as GetRandomColorsFn } from "@utilspalooza/core/GetRandomColors";
import GetRandomColorsSource from "@utilspalooza/core/GetRandomColors.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const GetRandomColors: CollisionDetectionObject = {
  keyFunction: GetRandomColorsFn,
  dependencies: [],
  functionString: extractFunctionString(GetRandomColorsSource),
};
