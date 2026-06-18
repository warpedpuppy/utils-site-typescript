import { CollisionDetectionObject } from "../../../../types/types";
import { LineLength as LineLengthFn } from "../../../../core-functions/LineLength";
import LineLengthSource from "../../../../core-functions/LineLength.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const LineLength: CollisionDetectionObject = {
  keyFunction: LineLengthFn,
  dependencies: [],
  interfaces: ["Line"],
  functionString: extractFunctionString(LineLengthSource),
};
