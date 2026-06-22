declare var ctx: any;

export function drawRectWithTrig(cx: number, cy: number, w: number, h: number, angle: number): void {
  let corners = [
    {x: -w/2, y: -h/2},
    {x: w/2, y: -h/2},
    {x: w/2, y: h/2},
    {x: -w/2, y: h/2}
  ];

  ctx.beginPath();
  for (let i = 0; i < corners.length; i++) {
    let c = corners[i];
    let x = c.x * Math.cos(angle) - c.y * Math.sin(angle) + cx;
    let y = c.x * Math.sin(angle) + c.y * Math.cos(angle) + cy;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}
