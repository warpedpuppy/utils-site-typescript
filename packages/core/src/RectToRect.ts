/**
 * Test whether two axis-aligned rectangles overlap (AABB collision).
 *
 * @param x1 - First rect left edge.
 * @param y1 - First rect top edge.
 * @param w1 - First rect width.
 * @param h1 - First rect height.
 * @param x2 - Second rect left edge.
 * @param y2 - Second rect top edge.
 * @param w2 - Second rect width.
 * @param h2 - Second rect height.
 * @returns `true` if the two rectangles overlap.
 * @example
 * rectToRect(0, 0, 10, 10, 5, 5, 10, 10); // => true
 */
export function rectToRect(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number): boolean {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}
