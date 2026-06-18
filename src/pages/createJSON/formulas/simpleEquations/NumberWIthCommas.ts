import { CollisionDetectionObject } from "../../../../types/types";
import { NumberWithCommas as NumberWithCommasFn } from "../../../../core-functions/NumberWithCommas";
import NumberWithCommasSource from "../../../../core-functions/NumberWithCommas.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const NumberWithCommas: CollisionDetectionObject = {
  keyFunction: NumberWithCommasFn,
  dependencies: [],
  functionString: extractFunctionString(NumberWithCommasSource),
};
