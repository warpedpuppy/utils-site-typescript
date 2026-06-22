export function lineToPoint(x1: number, y1: number, x2: number, y2: number, px: number, py: number, threshold: number): boolean {
  let dx = x2 - x1, dy = y2 - y1;
  let t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
  let lx = x1 + t * dx, ly = y1 + t * dy;
  let ddx = px - lx, ddy = py - ly;
  return ddx * ddx + ddy * ddy <= threshold * threshold;
}
