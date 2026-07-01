import { lineCircle } from "./LineCircle";
import { polygonPoint } from "./PolygonPoint";
import { Polygon, Circle, Line } from '../types';

/**
 * Test whether a circle overlaps a polygon.
 *
 * Walks each polygon edge and tests it against the circle. If no edge touches
 * the circle, it then checks whether the circle's center sits inside the polygon,
 * which catches the fully-contained case.
 *
 * @param polygon - The polygon (`vertices`).
 * @param circle - The circle (`x`, `y`, `radius`).
 * @returns `true` if the circle touches an edge or sits inside the polygon.
 * @example
 * polygonCircle({ vertices: square }, { x: 5, y: 5, radius: 2 }); // => true
 */
export function polygonCircle(polygon: Polygon, circle: Circle): boolean {
  const { vertices } = polygon;

  for (let current = 0; current < vertices.length; current++) {
    const startPoint = vertices[current];
    const endPoint = vertices[(current + 1) % vertices.length];
    const edge: Line = { startPoint, endPoint };

    if (lineCircle(edge, circle)) {
      return true;
    }
  }

  return polygonPoint(polygon, {
    x: circle.x,
    y: circle.y,
  });
}
