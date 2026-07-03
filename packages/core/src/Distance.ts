import { Point } from './types';
/**
 * Euclidean (straight-line) distance between two points.
 *
 * @param p1 - First point.
 * @param p2 - Second point.
 * @returns The distance between `p1` and `p2`.
 * @remarks
 * This is the canonical point-to-point distance. The same Euclidean length shows up in
 * two other shapes across the library: {@link lineLength} (a `{ startPoint, endPoint }`
 * segment) and `vecMagnitude(vecSubtract(a, b))` (the vector idiom). All three compute
 * `√(Δx² + Δy²)` via `Math.hypot`; reach for the one whose argument shape you already have.
 * @example
 * distance({ x: 0, y: 0 }, { x: 3, y: 4 }); // => 5
 */
export function distance(p1: Point, p2: Point): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}
