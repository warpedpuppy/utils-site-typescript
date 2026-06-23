import { Point } from './types';

/**
 * Compute the three vertices of an equilateral triangle inscribed in a circle.
 *
 * @param radius - Distance from the center to each vertex (the circumradius).
 * @param centerPoint - Center of the triangle.
 * @param angle - Rotation in radians; `point1` sits at this angle, the others 120° apart.
 * @returns The three corners as `{ point1, point2, point3 }`.
 * @example
 * equilateralTriangle(5, { x: 0, y: 0 }, 0); // point1 at { x: 5, y: 0 }
 */
export function equilateralTriangle(
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
