import { Point } from './types';
import { deCasteljau } from './DeCasteljau';

/**
 * Find the point at parameter `t` along a cubic Bézier curve.
 *
 * Implemented via de Casteljau's algorithm — repeated linear interpolation between
 * the control points, which is the geometric definition of a Bézier curve.
 *
 * @param p0 - Start anchor point (returned at `t = 0`).
 * @param p1 - First control handle.
 * @param p2 - Second control handle.
 * @param p3 - End anchor point (returned at `t = 1`).
 * @param t - Position along the curve, 0–1.
 * @returns The `{ x, y }` point on the curve at `t`.
 * @example
 * bezierPoint({x:0,y:0}, {x:0,y:50}, {x:50,y:50}, {x:50,y:0}, 0.5);
 */
export function bezierPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  return deCasteljau([p0, p1, p2, p3], t).point;
}
