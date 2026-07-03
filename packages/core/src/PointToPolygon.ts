import { Point } from './types';

/**
 * Test whether a point falls inside a polygon (ray-casting / even-odd rule).
 *
 * Casts a horizontal ray from the point and counts how many polygon edges it
 * crosses — an odd count means the point is inside. Works for both convex and
 * concave polygons.
 *
 * @param px - Point x.
 * @param py - Point y.
 * @param vertices - The polygon vertices, in order.
 * @returns `true` if the point lies inside the polygon.
 * @remarks
 * Takes loose `px, py` plus a raw vertex array. For new code the **recommended** shape is
 * the object-argument {@link polygonPoint} (`polygonPoint({ vertices }, { x, y })`), which
 * runs the identical ray-cast.
 * @example
 * const square = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }];
 * pointToPolygon(5, 5, square); // => true
 * pointToPolygon(20, 20, square); // => false
 */
export function pointToPolygon(px: number, py: number, vertices: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i].x, yi = vertices[i].y;
    const xj = vertices[j].x, yj = vertices[j].y;
    if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}
