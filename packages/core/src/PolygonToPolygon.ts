import { Point } from './types';
function pointInPolygon(x: number, y: number, poly: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    let xi = poly[i].x, yi = poly[i].y;
    let xj = poly[j].x, yj = poly[j].y;
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * Test whether two polygons overlap, by checking if either has a vertex inside the other.
 *
 * Uses ray-casting (the point-in-polygon test) on each polygon's vertices. This
 * catches most overlaps but can miss edge-only crossings where no vertex is contained.
 *
 * @param poly1 - First polygon as an array of points.
 * @param poly2 - Second polygon as an array of points.
 * @returns `true` if a vertex of either polygon lies inside the other.
 * @example
 * polygonToPolygon(squareA, squareB); // => true when they overlap
 */
export function polygonToPolygon(poly1: Point[], poly2: Point[]): boolean {
  for (let p of poly1) if (pointInPolygon(p.x, p.y, poly2)) return true;
  for (let p of poly2) if (pointInPolygon(p.x, p.y, poly1)) return true;
  return false;
}
