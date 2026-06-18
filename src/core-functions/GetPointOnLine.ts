import { Point } from '../types/shapes';

export function getPointOnLine(p1: Point, p2: Point, t: number) {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  return {x: lerp(p1.x, p2.x, t), y: lerp(p1.y, p2.y, t)};
}
