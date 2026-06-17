import { Polygon, Line } from "../../../../../types/shapes";
import { PolygonPoint } from "./PolygonPoint";
import { PolygonLine } from "./PolygonLine";
import { LineLine } from "./LineLine";
import { CollisionDetectionObject } from "../../../../../types/types";
import { PolygonPolygon as PolygonPolygonImported } from "../../../../../core-functions/CollisionObjectAPI/PolygonPolygon";

export const PolygonPolygon: CollisionDetectionObject = {
  keyFunction: PolygonPolygonImported,
  dependencies: [
    PolygonPoint.functionString,
    PolygonLine.functionString,
    LineLine.functionString,
  ],
  interfaces: ["Polygon"],
  functionString: `
function PolygonPolygon(polygon1: Polygon, polygon2: Polygon) {
  let next = 0;
  const { vertices } = polygon1;
  for (let current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next === vertices.length) next = 0;

    let startPoint = vertices[current];
    let endPoint = vertices[next];

    let line: Line = { startPoint, endPoint };
    let collision = PolygonLine(polygon2, line);
    if (collision) return true;

    collision = PolygonPoint(polygon1, polygon2.vertices[0]);
    if (collision) return true;
  }
  return false;
}`,
};
