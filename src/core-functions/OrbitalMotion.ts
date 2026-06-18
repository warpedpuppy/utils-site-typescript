export function gravitationalStep(
  orbiter: { x: number; y: number; vx: number; vy: number },
  body: { x: number; y: number; mass: number }
) {
  let dx = body.x - orbiter.x, dy = body.y - orbiter.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let force = (0.5 * body.mass) / (dist * dist);
  orbiter.vx += (dx / dist) * force;
  orbiter.vy += (dy / dist) * force;
  orbiter.x += orbiter.vx;
  orbiter.y += orbiter.vy;
}
