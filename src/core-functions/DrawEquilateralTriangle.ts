declare var ctx: any;

export function drawEquilateralTriangle(cx: any, cy: any, r: any) {
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    let angle = (i * 120 * Math.PI / 180) - Math.PI / 2;
    let x = cx + r * Math.cos(angle);
    let y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}
