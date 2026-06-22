import { CollisionDetectionObject } from "../../../../../types/types";
import { LineLine } from "./LineLine";
import { PolygonLine as PolygonLineImported } from "@utilspalooza/core/CollisionObjectAPI/PolygonLine";
import PolygonLineSource from "@utilspalooza/core/CollisionObjectAPI/PolygonLine.ts?raw";
import { extractFunctionString } from "../../extractFunctionString";

export const PolygonLine: CollisionDetectionObject = {
  keyFunction: PolygonLineImported,
  dependencies: [LineLine.functionString],
  interfaces: ["Line", "Polygon"],
  functionString: extractFunctionString(PolygonLineSource),
};
