import { Point, Polygon, Line, Circle } from "../../../../../types/types";
import { LineLine } from "./LineLine";

export function PolygonLine(polygon: Polygon, line: Line) {
  // go through each of the vertices, plus the next
  // vertex in the list
  let next = 0;
  const { vertices } = polygon;
  for (let current = 0; current < vertices.length; current++) {
    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current + 1;
    if (next === vertices.length) next = 0;

    // get the PVectors at our current position
    // extract X/Y coordinates from each
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

  // never got a hit
  return false;
}
