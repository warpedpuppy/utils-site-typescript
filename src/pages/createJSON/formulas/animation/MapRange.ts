import { CollisionDetectionObject } from "../../../../types/types";
import { mapRange as MapRangeFn } from "@utilspalooza/core/MapRange";
import MapRangeSource from "@utilspalooza/core/MapRange.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const mapRange: CollisionDetectionObject = {
  keyFunction: MapRangeFn,
  dependencies: [],
  functionString: extractFunctionString(MapRangeSource),
};
