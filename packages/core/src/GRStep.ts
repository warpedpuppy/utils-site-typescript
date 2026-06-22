export function grStep(orbiter: { x: number; y: number; vx: number; vy: number }, sun: { x: number; y: number; mass: number }, grStrength: number): void {
  let dx = sun.x - orbiter.x, dy = sun.y - orbiter.y;
  let r = Math.sqrt(dx*dx + dy*dy);
  let force = (0.5 * sun.mass / (r * r)) * (1 + grStrength / (r * r));
  orbiter.vx += (dx / r) * force;
  orbiter.vy += (dy / r) * force;
  orbiter.x += orbiter.vx;
  orbiter.y += orbiter.vy;
}
