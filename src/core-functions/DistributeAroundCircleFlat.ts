export function distributeAroundCircle(cx: any, cy: any, r: any, n: any) {
  let points = [];
  for (let i = 0; i < n; i++) {
    let angle = (i / n) * Math.PI * 2;
    points.push({x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle)});
  }
  return points;
}
