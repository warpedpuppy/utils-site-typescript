import { Point } from './types';

/**
 * Evaluate any-degree Bézier curve at parameter `t` using de Casteljau's algorithm.
 *
 * De Casteljau works by repeatedly lerping between adjacent control points until
 * a single point remains. At each level of reduction you get the intermediate
 * "construction" points that make the algorithm visual — pass the returned `levels`
 * array to your canvas code to draw the animated hull the way a textbook would.
 * Works for quadratic (3 pts), cubic (4 pts), quartic (5 pts), or any degree.
 *
 * @param points - The ordered control points defining the curve (any length >= 2).
 * @param t - Position along the curve, 0–1 (0 = start, 1 = end).
 * @returns An object `{ point, levels }` where `point` is the `{ x, y }` on the
 *   curve at `t`, and `levels` is an array of point arrays — `levels[0]` is the
 *   original control polygon, each subsequent level is the next reduction step,
 *   and the last level contains only `point`.
 * @example
 * deCasteljau([{x:0,y:0},{x:0,y:50},{x:50,y:50},{x:50,y:0}], 0.5).point;
 */
export function deCasteljau(points: Point[], t: number): { point: Point; levels: Point[][] } {
  const levels: Point[][] = [points.map((p) => ({ ...p }))];
  let current = points.map((p) => ({ ...p }));

  while (current.length > 1) {
    const next: Point[] = [];
    for (let i = 0; i < current.length - 1; i++) {
      next.push({
        x: (1 - t) * current[i].x + t * current[i + 1].x,
        y: (1 - t) * current[i].y + t * current[i + 1].y,
      });
    }
    levels.push(next);
    current = next;
  }
  return { point: current[0], levels };
}
