export function getTriangleData(p1: any, p2: any) {
  let dx = p2.x - p1.x, dy = p2.y - p1.y;
  return { dx, dy, distance: Math.sqrt(dx * dx + dy * dy) };
}
