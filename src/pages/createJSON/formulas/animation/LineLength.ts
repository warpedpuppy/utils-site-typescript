import { CollisionDetectionObject } from "../../../../types/types";
import { LineLength as LineLengthFn } from "@utilspalooza/core/LineLength";
import LineLengthSource from "@utilspalooza/core/LineLength.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const LineLength: CollisionDetectionObject = {
  keyFunction: LineLengthFn,
  dependencies: [],
  interfaces: ["Line"],
  functionString: extractFunctionString(LineLengthSource),
};
