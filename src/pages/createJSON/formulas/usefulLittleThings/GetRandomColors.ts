import { CollisionDetectionObject } from "../../../../types/types";
import { GetRandomColors as GetRandomColorsFn } from "../../../../core-functions/GetRandomColors";
import GetRandomColorsSource from "../../../../core-functions/GetRandomColors.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const GetRandomColors: CollisionDetectionObject = {
  keyFunction: GetRandomColorsFn,
  dependencies: [],
  functionString: extractFunctionString(GetRandomColorsSource),
};
