import { Point, Circle } from "../../../../../types/shapes";
export function PointCircle(point: Point, circle: Circle) {
  let distX = point.x - circle.x;
  let distY = point.y - circle.y;
  let distance = Math.sqrt(distX * distX + distY * distY);
  return distance <= circle.radius;
}
export const PointCircleString = `
interface Point {
  x: number;
  y: number;
}
interface Circle extends ShapeInMotion {
  x: number;
  y: number;
  radius: number;
}
interface ShapeInMotion {
  vx: number;
  vy: number;
  id: string;
}
function PointCircle(point: Point, circle: Circle) {
  let distX = point.x - circle.x;
  let distY = point.y - circle.y;
  let distance = Math.sqrt(distX * distX + distY * distY);
  return distance <= circle.radius;
}`;
