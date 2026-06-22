import { Point } from './types';
export function sphereLighting(
  sphere: { x: number; y: number; radius: number },
  lightSource: Point,
  highlightReach: number = 0.4
) {
  const angleToLight = Math.atan2(
    lightSource.y - sphere.y,
    lightSource.x - sphere.x
  );
  return {
    x: sphere.x + Math.cos(angleToLight) * sphere.radius * highlightReach,
    y: sphere.y + Math.sin(angleToLight) * sphere.radius * highlightReach,
  };
}
