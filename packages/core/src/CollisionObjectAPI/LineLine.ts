import { Line } from '../types';

/**
 * Test whether two line segments cross, and report where (object-argument form).
 *
 * Unlike the boolean `lineToLine`, this returns the intersection coordinates when
 * the segments meet — useful for drawing a marker at the crossing.
 *
 * @param line1 - First segment (`startPoint`, `endPoint`).
 * @param line2 - Second segment (`startPoint`, `endPoint`).
 * @returns `{ hit: true, intersectionX, intersectionY }` if they cross, else `{ hit: false }`.
 * @example
 * const r = lineLine(a, b);
 * if (r.hit) drawDot(r.intersectionX, r.intersectionY);
 */
export function lineLine(line1: Line, line2: Line) {
  let uA =
    ((line2.endPoint.x - line2.startPoint.x) *
      (line1.startPoint.y - line2.startPoint.y) -
      (line2.endPoint.y - line2.startPoint.y) *
        (line1.startPoint.x - line2.startPoint.x)) /
    ((line2.endPoint.y - line2.startPoint.y) *
      (line1.endPoint.x - line1.startPoint.x) -
      (line2.endPoint.x - line2.startPoint.x) *
        (line1.endPoint.y - line1.startPoint.y));
  let uB =
    ((line1.endPoint.x - line1.startPoint.x) *
      (line1.startPoint.y - line2.startPoint.y) -
      (line1.endPoint.y - line1.startPoint.y) *
        (line1.startPoint.x - line2.startPoint.x)) /
    ((line2.endPoint.y - line2.startPoint.y) *
      (line1.endPoint.x - line1.startPoint.x) -
      (line2.endPoint.x - line2.startPoint.x) *
        (line1.endPoint.y - line1.startPoint.y));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    // optionally, draw a circle where the lines meet
    let intersectionX =
      line1.startPoint.x + uA * (line1.endPoint.x - line1.startPoint.x);
    let intersectionY =
      line1.startPoint.y + uA * (line1.endPoint.y - line1.startPoint.y);
    return {
      hit: true,
      intersectionX,
      intersectionY,
    };
  }
  return { hit: false };
}
