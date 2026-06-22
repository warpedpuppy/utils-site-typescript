export function circleToCircle(
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number,
): boolean {
  let dx = x2 - x1,
    dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy) <= r1 + r2;
}
