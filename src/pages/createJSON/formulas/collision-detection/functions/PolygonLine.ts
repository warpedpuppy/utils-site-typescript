import { Polygon, Line } from "../../../../../types/shapes";
import { CollisionDetectionObject } from "../../../../../types/types";
import { LineLine } from "./LineLine";
import { PolygonLine as PolygonLineImported } from "../../../../../core-functions/CollisionObjectAPI/PolygonLine";

export const PolygonLine: CollisionDetectionObject = {
  keyFunction: PolygonLineImported,
  dependencies: [LineLine.functionString],
  functionString: `
function PolygonLine(polygon: Polygon, line: Line) {
  
  let next = 0;
  const { vertices } = polygon;
  for (let current = 0; current < vertices.length; current++) {
   
    next = current + 1;
    if (next === vertices.length) next = 0;

   
    let x3 = vertices[current].x;
    let y3 = vertices[current].y;
    let x4 = vertices[next].x;
    let y4 = vertices[next].y;

    let tempLine: Line = {
      startPoint: { x: x3, y: y3 },
      endPoint: { x: x4, y: y4 },
    };
    let hit = LineLine(line, tempLine).hit;
    if (hit) {
      return true;
    }
  }
  return false;
}
`,
};
