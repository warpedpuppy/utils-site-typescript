import { Line } from '../types';

/**
 * Test whether two line segments cross, and report where (object-argument form).
 *
 * Unlike the boolean `lineToLine`, this returns the intersection coordinates when
 * the segments meet — useful for drawing a marker at the crossing.
 *
 * Parallel or collinear segments return `{ hit: false }` in this implementation.
 *
 * @param line1 - First segment (`startPoint`, `endPoint`).
 * @param line2 - Second segment (`startPoint`, `endPoint`).
 * @returns `{ hit: true, intersectionX, intersectionY }` if they cross, else `{ hit: false }`.
 * @example
 * const r = lineLine(a, b);
 * if (r.hit) drawDot(r.intersectionX, r.intersectionY);
 */
export function lineLine(line1: Line, line2: Line) {
  const denominator =
    (line2.endPoint.y - line2.startPoint.y) * (line1.endPoint.x - line1.startPoint.x) -
    (line2.endPoint.x - line2.startPoint.x) * (line1.endPoint.y - line1.startPoint.y);

  if (Math.abs(denominator) < 0.0001) {
    return { hit: false } as const;
  }

  const uA =
    ((line2.endPoint.x - line2.startPoint.x) * (line1.startPoint.y - line2.startPoint.y) -
      (line2.endPoint.y - line2.startPoint.y) * (line1.startPoint.x - line2.startPoint.x)) /
    denominator;
  const uB =
    ((line1.endPoint.x - line1.startPoint.x) * (line1.startPoint.y - line2.startPoint.y) -
      (line1.endPoint.y - line1.startPoint.y) * (line1.startPoint.x - line2.startPoint.x)) /
    denominator;

  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    const intersectionX = line1.startPoint.x + uA * (line1.endPoint.x - line1.startPoint.x);
    const intersectionY = line1.startPoint.y + uA * (line1.endPoint.y - line1.startPoint.y);

    return {
      hit: true,
      intersectionX,
      intersectionY,
    };
  }
  return { hit: false };
}
