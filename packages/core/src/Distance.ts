export function distance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  let dx = p2.x - p1.x, dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}
