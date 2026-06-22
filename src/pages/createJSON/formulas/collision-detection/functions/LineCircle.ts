import { pointCircle } from "./PointCircle";
import { linePoint } from "./LinePoint";
import { lineLength } from "../../animation/LineLength";
import { CollisionDetectionObject } from "../../../../../types/types";
import { lineCircle as LineCircleImported } from "@utilspalooza/core/CollisionObjectAPI/LineCircle";
import LineCircleSource from "@utilspalooza/core/CollisionObjectAPI/LineCircle.ts?raw";
import { extractFunctionString } from "../../extractFunctionString";

export const lineCircle: CollisionDetectionObject = {
  keyFunction: LineCircleImported,
  dependencies: [
    pointCircle.functionString,
    linePoint.functionString,
    lineLength.functionString,
  ],
  interfaces: ["Circle", "Line"],
  functionString: extractFunctionString(LineCircleSource),
};
