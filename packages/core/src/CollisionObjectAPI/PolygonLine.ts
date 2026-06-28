import { lineLine } from "./LineLine";
import { Polygon, Line } from '../types';

/**
 * Test whether a line segment crosses any edge of a polygon.
 *
 * Walks each polygon edge and runs a segment-vs-segment intersection test
 * against `line`.
 *
 * This checks edge crossings only. A line segment fully contained inside the
 * polygon, with no boundary intersection, returns `false`.
 *
 * @param polygon - The polygon (`vertices`).
 * @param line - The line segment (`startPoint`, `endPoint`).
 * @returns `true` if the line crosses a polygon edge.
 * @example
 * polygonLine({ vertices: square }, { startPoint: { x: -5, y: 5 }, endPoint: { x: 15, y: 5 } }); // => true
 */
export function polygonLine(polygon: Polygon, line: Line): boolean {
  const { vertices } = polygon;

  for (let current = 0; current < vertices.length; current++) {
    const startPoint = vertices[current];
    const endPoint = vertices[(current + 1) % vertices.length];
    const edge: Line = { startPoint, endPoint };

    if (lineLine(line, edge).hit) {
      return true;
    }
  }

  return false;
}
