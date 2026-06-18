import { PolygonPoint } from "./PolygonPoint";
import { PolygonLine } from "./PolygonLine";
import { LineLine } from "./LineLine";
import { CollisionDetectionObject } from "../../../../../types/types";
import { PolygonPolygon as PolygonPolygonImported } from "../../../../../core-functions/CollisionObjectAPI/PolygonPolygon";
import PolygonPolygonSource from "../../../../../core-functions/CollisionObjectAPI/PolygonPolygon.ts?raw";
import { extractFunctionString } from "../../extractFunctionString";

export const PolygonPolygon: CollisionDetectionObject = {
  keyFunction: PolygonPolygonImported,
  dependencies: [
    PolygonPoint.functionString,
    PolygonLine.functionString,
    LineLine.functionString,
  ],
  interfaces: ["Polygon"],
  functionString: extractFunctionString(PolygonPolygonSource),
};
