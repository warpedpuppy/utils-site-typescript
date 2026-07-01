/**
 * Get the point on a circle at a given angle, along with the raw cosine/sine.
 *
 * Returning `cos`/`sin` too saves the caller recomputing them (e.g. to orient
 * something tangent to the circle).
 *
 * @param cx - Circle center x.
 * @param cy - Circle center y.
 * @param radius - Circle radius.
 * @param time - Angle in radians (named `time` since it's usually driven by a clock).
 * @returns `{ x, y, cos, sin }` — the point and the trig components used to find it.
 * @example
 * unitCirclePoint(100, 100, 50, 0); // => { x: 150, y: 100, cos: 1, sin: 0 }
 */
export function unitCirclePoint(cx: number, cy: number, radius: number, time: number): { x: number; y: number; cos: number; sin: number } {
  let cos = Math.cos(time), sin = Math.sin(time);
  return { x: cx + radius * cos, y: cy + radius * sin, cos, sin };
}
