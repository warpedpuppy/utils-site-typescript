import { polygonPoint } from "./PolygonPoint";
import { polygonLine } from "./PolygonLine";
import { Polygon, Line } from '../types';

/**
 * Test whether two polygons overlap (object-argument form).
 *
 * Walks each edge of the first polygon and tests it against the second. If no
 * edges cross, it then checks both containment directions by testing a sample
 * vertex from each polygon against the other polygon.
 *
 * @param polygon1 - First polygon (`vertices`).
 * @param polygon2 - Second polygon (`vertices`).
 * @returns `true` if the polygons intersect or one contains the other.
 * @remarks
 * This is the **canonical, complete** polygon-overlap test. The flat {@link polygonToPolygon}
 * (bare vertex arrays) delegates here, so both catch edge-only crossings, not just
 * contained vertices.
 * @example
 * polygonPolygon({ vertices: squareA }, { vertices: squareB }); // => true when overlapping
 */
export function polygonPolygon(polygon1: Polygon, polygon2: Polygon): boolean {
  const { vertices } = polygon1;

  for (let current = 0; current < vertices.length; current++) {
    const startPoint = vertices[current];
    const endPoint = vertices[(current + 1) % vertices.length];
    const edge: Line = { startPoint, endPoint };

    if (polygonLine(polygon2, edge)) {
      return true;
    }
  }

  return polygonPoint(polygon1, polygon2.vertices[0]) || polygonPoint(polygon2, polygon1.vertices[0]);
}
