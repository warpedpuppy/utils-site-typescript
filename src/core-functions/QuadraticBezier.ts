import { Point } from '../types/shapes';

export function QuadraticBezier(t: number, p0: Point, p1: Point, p2: Point) {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
  };
}
