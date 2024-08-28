import { CollisionDetectionObject } from "../../../../types/types";

export const GetRandomColors: CollisionDetectionObject = {
  keyFunction: function GetRandomColors() {
    // Hue:
    // reds: 0 - 40
    // orange: 40 - 80
    // green: 80 - 150
    //blue: 200 - 250
    // purple: 280 - 320

    // Saturation:
    // % of color in color

    // Lightness:
    // % of white in color

    return {};
  },
  dependencies: [],
  functionString: `
function GetRandomColors() {
    // Hue	210° - 260°
    // Saturation	70% - 100%
    // Lightness	30% - 70%
    return {};
}
`,
};
