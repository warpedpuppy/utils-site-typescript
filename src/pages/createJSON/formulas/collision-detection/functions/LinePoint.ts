import { CollisionDetectionObject } from "../../../../../types/types";
import { LineLength } from "../../animation/LineLength";
import { LinePoint as LinePointImported } from "@utilspalooza/core/CollisionObjectAPI/LinePoint";
import LinePointSource from "@utilspalooza/core/CollisionObjectAPI/LinePoint.ts?raw";
import { extractFunctionString } from "../../extractFunctionString";

export const LinePoint: CollisionDetectionObject = {
  keyFunction: LinePointImported,
  dependencies: [LineLength.functionString],
  interfaces: ["Point", "Line"],
  functionString: extractFunctionString(LinePointSource),
};
