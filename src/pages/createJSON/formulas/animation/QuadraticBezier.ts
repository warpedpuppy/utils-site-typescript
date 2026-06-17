import { Point } from "../../../../types/shapes";
import { CollisionDetectionObject } from "../../../../types/types";

export const QuadraticBezier: CollisionDetectionObject = {
  // Returns the point on the curve at parameter t (0 = P0, 1 = P2).
  // P1 is the single control point that "pulls" the curve off the straight line.
  keyFunction: function QuadraticBezier(t: number, p0: Point, p1: Point, p2: Point): Point {
    const mt = 1 - t;
    return {
      x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
      y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
    };
  },
  dependencies: [],
  interfaces: ["Point"],
  functionString: `
  // P0 = start, P1 = control point, P2 = end.
  // t ranges from 0 (at P0) to 1 (at P2).
  // Sample many values of t and connect the results to draw the curve.

  function QuadraticBezier(
    t: number, p0: Point, p1: Point, p2: Point
  ): Point {
    const mt = 1 - t;
    return {
      x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
      y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
    };
  }`,
};
