import { CollisionDetectionObject } from "../../../../../types/types";
import { polygonPoint as PolygonPointImported } from "@utilspalooza/core/CollisionObjectAPI/PolygonPoint";
import PolygonPointSource from "@utilspalooza/core/CollisionObjectAPI/PolygonPoint.ts?raw";
import { extractFunctionString } from "../../extractFunctionString";

export const polygonPoint: CollisionDetectionObject = {
  keyFunction: PolygonPointImported,
  dependencies: [],
  interfaces: ["Point", "Polygon"],
  functionString: extractFunctionString(PolygonPointSource),
};
