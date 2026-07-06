// CodePen-only drawing snippets.
//
// These functions assume a global `ctx` (a 2D canvas context), which exists inside
// a CodePen pen but NOT in a normal module. They are embedded into pens via
// `.toString()`. They deliberately do NOT live in @utilspalooza/core, which is pure,
// framework-agnostic math with no canvas/global dependencies.
//
// NOTE: Ted plans to rewrite these to take `ctx` as an explicit parameter and then
// promote them back into @utilspalooza/core (the math is worth shipping). See the
// "Draw helpers to reinstate" reminder in .claude/CLAUDE.md.

declare var ctx: CanvasRenderingContext2D;

export function drawEquilateralTriangle(cx: number, cy: number, r: number): void {
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
