/**
 * Advance an orbiting body one frame under gravity with a general-relativity correction.
 *
 * Like Newtonian gravity but with an extra `1 + grStrength/r²` term that strengthens
 * the pull at close range — this is what makes orbits *precess* (the famous anomaly
 * in Mercury's orbit). **Mutates `orbiter`** in place.
 *
 * @param orbiter - The orbiting body (its `x`, `y`, `vx`, `vy` are mutated).
 * @param sun - The central mass being orbited.
 * @param grStrength - Strength of the relativistic correction; `0` reduces to Newtonian gravity.
 * @returns Nothing — `orbiter` is updated in place.
 * @example
 * grStep(planet, sun, 800); // call once per frame to see the orbit precess
 */
export function grStep(orbiter: { x: number; y: number; vx: number; vy: number }, sun: { x: number; y: number; mass: number }, grStrength: number): void {
  let dx = sun.x - orbiter.x, dy = sun.y - orbiter.y;
  let r = Math.sqrt(dx*dx + dy*dy);
  let force = (0.5 * sun.mass / (r * r)) * (1 + grStrength / (r * r));
  orbiter.vx += (dx / r) * force;
  orbiter.vy += (dy / r) * force;
  orbiter.x += orbiter.vx;
  orbiter.y += orbiter.vy;
}
