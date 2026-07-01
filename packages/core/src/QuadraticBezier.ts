import { Point } from './types';

/**
 * Find the point at parameter `t` along a quadratic Bézier curve (one control point).
 *
 * Uses the closed-form quadratic Bézier formula
 * `(1-t)²·p0 + 2(1-t)t·p1 + t²·p2`.
 *
 * @param t - Position along the curve, 0–1.
 * @param p0 - Start anchor point (returned at `t = 0`).
 * @param p1 - The single control handle that bends the curve.
 * @param p2 - End anchor point (returned at `t = 1`).
 * @returns The `{ x, y }` point on the curve at `t`.
 * @example
 * quadraticBezier(0.5, {x:0,y:0}, {x:50,y:100}, {x:100,y:0}); // => { x: 50, y: 50 }
 */
export function quadraticBezier(t: number, p0: Point, p1: Point, p2: Point): Point {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
  };
}
