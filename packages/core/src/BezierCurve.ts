import { Point } from './types';
export function bezierPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  let q0 = {x: lerp(p0.x, p1.x, t), y: lerp(p0.y, p1.y, t)};
  let q1 = {x: lerp(p1.x, p2.x, t), y: lerp(p1.y, p2.y, t)};
  let q2 = {x: lerp(p2.x, p3.x, t), y: lerp(p2.y, p3.y, t)};
  let r0 = {x: lerp(q0.x, q1.x, t), y: lerp(q0.y, q1.y, t)};
  let r1 = {x: lerp(q1.x, q2.x, t), y: lerp(q1.y, q2.y, t)};
  return {x: lerp(r0.x, r1.x, t), y: lerp(r0.y, r1.y, t)};
}
