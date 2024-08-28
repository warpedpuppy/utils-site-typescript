import { CollisionDetectionObject } from "../../../../types/types";

export const GetRandomBlues: CollisionDetectionObject = {
  keyFunction: function randomBlue() {
    // Color Channel (OKHSL)	Range
    // Hue	210° - 260°
    // Saturation	70% - 100%
    // Lightness	30% - 70%
    return {};
  },
  dependencies: [],
  functionString: `
function randomBlue() {
    // Hue	210° - 260°
    // Saturation	70% - 100%
    // Lightness	30% - 70%
    return {};
}
`,
};
