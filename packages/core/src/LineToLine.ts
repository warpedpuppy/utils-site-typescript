/**
 * Test whether two line segments cross.
 *
 * Parallel or collinear segments return `false` in this implementation.
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
 * @remarks
 * Flat, eight-number form that answers only "do they cross?" If you also need *where*
 * they cross, use the object-argument {@link lineLine}, which returns
 * `{ hit, intersectionX, intersectionY }`.
 * @example
 * lineToLine(0, 0, 10, 10, 0, 10, 10, 0); // => true (an X)
 */
export function lineToLine(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): boolean {
  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denominator) < 0.0001) return false;

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}
