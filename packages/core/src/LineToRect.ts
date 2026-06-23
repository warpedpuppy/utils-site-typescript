/**
 * Test whether a line segment crosses any edge of an axis-aligned rectangle.
 *
 * Note: this checks the four edges only — a segment lying entirely *inside* the
 * rectangle is not reported as a hit.
 *
 * @param x1 - Segment start x.
 * @param y1 - Segment start y.
 * @param x2 - Segment end x.
 * @param y2 - Segment end y.
 * @param rx - Rectangle left edge.
 * @param ry - Rectangle top edge.
 * @param rw - Rectangle width.
 * @param rh - Rectangle height.
 * @returns `true` if the segment crosses a rectangle edge.
 * @example
 * lineToRect(-5, 5, 15, 5, 0, 0, 10, 10); // => true
 */
export function lineToRect(x1: number, y1: number, x2: number, y2: number, rx: number, ry: number, rw: number, rh: number): boolean {
  let lines = [
    [rx, ry, rx + rw, ry],
    [rx + rw, ry, rx + rw, ry + rh],
    [rx + rw, ry + rh, rx, ry + rh],
    [rx, ry + rh, rx, ry]
  ];
  for (let [x3, y3, x4, y4] of lines) {
    let denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) > 0.0001) {
      let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
      let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
      if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return true;
    }
  }
  return false;
}
