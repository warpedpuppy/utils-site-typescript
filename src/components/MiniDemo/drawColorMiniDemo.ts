// All Canvas 2D drawing for the Color mini-demo. paintColorScene() clears the
// backdrop and dispatches on the demo kind to the matching scene; colors come
// from calling the real @utilspalooza/core conversions so swatch and readout
// always agree. Sibling to ColorMiniDemo.tsx, mirroring drawScalarMiniDemo.ts.
import { rgbToCss, type HSL, type RGB } from "@utilspalooza/core/Color";
import type { Point } from "@utilspalooza/core";
import type { ColorDemoDef } from "./colorDemos";
import {
  CapsHsl,
  clamp,
  ColorSceneState,
  FamilyName,
  fmt,
  formatHsl,
  Sphere,
} from "./colorMiniDemoModel";

export function paintColorScene(
  ctx: CanvasRenderingContext2D,
  demo: ColorDemoDef,
  width: number,
  height: number,
  state: ColorSceneState,
) {
  drawBackdrop(ctx, width, height);
  switch (demo.kind) {
    case "rgb-to-hsl":
      drawRgbToHslScene(ctx, width, height, state.rgb, state.rgbAsHsl);
      break;
    case "hsl-to-rgb":
      drawHslToRgbScene(ctx, width, height, state.hsl, state.hslAsRgb);
      break;
    case "rgb-to-css":
      drawRgbToCssScene(ctx, width, height, state.rgb, state.cssString);
      break;
    case "get-random-colors":
      drawRandomColorsScene(ctx, width, height, state.family, state.swatches);
      break;
    case "sphere-lighting":
      drawSphereLightingScene(ctx, width, height, state.sphere, state.light, state.highlight);
      break;
  }
}

function drawBackdrop(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let x = 24; x < width; x += 24) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 24; y < height; y += 24) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function drawRgbToHslScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rgb: RGB,
  hsl: HSL,
) {
  const css = rgbToCss(rgb);
  drawSwatch(ctx, 28, 34, width * 0.36, height - 68, css);
  drawMeter(ctx, width * 0.47, 60, width * 0.42, 18, hsl.h / 360, "#f97316", `h ${fmt(hsl.h)}°`);
  drawMeter(ctx, width * 0.47, 102, width * 0.42, 18, hsl.s / 100, "#60a5fa", `s ${fmt(hsl.s)}%`);
  drawMeter(ctx, width * 0.47, 144, width * 0.42, 18, hsl.l / 100, "#818cf8", `l ${fmt(hsl.l)}%`);
}

function drawHslToRgbScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  hsl: HSL,
  rgb: RGB,
) {
  const css = rgbToCss(rgb);
  drawSwatch(ctx, 28, 34, width * 0.36, height - 68, css);
  drawMeter(ctx, width * 0.47, 60, width * 0.42, 18, rgb.r / 255, "#ef4444", `r ${fmt(rgb.r)}`);
  drawMeter(ctx, width * 0.47, 102, width * 0.42, 18, rgb.g / 255, "#22c55e", `g ${fmt(rgb.g)}`);
  drawMeter(ctx, width * 0.47, 144, width * 0.42, 18, rgb.b / 255, "#3b82f6", `b ${fmt(rgb.b)}`);
  label(ctx, width * 0.47, 34, formatHsl(hsl), "#e2e8f0");
}

function drawRgbToCssScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rgb: RGB,
  cssString: string,
) {
  drawSwatch(ctx, 28, 34, width * 0.32, height - 68, cssString);
  ctx.font = "600 13px 'Space Mono', monospace";
  ctx.fillStyle = "#cbd5e1";
  ctx.fillText("rounded channels", width * 0.44, 70);
  ctx.fillText(`${Math.round(rgb.r)}   ${Math.round(rgb.g)}   ${Math.round(rgb.b)}`, width * 0.44, 96);
  label(ctx, width * 0.44, 138, cssString, "#fdba74", "left");
}

function drawRandomColorsScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  family: FamilyName,
  swatches: CapsHsl[],
) {
  ctx.font = "600 13px 'Space Mono', monospace";
  ctx.fillStyle = "#cbd5e1";
  ctx.fillText(`family: ${family}`, 28, 30);
  const cellW = (width - 72) / swatches.length;
  swatches.forEach((swatch, index) => {
    const x = 28 + index * cellW;
    const css = `hsl(${swatch.H}, ${swatch.S}%, ${swatch.L}%)`;
    drawSwatch(ctx, x, 52, cellW - 12, 92, css);
    label(ctx, x + (cellW - 12) / 2, 158, `${swatch.H}°`, "#e2e8f0");
  });
}

function drawSphereLightingScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  sphere: Sphere,
  light: Point,
  highlight: Point,
) {
  const grad = ctx.createRadialGradient(
    highlight.x,
    highlight.y,
    2,
    sphere.x,
    sphere.y,
    sphere.radius,
  );
  grad.addColorStop(0, "rgba(255,255,255,0.95)");
  grad.addColorStop(0.25, "rgba(191, 219, 254, 0.9)");
  grad.addColorStop(1, "rgba(37, 99, 235, 0.92)");

  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(light.x, light.y);
  ctx.lineTo(sphere.x, sphere.y);
  ctx.stroke();

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(sphere.x, sphere.y, sphere.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.beginPath();
  ctx.arc(highlight.x, highlight.y, 8, 0, Math.PI * 2);
  ctx.fill();

  drawCenter(ctx, light, "#f97316", 7);
  drawCenter(ctx, { x: sphere.x, y: sphere.y }, "#e2e8f0", 4);
  label(ctx, light.x + 18, light.y - 12, "light", "#fdba74", "left");
  label(ctx, highlight.x + 14, highlight.y - 16, "highlight", "#f8fafc", "left");
}

function drawSwatch(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "rgba(255,255,255,0.24)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, w, h);
}

function drawMeter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  frac: number,
  color: string,
  labelText: string,
) {
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w * clamp(frac, 0, 1), h);
  label(ctx, x, y - 12, labelText, color, "left");
}

function drawCenter(
  ctx: CanvasRenderingContext2D,
  point: Point,
  color: string,
  radius: number,
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function label(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  color: string,
  align: CanvasTextAlign = "center",
) {
  ctx.font = "600 12px 'Space Mono', monospace";
  ctx.textAlign = align;
  const metrics = ctx.measureText(text);
  const w = metrics.width + 12;
  const left = align === "right" ? x - w : align === "center" ? x - w / 2 : x;
  ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
  ctx.fillRect(left, y - 11, w, 18);
  ctx.fillStyle = color;
  ctx.fillText(text, align === "right" ? x - 6 : align === "center" ? x : x + 6, y + 2);
  ctx.textAlign = "start";
}
