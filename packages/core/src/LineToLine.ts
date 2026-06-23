/**
 * Test whether two line segments cross.
 *
 * @param x1 - First segment start x.
 * @param y1 - First segment start y.
 * @param x2 - First segment end x.
 * @param y2 - First segment end y.
 * @param x3 - Second segment start x.
 * @param y3 - Second segment start y.
 * @param x4 - Second segment end x.
 * @param y4 - Second segment end y.
 * @returns `true` if the two segments intersect (parallel segments return `false`).
 * @example
 * lineToLine(0, 0, 10, 10, 0, 10, 10, 0); // => true (an X)
 */
export function lineToLine(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): boolean {
  let denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denom) < 0.0001) return false;
  let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}
