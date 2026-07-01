import { CollisionDetectionObject } from "../../../../types/types";
import { radToDeg as Rad2DegFn } from "@utilspalooza/core/RadToDeg";
import Rad2DegSource from "@utilspalooza/core/RadToDeg.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const radToDeg: CollisionDetectionObject = {
  keyFunction: Rad2DegFn,
  dependencies: [],
  functionString: extractFunctionString(Rad2DegSource),
};
