import { Polygon, Point } from '../types';

/**
 * Test whether a point is inside a polygon (ray-casting / even-odd rule).
 *
 * Casts a ray and counts edge crossings — an odd count means the point is inside.
 * Works for convex and concave polygons alike.
 *
 * @param polygon - The polygon (`vertices`).
 * @param point - The point to test.
 * @returns `true` if the point is inside the polygon.
 * @example
 * polygonPoint({ vertices: square }, { x: 5, y: 5 }); // => true
 */
export function polygonPoint(polygon: Polygon, point: Point) {
  let collision = false;

  // go through each of the vertices, plus the next
  // vertex in the list
  let next = 0;
  const { vertices } = polygon;
  // console.log(vertices, point);
  for (let current = 0; current < vertices.length; current++) {
    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current + 1;
    if (next === vertices.length) next = 0;

    // get the PVectors at our current position
    // this makes our if statement a little cleaner
    let vc = vertices[current]; // c for "current"
    let vn = vertices[next]; // n for "next"

    // compare position, flip 'collision' variable
    // back and forth
    if (
      ((vc.y > point.y && vn.y < point.y) ||
        (vc.y < point.y && vn.y > point.y)) &&
      point.x < ((vn.x - vc.x) * (point.y - vc.y)) / (vn.y - vc.y) + vc.x
    ) {
      collision = !collision;
    }
  }

  return collision;
}
