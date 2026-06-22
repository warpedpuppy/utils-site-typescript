import { polygonPoint } from "./PolygonPoint";
import { polygonLine } from "./PolygonLine";
import { lineLine } from "./LineLine";
import { CollisionDetectionObject } from "../../../../../types/types";
import { polygonPolygon as PolygonPolygonImported } from "@utilspalooza/core/CollisionObjectAPI/PolygonPolygon";
import PolygonPolygonSource from "@utilspalooza/core/CollisionObjectAPI/PolygonPolygon.ts?raw";
import { extractFunctionString } from "../../extractFunctionString";

export const polygonPolygon: CollisionDetectionObject = {
  keyFunction: PolygonPolygonImported,
  dependencies: [
    polygonPoint.functionString,
    polygonLine.functionString,
    lineLine.functionString,
  ],
  interfaces: ["Polygon"],
  functionString: extractFunctionString(PolygonPolygonSource),
};
