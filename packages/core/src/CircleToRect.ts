export function circleToRect(cx: number, cy: number, cr: number, rx: number, ry: number, rw: number, rh: number): boolean {
  let px = Math.max(rx, Math.min(cx, rx + rw));
  let py = Math.max(ry, Math.min(cy, ry + rh));
  let dx = cx - px, dy = cy - py;
  return dx * dx + dy * dy <= cr * cr;
}
