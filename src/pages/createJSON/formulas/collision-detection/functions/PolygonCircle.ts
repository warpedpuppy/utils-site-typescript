import { CollisionDetectionObject } from "../../../../../types/types";
import { lineCircle } from "./LineCircle";
import { polygonPoint } from "./PolygonPoint";
import { polygonCircle as PolygonCircleImported } from "@utilspalooza/core/CollisionObjectAPI/PolygonCircle";
import PolygonCircleSource from "@utilspalooza/core/CollisionObjectAPI/PolygonCircle.ts?raw";
import { extractFunctionString } from "../../extractFunctionString";

export const polygonCircle: CollisionDetectionObject = {
  keyFunction: PolygonCircleImported,
  dependencies: [lineCircle.functionString, polygonPoint.functionString],
  interfaces: ["Circle", "Polygon"],
  functionString: extractFunctionString(PolygonCircleSource),
};
