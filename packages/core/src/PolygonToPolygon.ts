import { Point } from './types';
import { polygonPolygon } from './CollisionObjectAPI/PolygonPolygon';

/**
 * Test whether two polygons overlap.
 *
 * This flat form takes two raw vertex arrays and delegates to the canonical
 * {@link polygonPolygon}, which is complete: it checks edge crossings *and* both
 * containment directions. (An earlier version tested vertices only and silently
 * missed edge-only overlaps — two rotated squares crossing in an "X" with no
 * contained vertex. That gap is gone.)
 *
 * For new code the **recommended** shape is {@link polygonPolygon} itself
 * (`polygonPolygon({ vertices }, { vertices })`); this wrapper exists for callers
 * that already hold bare point arrays.
 *
 * @param poly1 - First polygon as an array of points.
 * @param poly2 - Second polygon as an array of points.
 * @returns `true` if the polygons intersect or one contains the other.
 * @example
 * polygonToPolygon(squareA, squareB); // => true when they overlap
 */
export function polygonToPolygon(poly1: Point[], poly2: Point[]): boolean {
  return polygonPolygon({ vertices: poly1 }, { vertices: poly2 });
}
