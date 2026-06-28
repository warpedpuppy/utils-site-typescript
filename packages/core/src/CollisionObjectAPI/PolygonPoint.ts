import { Polygon, Point } from '../types';

/**
 * Test whether a point is inside a polygon (ray-casting / even-odd rule).
 *
 * Casts a horizontal ray from the point and counts how many polygon edges it
 * crosses — an odd count means the point is inside. Works for both convex and
 * concave polygons.
 *
 * Boundary points are not special-cased. A point on an edge or vertex follows
 * the raw parity result from the ray test, so edge cases may differ depending
 * on which boundary segment is hit.
 *
 * @param polygon - The polygon (`vertices`).
 * @param point - The point to test.
 * @returns `true` if the point is inside the polygon.
 * @example
 * polygonPoint({ vertices: square }, { x: 5, y: 5 }); // => true
 */
export function polygonPoint(polygon: Polygon, point: Point): boolean {
  const { vertices } = polygon;
  let inside = false;

  for (let current = 0, previous = vertices.length - 1; current < vertices.length; previous = current++) {
    const { x: currentX, y: currentY } = vertices[current];
    const { x: previousX, y: previousY } = vertices[previous];

    if (
      (currentY > point.y) !== (previousY > point.y) &&
      point.x < ((previousX - currentX) * (point.y - currentY)) / (previousY - currentY) + currentX
    ) {
      inside = !inside;
    }
  }

  return inside;
}
