import { CollisionDetectionObject } from "../../../../types/types";
import { getRandomColors as GetRandomColorsFn } from "@utilspalooza/core/GetRandomColors";
import GetRandomColorsSource from "@utilspalooza/core/GetRandomColors.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const getRandomColors: CollisionDetectionObject = {
  keyFunction: GetRandomColorsFn,
  dependencies: [],
  functionString: extractFunctionString(GetRandomColorsSource),
};
