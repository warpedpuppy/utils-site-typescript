import { CollisionDetectionObject } from "../../../../../types/types";
import { LineCircle } from "./LineCircle";
import { PolygonPoint } from "./PolygonPoint";
import { PolygonCircle as PolygonCircleImported } from "../../../../../core-functions/CollisionObjectAPI/PolygonCircle";
import PolygonCircleSource from "../../../../../core-functions/CollisionObjectAPI/PolygonCircle.ts?raw";
import { extractFunctionString } from "../../extractFunctionString";

export const PolygonCircle: CollisionDetectionObject = {
  keyFunction: PolygonCircleImported,
  dependencies: [LineCircle.functionString, PolygonPoint.functionString],
  interfaces: ["Circle", "Polygon"],
  functionString: extractFunctionString(PolygonCircleSource),
};
