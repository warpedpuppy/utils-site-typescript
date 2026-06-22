export function distributeAroundCircle(cx: number, cy: number, r: number, n: number): { x: number; y: number }[] {
  let points = [];
  for (let i = 0; i < n; i++) {
    let angle = (i / n) * Math.PI * 2;
    points.push({x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle)});
  }
  return points;
}
