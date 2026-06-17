declare var ctx: any;

export function drawStar(cx: any, cy: any, outer: any, inner: any, points: any) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    let r = i % 2 === 0 ? outer : inner;
    let angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    let x = cx + r * Math.cos(angle);
    let y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}
