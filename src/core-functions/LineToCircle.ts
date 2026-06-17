export function lineToCircle(x1: any, y1: any, x2: any, y2: any, cx: any, cy: any, cr: any) {
  let dx = x2 - x1, dy = y2 - y1;
  let t = Math.max(0, Math.min(1, ((cx - x1) * dx + (cy - y1) * dy) / (dx * dx + dy * dy)));
  let px = x1 + t * dx, py = y1 + t * dy;
  let ddx = cx - px, ddy = cy - py;
  return ddx * ddx + ddy * ddy <= cr * cr;
}
