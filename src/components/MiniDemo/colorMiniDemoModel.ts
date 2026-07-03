// Shared types, defaults, formatters, and math helpers for the Color mini-demo.
// Imported by the component (ColorMiniDemo.tsx), the drawing dispatcher
// (drawColorMiniDemo.ts), and the call/readout builder (colorMiniDemoSummary.ts).
import type { HSL, RGB } from "@utilspalooza/core/Color";
import type { Point } from "@utilspalooza/core";

export interface RgbControls {
  r: number;
  g: number;
  b: number;
}

export interface HslControls {
  h: number;
  s: number;
  l: number;
}

export type FamilyName = "all" | "red" | "orange" | "yellow" | "green" | "blue";

export const DEFAULT_RGB: RgbControls = { r: 255, g: 120, b: 32 };
export const DEFAULT_HSL: HslControls = { h: 210, s: 90, l: 56 };

export type Sphere = { x: number; y: number; radius: number };
export type CapsHsl = { H: number; S: number; L: number };

// Everything the drawing dispatcher needs to render whichever scene is active.
// The component derives these (mostly memoized) and hands the bundle to paint.
export interface ColorSceneState {
  rgb: RGB;
  rgbAsHsl: HSL;
  hsl: HSL;
  hslAsRgb: RGB;
  cssString: string;
  family: FamilyName;
  swatches: CapsHsl[];
  sphere: Sphere;
  light: Point;
  highlight: Point;
}

export function formatRgb(rgb: RGB): string {
  return `{ r: ${fmt(rgb.r)}, g: ${fmt(rgb.g)}, b: ${fmt(rgb.b)} }`;
}

export function formatHsl(hsl: HSL): string {
  return `{ h: ${fmt(hsl.h)}, s: ${fmt(hsl.s)}, l: ${fmt(hsl.l)} }`;
}

export function formatHslCaps(hsl: CapsHsl): string {
  return `{ H: ${fmt(hsl.H)}, S: ${fmt(hsl.S)}, L: ${fmt(hsl.L)} }`;
}

export function fmt(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
