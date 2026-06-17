export function lineToPoint(x1: any, y1: any, x2: any, y2: any, px: any, py: any, threshold: any) {
  let dx = x2 - x1, dy = y2 - y1;
  let t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
  let lx = x1 + t * dx, ly = y1 + t * dy;
  let ddx = px - lx, ddy = py - ly;
  return ddx * ddx + ddy * ddy <= threshold * threshold;
}
