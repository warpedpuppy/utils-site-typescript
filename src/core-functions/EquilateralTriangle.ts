import { Point } from '../types/shapes';

export function EquilateralTriangle(
  radius: number,
  centerPoint: Point,
  angle: number
) {
  let allRadiansInACircle = 2 * Math.PI;
  let point1 = {
    x: radius * Math.cos(angle) + centerPoint.x,
    y: radius * Math.sin(angle) + centerPoint.y,
  };
  let point2 = {
    x:
      radius * Math.cos(angle + (1 / 3) * allRadiansInACircle) +
      centerPoint.x,
    y:
      radius * Math.sin(angle + (1 / 3) * allRadiansInACircle) +
      centerPoint.y,
  };
  let point3 = {
    x:
      radius * Math.cos(angle + (2 / 3) * allRadiansInACircle) +
      centerPoint.x,
    y:
      radius * Math.sin(angle + (2 / 3) * allRadiansInACircle) +
      centerPoint.y,
  };
  return { point1, point2, point3 };
}
