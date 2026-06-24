/**
 * Advance an orbiting body one frame under Newtonian gravity (inverse-square attraction).
 *
 * Each step pulls the orbiter toward the central body with a force proportional to
 * `mass / r²`, then integrates velocity and position — enough to produce stable
 * orbits. **Mutates `orbiter`** in place.
 *
 * @param orbiter - The orbiting body (its `x`, `y`, `vx`, `vy` are mutated).
 * @param body - The central mass being orbited.
 * @returns Nothing — `orbiter` is updated in place.
 * @example
 * gravitationalStep(planet, sun); // call once per frame
 */
export function gravitationalStep(
  orbiter: { x: number; y: number; vx: number; vy: number },
  body: { x: number; y: number; mass: number }
): void {
  let dx = body.x - orbiter.x, dy = body.y - orbiter.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let force = (0.5 * body.mass) / (dist * dist);
  orbiter.vx += (dx / dist) * force;
  orbiter.vy += (dy / dist) * force;
  orbiter.x += orbiter.vx;
  orbiter.y += orbiter.vy;
}
