// Builds the printed call line and the readout rows above the Color mini-demo
// canvas. Values come from the same @utilspalooza/core conversions the drawing
// uses, so the text and the picture can't disagree.
import type { HSL, RGB } from "@utilspalooza/core/Color";
import type { Point } from "@utilspalooza/core";
import type { ColorDemoDef } from "./colorDemos";
import {
  CapsHsl,
  FamilyName,
  fmt,
  formatHsl,
  formatHslCaps,
  formatRgb,
  Sphere,
} from "./colorMiniDemoModel";

export interface ColorReadout {
  label: string;
  value: string;
  live?: boolean;
}

export function buildCall(
  demo: ColorDemoDef,
  rgb: RGB,
  rgbAsHsl: HSL,
  hsl: HSL,
  hslAsRgb: RGB,
  cssString: string,
  family: FamilyName,
  light: Point,
  sphere: Sphere,
  highlight: Point,
): string | undefined {
  switch (demo.kind) {
    case "rgb-to-hsl":
      return `rgbToHsl(${formatRgb(rgb)}) = ${formatHsl(rgbAsHsl)}`;
    case "hsl-to-rgb":
      return `hslToRgb(${formatHsl(hsl)}) = ${formatRgb(hslAsRgb)}`;
    case "rgb-to-css":
      return `rgbToCss(${formatRgb(rgb)}) = "${cssString}"`;
    case "get-random-colors":
      return `getRandomColors("${family}")`;
    case "sphere-lighting":
      return `sphereLighting({ x: ${fmt(sphere.x)}, y: ${fmt(sphere.y)}, radius: ${fmt(sphere.radius)} }, { x: ${fmt(light.x)}, y: ${fmt(light.y)} }) = { x: ${fmt(highlight.x)}, y: ${fmt(highlight.y)} }`;
  }
}

export function buildReadouts(
  demo: ColorDemoDef,
  rgb: RGB,
  rgbAsHsl: HSL,
  hsl: HSL,
  hslAsRgb: RGB,
  cssString: string,
  family: FamilyName,
  swatches: CapsHsl[],
  light: Point,
  highlight: Point,
): ColorReadout[] | undefined {
  switch (demo.kind) {
    case "rgb-to-hsl":
      return [
        { label: "rgb", value: formatRgb(rgb) },
        { label: "hue", value: `${fmt(rgbAsHsl.h)}°` },
        { label: "sat", value: `${fmt(rgbAsHsl.s)}%` },
        { label: "light", value: `${fmt(rgbAsHsl.l)}%`, live: true },
      ];
    case "hsl-to-rgb":
      return [
        { label: "hsl", value: formatHsl(hsl) },
        { label: "r", value: fmt(hslAsRgb.r) },
        { label: "g", value: fmt(hslAsRgb.g) },
        { label: "b", value: fmt(hslAsRgb.b), live: true },
      ];
    case "rgb-to-css":
      return [
        { label: "rounded", value: formatRgb({ r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) }) },
        { label: "css", value: cssString, live: true },
      ];
    case "get-random-colors":
      return [
        { label: "family", value: family },
        { label: "sample 1", value: formatHslCaps(swatches[0]) },
        { label: "sample 2", value: formatHslCaps(swatches[1]) },
        { label: "sample 3", value: formatHslCaps(swatches[2]), live: true },
      ];
    case "sphere-lighting":
      return [
        { label: "light", value: `{ x: ${fmt(light.x)}, y: ${fmt(light.y)} }` },
        { label: "highlight", value: `{ x: ${fmt(highlight.x)}, y: ${fmt(highlight.y)} }`, live: true },
      ];
  }
}
