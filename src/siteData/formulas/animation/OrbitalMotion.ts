import { CollisionDetectionObject } from "../../../types/types";
import { Point } from "../../../types/shapes";

/**
 * Given a sphere and a light source, returns the position of the gradient
 * highlight — the bright inner point of a radial gradient — so the lit face
 * of the sphere always faces the light.
 *
 * highlightReach: 0–1, how far toward the light source the highlight moves
 * (0 = stays at sphere center, 1 = sits on the rim). 0.4 is a natural default.
 */
export const SphereLighting: CollisionDetectionObject = {
  keyFunction: function sphereLighting(
    sphere: Point & { radius: number },
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
  },
  dependencies: [],
  functionString: `
function sphereLighting(
  sphere: { x: number; y: number; radius: number },
  lightSource: { x: number; y: number },
  highlightReach: number = 0.4
): { x: number; y: number } {
  const angleToLight = Math.atan2(
    lightSource.y - sphere.y,
    lightSource.x - sphere.x
  );
  return {
    x: sphere.x + Math.cos(angleToLight) * sphere.radius * highlightReach,
    y: sphere.y + Math.sin(angleToLight) * sphere.radius * highlightReach,
  };
}
`,
};
