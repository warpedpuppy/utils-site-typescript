export function pointToCircle(px: number, py: number, cx: number, cy: number, radius: number): boolean {
  let dx = px - cx, dy = py - cy;
  return Math.sqrt(dx * dx + dy * dy) <= radius;
}
