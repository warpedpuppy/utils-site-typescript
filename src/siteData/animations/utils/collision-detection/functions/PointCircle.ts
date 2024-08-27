import { Point, Circle } from "../../../../../types/shapes";
export function PointCircle(point: Point, circle: Circle) {
  let distX = point.x - circle.x;
  let distY = point.y - circle.y;
  let distance = Math.sqrt(distX * distX + distY * distY);
  return distance <= circle.radius;
}
export const dependencies: string[] = [];
export const PointCircleString = `
function PointCircle(point: Point, circle: Circle) {
  let distX = point.x - circle.x;
  let distY = point.y - circle.y;
  let distance = Math.sqrt(distX * distX + distY * distY);
  return distance <= circle.radius;
}`;
