declare var ctx: any;

export function drawRectWithTrig(cx: any, cy: any, w: any, h: any, angle: any) {
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
