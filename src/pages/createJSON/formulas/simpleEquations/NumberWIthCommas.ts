import { CollisionDetectionObject } from "../../../../types/types";
import { NumberWithCommas as NumberWithCommasFn } from "@utilspalooza/core/NumberWithCommas";
import NumberWithCommasSource from "@utilspalooza/core/NumberWithCommas.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const NumberWithCommas: CollisionDetectionObject = {
  keyFunction: NumberWithCommasFn,
  dependencies: [],
  functionString: extractFunctionString(NumberWithCommasSource),
};
