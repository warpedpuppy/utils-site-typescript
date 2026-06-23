import { polygonPoint } from "./PolygonPoint";
import { polygonLine } from "./PolygonLine";
import { Polygon, Line } from '../types';

/**
 * Test whether two polygons overlap (object-argument form).
 *
 * Walks each edge of the first polygon and tests it against the second, then also
 * checks whether one polygon is fully contained in the other.
 *
 * @param polygon1 - First polygon (`vertices`).
 * @param polygon2 - Second polygon (`vertices`).
 * @returns `true` if the polygons intersect or one contains the other.
 * @example
 * polygonPolygon({ vertices: squareA }, { vertices: squareB }); // => true when overlapping
 */
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
