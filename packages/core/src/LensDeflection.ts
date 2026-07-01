/**
 * Approximate how far a light ray is bent as it passes a massive object (gravitational lensing).
 *
 * A simplified model of Einstein's light-bending: the deflection grows with the
 * lens `mass` and falls off with distance from it (the impact parameter `b`),
 * which is why objects behind a galaxy appear warped into arcs.
 *
 * @param x - The ray's current horizontal position.
 * @param y0 - The ray's undeflected vertical position.
 * @param lx - Lens (mass) center x.
 * @param ly - Lens (mass) center y.
 * @param mass - Mass of the lensing object; larger bends light more.
 * @returns The vertical deflection to apply at this `x` (0 when far from the lens).
 * @example
 * const dy = lensDeflection(rayX, rayY, lensX, lensY, 2000);
 */
export function lensDeflection(x: number, y0: number, lx: number, ly: number, mass: number): number {
  let b = Math.abs(y0 - ly);
  if (b === 0 || x <= lx - 100 || x >= lx + 100) return 0;
  let r = Math.sqrt((x - lx) * (x - lx) + b * b);
  return r > 5 ? mass / (r * b) * 0.5 : 0;
}
