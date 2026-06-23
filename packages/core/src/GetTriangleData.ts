import { lineLength } from "./LineLength";
import { Point } from './types';

/**
 * Get the horizontal/vertical deltas and distance between two points.
 *
 * @param p1 - First point.
 * @param p2 - Second point.
 * @returns `{ dx, dy, distance }` — the run, the rise, and the hypotenuse.
 * @example
 * getTriangleData({ x: 0, y: 0 }, { x: 3, y: 4 }); // => { dx: 3, dy: 4, distance: 5 }
 */
export function getTriangleData(p1: Point, p2: Point) {
  let dx = p2.x - p1.x, dy = p2.y - p1.y;
  return { dx, dy, distance: Math.sqrt(dx * dx + dy * dy) };
}

/**
 * Solve the right triangle formed by a line and its horizontal/vertical legs.
 *
 * Treats the line as the hypotenuse and derives the side lengths and angles via
 * basic SOH-CAH-TOA trigonometry.
 *
 * @param startPoint - One end of the line.
 * @param endPoint - The other end of the line.
 * @returns `{ angleInDegrees, remainingAngle, hypotenuse, adjacent, opposite }`.
 * @example
 * triangleDataFromLine({ x: 0, y: 0 }, { x: 4, y: 3 });
 * // => { angleInDegrees: 36, remainingAngle: 54, hypotenuse: 5, adjacent: 4, opposite: 3 }
 */
export function triangleDataFromLine(startPoint: Point, endPoint: Point) {
  let hypotenuse = lineLength({ startPoint, endPoint });
  let adjacent = lineLength({
    startPoint,
    endPoint: {
      x: endPoint.x,
      y: startPoint.y,
    },
  });
  let opposite = lineLength({
    startPoint: {
      x: endPoint.x,
      y: startPoint.y,
    },
    endPoint,
  });

  let oh = opposite / hypotenuse;
  let angle1 = Math.asin(oh);
  let angleInDegrees = Math.floor(angle1 * (180 / Math.PI));
  let remainingAngle = 180 - angleInDegrees - 90;

  return { angleInDegrees, remainingAngle, hypotenuse, adjacent, opposite };
}
