import { CollisionDetectionObject } from "../../../../types/types";
import { Rad2Deg as Rad2DegFn } from "@utilspalooza/core/RadToDeg";
import Rad2DegSource from "@utilspalooza/core/RadToDeg.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const Rad2Deg: CollisionDetectionObject = {
  keyFunction: Rad2DegFn,
  dependencies: [],
  functionString: extractFunctionString(Rad2DegSource),
};
