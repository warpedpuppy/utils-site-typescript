import { CollisionDetectionObject } from "../../../../../types/types";
import { PolygonPoint as PolygonPointImported } from "../../../../../core-functions/CollisionObjectAPI/PolygonPoint";
import PolygonPointSource from "../../../../../core-functions/CollisionObjectAPI/PolygonPoint.ts?raw";
import { extractFunctionString } from "../../extractFunctionString";

export const PolygonPoint: CollisionDetectionObject = {
  keyFunction: PolygonPointImported,
  dependencies: [],
  interfaces: ["Point", "Polygon"],
  functionString: extractFunctionString(PolygonPointSource),
};
