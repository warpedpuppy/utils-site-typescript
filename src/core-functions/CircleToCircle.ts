export function circleToCircle(
  x1: any,
  y1: any,
  r1: any,
  x2: any,
  y2: any,
  r2: any,
) {
  let dx = x2 - x1,
    dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy) <= r1 + r2;
}
