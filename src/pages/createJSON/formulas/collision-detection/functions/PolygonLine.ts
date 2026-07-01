import { CollisionDetectionObject } from "../../../../../types/types";
import { lineLine } from "./LineLine";
import { polygonLine as PolygonLineImported } from "@utilspalooza/core/CollisionObjectAPI/PolygonLine";
import PolygonLineSource from "@utilspalooza/core/CollisionObjectAPI/PolygonLine.ts?raw";
import { extractFunctionString } from "../../extractFunctionString";

export const polygonLine: CollisionDetectionObject = {
  keyFunction: PolygonLineImported,
  dependencies: [lineLine.functionString],
  interfaces: ["Line", "Polygon"],
  functionString: extractFunctionString(PolygonLineSource),
};
