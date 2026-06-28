import { useEffect, useMemo, useRef, useState } from "react";
import { getRandomColors } from "@utilspalooza/core/GetRandomColors";
import {
  hslToRgb,
  rgbToCss,
  rgbToHsl,
  type HSL,
  type RGB,
} from "@utilspalooza/core/Color";
import { sphereLighting } from "@utilspalooza/core/SphereLighting";
import type { Point } from "@utilspalooza/core";
import type { ColorDemoDef } from "./colorDemos";
import "./MiniDemo.scss";

interface ColorMiniDemoProps {
  demo: ColorDemoDef;
  height?: number;
}

interface RgbControls {
  r: number;
  g: number;
  b: number;
}

interface HslControls {
  h: number;
  s: number;
  l: number;
}

type FamilyName = "all" | "red" | "orange" | "yellow" | "green" | "blue";

const DEFAULT_RGB: RgbControls = { r: 255, g: 120, b: 32 };
const DEFAULT_HSL: HslControls = { h: 210, s: 90, l: 56 };

export default function ColorMiniDemo({
  demo,
  height = 220,
}: ColorMiniDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rgb, setRgb] = useState<RgbControls>(DEFAULT_RGB);
  const [hsl, setHsl] = useState<HslControls>(DEFAULT_HSL);
  const [family, setFamily] = useState<FamilyName>("blue");
  const [shuffleTick, setShuffleTick] = useState(0);
  const [light, setLight] = useState<Point>({ x: 94, y: 54 });
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const [size, setSize] = useState({ width: 480, height });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fit = () => {
      setSize({ width: canvas.clientWidth || 480, height });
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [height]);

  useEffect(() => {
    if (demo.kind === "rgb-to-hsl" || demo.kind === "rgb-to-css") {
      setRgb(DEFAULT_RGB);
    } else if (demo.kind === "hsl-to-rgb") {
      setHsl(DEFAULT_HSL);
    } else if (demo.kind === "get-random-colors") {
      setFamily("blue");
      setShuffleTick(0);
    } else {
      setLight({ x: 94, y: 54 });
    }
  }, [demo]);

  const rgbAsHsl = useMemo(() => rgbToHsl(rgb), [rgb]);
  const hslAsRgb = useMemo(() => hslToRgb(hsl), [hsl]);
  const cssString = useMemo(() => rgbToCss(rgb), [rgb]);
  const swatches = useMemo(() => {
    const out = [];
    for (let i = 0; i < 5; i += 1) out.push(getRandomColors(family));
    return out;
  }, [family, shuffleTick]);
  const sphere = useMemo(
    () => ({
      x: Math.round(size.width * 0.55),
      y: Math.round(size.height * 0.54),
      radius: Math.min(58, Math.round(size.height * 0.24)),
    }),
    [size.height, size.width],
  );
  const highlight = useMemo(() => sphereLighting(sphere, light), [light, sphere]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.width * dpr;
    canvas.height = size.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawBackdrop(ctx, size.width, size.height);
    switch (demo.kind) {
      case "rgb-to-hsl":
        drawRgbToHslScene(ctx, size.width, size.height, rgb, rgbAsHsl);
        break;
      case "hsl-to-rgb":
        drawHslToRgbScene(ctx, size.width, size.height, hsl, hslAsRgb);
        break;
      case "rgb-to-css":
        drawRgbToCssScene(ctx, size.width, size.height, rgb, cssString);
        break;
      case "get-random-colors":
        drawRandomColorsScene(ctx, size.width, size.height, family, swatches);
        break;
      case "sphere-lighting":
        drawSphereLightingScene(ctx, size.width, size.height, sphere, light, highlight);
        break;
    }
  }, [cssString, demo.kind, family, highlight, hsl, hslAsRgb, light, rgb, rgbAsHsl, size, sphere, swatches]);

  const readouts = buildReadouts(demo, rgb, rgbAsHsl, hsl, hslAsRgb, cssString, family, swatches, light, highlight);
  const call = buildCall(demo, rgb, rgbAsHsl, hsl, hslAsRgb, cssString, family, light, sphere, highlight);

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (demo.kind !== "sphere-lighting") return;
    const point = getCanvasPoint(event, canvasRef.current);
    if (!point) return;
    if (Math.hypot(point.x - light.x, point.y - light.y) > 14) return;
    dragRef.current = { dx: point.x - light.x, dy: point.y - light.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (demo.kind !== "sphere-lighting" || !dragRef.current) return;
    const point = getCanvasPoint(event, canvasRef.current);
    if (!point) return;
    setLight({
      x: clamp(point.x - dragRef.current.dx, 20, size.width - 20),
      y: clamp(point.y - dragRef.current.dy, 20, size.height - 20),
    });
  };

  const onPointerUp = (event?: React.PointerEvent<HTMLCanvasElement>) => {
    if (event && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  };

  return (
    <div className="mini-demo mini-demo--color">
      <div className="mini-demo__call">
        <code>{call}</code>
      </div>
      <div className="mini-demo__geometry-readout">
        {readouts.map((row) => (
          <div
            key={row.label}
            className={row.live ? "mini-demo__touching is-live" : undefined}
          >
            <span className="mini-demo__readout-label">{row.label}</span>
            <code>{row.value}</code>
          </div>
        ))}
      </div>
      <p className="mini-demo__hint">{demo.hint}</p>
      <canvas
        ref={canvasRef}
        className={demo.kind === "sphere-lighting" ? "mini-demo__canvas mini-demo__canvas--draggable" : "mini-demo__canvas"}
        style={{ height }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        aria-label={`Interactive ${demo.fnName} color demo`}
      />
      {demo.kind === "rgb-to-hsl" || demo.kind === "rgb-to-css" ? (
        <div className="mini-demo__controls">
          <RangeControl name="r" min={0} max={255} value={rgb.r} onChange={(value) => setRgb((current) => ({ ...current, r: value }))} />
          <RangeControl name="g" min={0} max={255} value={rgb.g} onChange={(value) => setRgb((current) => ({ ...current, g: value }))} />
          <RangeControl name="b" min={0} max={255} value={rgb.b} onChange={(value) => setRgb((current) => ({ ...current, b: value }))} />
        </div>
      ) : null}
      {demo.kind === "hsl-to-rgb" ? (
        <div className="mini-demo__controls">
          <RangeControl name="h" min={0} max={360} value={hsl.h} onChange={(value) => setHsl((current) => ({ ...current, h: value }))} />
          <RangeControl name="s" min={0} max={100} value={hsl.s} onChange={(value) => setHsl((current) => ({ ...current, s: value }))} />
          <RangeControl name="l" min={0} max={100} value={hsl.l} onChange={(value) => setHsl((current) => ({ ...current, l: value }))} />
        </div>
      ) : null}
      {demo.kind === "get-random-colors" ? (
        <div className="mini-demo__controls">
          <label className="mini-demo__control">
            <span className="mini-demo__control-name">family</span>
            <select
              className="mini-demo__select"
              value={family}
              onChange={(event) => setFamily(event.target.value as FamilyName)}
            >
              <option value="all">all</option>
              <option value="red">red</option>
              <option value="orange">orange</option>
              <option value="yellow">yellow</option>
              <option value="green">green</option>
              <option value="blue">blue</option>
            </select>
          </label>
          <button type="button" className="mini-demo__resume" onClick={() => setShuffleTick((n) => n + 1)}>
            ↻ reshuffle
          </button>
        </div>
      ) : null}
    </div>
  );
}

function RangeControl({
  name,
  min,
  max,
  value,
  onChange,
}: {
  name: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="mini-demo__control">
      <span className="mini-demo__control-name">{name}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="mini-demo__control-val">{fmt(value)}</span>
    </label>
  );
}

function buildCall(
  demo: ColorDemoDef,
  rgb: RGB,
  rgbAsHsl: HSL,
  hsl: HSL,
  hslAsRgb: RGB,
  cssString: string,
  family: FamilyName,
  light: Point,
  sphere: { x: number; y: number; radius: number },
  highlight: Point,
) {
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

function buildReadouts(
  demo: ColorDemoDef,
  rgb: RGB,
  rgbAsHsl: HSL,
  hsl: HSL,
  hslAsRgb: RGB,
  cssString: string,
  family: FamilyName,
  swatches: Array<{ H: number; S: number; L: number }>,
  light: Point,
  highlight: Point,
) {
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
  swatches: Array<{ H: number; S: number; L: number }>,
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
  sphere: { x: number; y: number; radius: number },
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

function getCanvasPoint(
  event: React.PointerEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement | null,
) {
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function formatRgb(rgb: RGB) {
  return `{ r: ${fmt(rgb.r)}, g: ${fmt(rgb.g)}, b: ${fmt(rgb.b)} }`;
}

function formatHsl(hsl: HSL) {
  return `{ h: ${fmt(hsl.h)}, s: ${fmt(hsl.s)}, l: ${fmt(hsl.l)} }`;
}

function formatHslCaps(hsl: { H: number; S: number; L: number }) {
  return `{ H: ${fmt(hsl.H)}, S: ${fmt(hsl.S)}, L: ${fmt(hsl.L)} }`;
}

function fmt(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
