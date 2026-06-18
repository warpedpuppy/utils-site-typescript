import { CollisionDetectionObject } from "../../../../types/types";
import { Rad2Deg as Rad2DegFn } from "../../../../core-functions/RadToDeg";
import Rad2DegSource from "../../../../core-functions/RadToDeg.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const Rad2Deg: CollisionDetectionObject = {
  keyFunction: Rad2DegFn,
  dependencies: [],
  functionString: extractFunctionString(Rad2DegSource),
};
