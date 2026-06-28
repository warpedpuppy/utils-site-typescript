export type ColorDemoKind =
  | "rgb-to-hsl"
  | "hsl-to-rgb"
  | "rgb-to-css"
  | "get-random-colors"
  | "sphere-lighting";

export interface ColorDemoDef {
  kind: ColorDemoKind;
  fnName: string;
  hint: string;
}

export const COLOR_DEMOS: Record<string, ColorDemoDef> = {
  rgbToHsl: {
    kind: "rgb-to-hsl",
    fnName: "rgbToHsl",
    hint: "Drive the RGB channels and watch the same color get rewritten as hue, saturation, and lightness.",
  },
  hslToRgb: {
    kind: "hsl-to-rgb",
    fnName: "hslToRgb",
    hint: "Drive hue, saturation, and lightness directly and watch the RGB channels update to match.",
  },
  rgbToCss: {
    kind: "rgb-to-css",
    fnName: "rgbToCss",
    hint: "This one is formatting, not color math: same RGB color, now turned into the CSS string you can paste into a style.",
  },
  getRandomColors: {
    kind: "get-random-colors",
    fnName: "getRandomColors",
    hint: "Shuffle a few samples inside one named hue family and compare them against the full wheel.",
  },
  sphereLighting: {
    kind: "sphere-lighting",
    fnName: "sphereLighting",
    hint: "Drag the light. The helper just walks from the sphere center toward that light and places the highlight partway out on the radius.",
  },
};
