import { PointCircle } from "./PointCircle";
import { LinePoint } from "./LinePoint";
import { LineLength } from "../../animation/LineLength";
import { CollisionDetectionObject } from "../../../../../types/types";
import { LineCircle as LineCircleImported } from "../../../../../core-functions/CollisionObjectAPI/LineCircle";
import LineCircleSource from "../../../../../core-functions/CollisionObjectAPI/LineCircle.ts?raw";
import { extractFunctionString } from "../../extractFunctionString";

export const LineCircle: CollisionDetectionObject = {
  keyFunction: LineCircleImported,
  dependencies: [
    PointCircle.functionString,
    LinePoint.functionString,
    LineLength.functionString,
  ],
  interfaces: ["Circle", "Line"],
  functionString: extractFunctionString(LineCircleSource),
};
