import { Point } from './types';
/**
 * Find where the specular highlight sits on a 2D sphere, given a light source.
 *
 * Points from the sphere's center toward the light and walks part of the way out
 * along the radius — a cheap way to fake a 3D-lit highlight on a flat circle.
 *
 * @param sphere - The sphere's center and radius.
 * @param lightSource - Position of the light.
 * @param highlightReach - How far toward the edge the highlight sits, 0–1. Defaults to `0.4`.
 * @returns The `{ x, y }` position to draw the highlight.
 * @example
 * const hi = sphereLighting({ x: 100, y: 100, radius: 40 }, { x: 0, y: 0 });
 */
export function sphereLighting(
  sphere: { x: number; y: number; radius: number },
  lightSource: Point,
  highlightReach: number = 0.4
): Point {
  const angleToLight = Math.atan2(
    lightSource.y - sphere.y,
    lightSource.x - sphere.x
  );
  return {
    x: sphere.x + Math.cos(angleToLight) * sphere.radius * highlightReach,
    y: sphere.y + Math.sin(angleToLight) * sphere.radius * highlightReach,
  };
}
