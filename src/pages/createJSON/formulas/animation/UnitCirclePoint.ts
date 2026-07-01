import { CollisionDetectionObject } from "../../../../types/types";
import { unitCirclePoint as UnitCirclePointFn } from "@utilspalooza/core/UnitCirclePoint";
import UnitCirclePointSource from "@utilspalooza/core/UnitCirclePoint.ts?raw";
import { extractFunctionString } from "../extractFunctionString";

export const unitCirclePoint: CollisionDetectionObject = {
  keyFunction: UnitCirclePointFn,
  dependencies: [],
  functionString: extractFunctionString(UnitCirclePointSource),
};
