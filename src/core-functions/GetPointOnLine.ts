export function getPointOnLine(p1: any, p2: any, t: any) {
  const lerp = (a: any, b: any, t: any) => a + (b - a) * t;
  return {x: lerp(p1.x, p2.x, t), y: lerp(p1.y, p2.y, t)};
}
