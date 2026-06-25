import { CollisionDetectionObject } from "../../../../types/types";
import { lerpColorHsl } from "@utilspalooza/core/Color";

// Hand-written, self-contained snippet (Color.ts holds several functions, so we
// show just the color-interpolation story here rather than dumping the whole file).
const functionString = `// The naive way: blend each channel directly.
// Complements (blue↔yellow) pass through muddy gray at the midpoint.
function lerpColor(a, b, t) {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

// The nicer way: blend through HSL so the hue rotates the short way
// around the wheel and the color stays vivid instead of going gray.
function lerpColorHsl(a, b, t) {
  const ha = rgbToHsl(a);
  const hb = rgbToHsl(b);
  const dh = ((((hb.h - ha.h) % 360) + 540) % 360) - 180; // shortest hue arc
  return hslToRgb({
    h: ha.h + dh * t,
    s: ha.s + (hb.s - ha.s) * t,
    l: ha.l + (hb.l - ha.l) * t,
  });
}`;

export const lerpColor: CollisionDetectionObject = {
  keyFunction: lerpColorHsl,
  dependencies: ["rgbToHsl", "hslToRgb"],
  interfaces: ["RGB", "HSL"],
  functionString,
};
