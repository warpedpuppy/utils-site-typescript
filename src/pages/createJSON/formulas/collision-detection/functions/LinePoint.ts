import { CollisionDetectionObject } from "../../../../../types/types";
import { lineLength } from "../../animation/LineLength";
import { linePoint as LinePointImported } from "@utilspalooza/core/CollisionObjectAPI/LinePoint";
import LinePointSource from "@utilspalooza/core/CollisionObjectAPI/LinePoint.ts?raw";
import { extractFunctionString } from "../../extractFunctionString";

export const linePoint: CollisionDetectionObject = {
  keyFunction: LinePointImported,
  dependencies: [lineLength.functionString],
  interfaces: ["Point", "Line"],
  functionString: extractFunctionString(LinePointSource),
};
