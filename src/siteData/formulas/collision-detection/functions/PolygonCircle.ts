import { Polygon, Circle } from "../../../../types/shapes";
import { CollisionDetectionObject } from "../../../../types/types";
import { LineCircle } from "./LineCircle";
import { PolygonPoint } from "./PolygonPoint";
import { PolygonCircle as PolygonCircleImported } from "../../../../core-functions/CollisionObjectAPI/PolygonCircle";

export const PolygonCircle: CollisionDetectionObject = {
  keyFunction: PolygonCircleImported,
  dependencies: [LineCircle.functionString, PolygonPoint.functionString],
  functionString: `
export function PolygonCircle(polygon: Polygon, circle: Circle) {
  let next = 0;
  const { vertices } = polygon;
  for (let current = 0; current < vertices.length; current++) {
   
    next = current + 1;
    if (next === vertices.length) next = 0;

    let startPoint = vertices[current]; 
    let endPoint = vertices[next]; 

    let line = { startPoint, endPoint };
    let collision = LineCircle(line, circle);
    if (collision) return true;
  }

  let centerInside = PolygonPoint(polygon, { x: circle.x, y: circle.y });
  if (centerInside) return true;

  return false;
}
`,
};
