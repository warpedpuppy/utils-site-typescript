import { Point, Circle } from "../../../../types/shapes";
import { CollisionDetectionObject } from "../../../../types/types";
import { PointCircle as PointCircleImported } from "../../../../core-functions/CollisionObjectAPI/PointCircle";

export const PointCircle: CollisionDetectionObject = {
  keyFunction: PointCircleImported,
  dependencies: [],
  functionString: `
function PointCircle(point: Point, circle: Circle) {
  let distX = point.x - circle.x;
  let distY = point.y - circle.y;
  let distance = Math.sqrt(distX * distX + distY * distY);
  return distance <= circle.radius;
}`,
};
