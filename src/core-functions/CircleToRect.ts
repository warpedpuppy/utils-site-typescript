export function circleToRect(cx: any, cy: any, cr: any, rx: any, ry: any, rw: any, rh: any) {
  let px = Math.max(rx, Math.min(cx, rx + rw));
  let py = Math.max(ry, Math.min(cy, ry + rh));
  let dx = cx - px, dy = cy - py;
  return dx * dx + dy * dy <= cr * cr;
}
