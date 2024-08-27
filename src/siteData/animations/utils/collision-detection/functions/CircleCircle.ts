import { Circle } from "../../../../../types/shapes";
export function CircleCircle(circle1: Circle, circle2: Circle) {
  let distX = circle1.x - circle2.x;
  let distY = circle1.y - circle2.y;
  let distance = Math.sqrt(distX * distX + distY * distY);
  return distance <= circle1.radius + circle2.radius;
}

export const CircleCircleString = `
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
export function CircleCircle(circle1: Circle, circle2: Circle) {
  let distX = circle1.x - circle2.x;
  let distY = circle1.y - circle2.y;
  let distance = Math.sqrt(distX * distX + distY * distY);
  return distance <= circle1.radius + circle2.radius;
}
`;
