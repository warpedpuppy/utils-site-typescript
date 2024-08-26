import { Polygon, Line } from "../../../../../types/types";
import { polyPoint } from "./PolygonPoint";
import { polyLine } from "./PolygonLine";
export function polyPoly(polygon1: Polygon, polygon2: Polygon) {
  // go through each of the vertices, plus the next
  // vertex in the list

  let next = 0;

  for (let current = 0; current < polygon1.vertices.length; current++) {
    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current + 1;
    if (next === polygon1.vertices.length) next = 0;

    // get the PVectors at our current position
    // this makes our if statement a little cleaner
    let vc = polygon1.vertices[current]; // c for "current"
    let vn = polygon1.vertices[next]; // n for "next"

    // now we can use these two points (a line) to compare
    // to the other polygon's vertices using polyLine()
    let line: Line = { startPoint: vc, endPoint: vn };
    let collision = polyLine(polygon2, line);
    if (collision) return true;

    // optional: check if the 2nd polygon is INSIDE the first
    collision = polyPoint(polygon1, polygon2.vertices[0]);
    if (collision) return true;
  }

  return false;
}
