import { polygonPoint } from "./PolygonPoint";
import { polygonLine } from "./PolygonLine";
import { Polygon, Line } from '../types';

export function polygonPolygon(polygon1: Polygon, polygon2: Polygon) {
  let next = 0;
  const { vertices } = polygon1;
  for (let current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next === vertices.length) next = 0;

    let startPoint = vertices[current];
    let endPoint = vertices[next];

    // now we can use these two points (a line) to compare
    // to the other polygon's vertices using polyLine()

    let line: Line = { startPoint, endPoint };

    let collision = polygonLine(polygon2, line);
    if (collision) return true;

    // optional: check if the 2nd polygon is INSIDE the first
    collision = polygonPoint(polygon1, polygon2.vertices[0]);
    if (collision) return true;
  }

  return false;
}
