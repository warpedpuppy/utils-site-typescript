import { Circle } from "../../../../../types/shapes";
import { CollisionDetectionObject } from "../../../../../types/types";

export const CircleCircle: CollisionDetectionObject = {
  keyFunction: function CircleCircle(circle1: Circle, circle2: Circle) {
    let distX = circle1.x - circle2.x;
    let distY = circle1.y - circle2.y;
    let distance = Math.sqrt(distX * distX + distY * distY);
    return distance <= circle1.radius + circle2.radius;
  },
  dependencies: [],
  functionString: `
export function CircleCircle(circle1: Circle, circle2: Circle) {
  let distX = circle1.x - circle2.x;
  let distY = circle1.y - circle2.y;
  let distance = Math.sqrt(distX * distX + distY * distY);
  return distance <= circle1.radius + circle2.radius;
}
`,
};
