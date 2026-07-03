import { useEffect, useMemo, useRef, useState } from "react";
import { getRandomColors } from "@utilspalooza/core/GetRandomColors";
import { hslToRgb, rgbToCss, rgbToHsl } from "@utilspalooza/core/Color";
import { sphereLighting } from "@utilspalooza/core/SphereLighting";
import type { Point } from "@utilspalooza/core";
import type { ColorDemoDef } from "./colorDemos";
import {
  clamp,
  DEFAULT_HSL,
  DEFAULT_RGB,
  FamilyName,
  fmt,
  HslControls,
  RgbControls,
} from "./colorMiniDemoModel";
import { paintColorScene } from "./drawColorMiniDemo";
import { buildCall, buildReadouts } from "./colorMiniDemoSummary";
import "./MiniDemo.scss";

interface ColorMiniDemoProps {
  demo: ColorDemoDef;
  height?: number;
}

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

    paintColorScene(ctx, demo, size.width, size.height, {
      rgb,
      rgbAsHsl,
      hsl,
      hslAsRgb,
      cssString,
      family,
      swatches,
      sphere,
      light,
      highlight,
    });
  }, [cssString, demo, family, highlight, hsl, hslAsRgb, light, rgb, rgbAsHsl, size, sphere, swatches]);

  const readouts =
    buildReadouts(demo, rgb, rgbAsHsl, hsl, hslAsRgb, cssString, family, swatches, light, highlight) ?? [];
  const call = buildCall(demo, rgb, rgbAsHsl, hsl, hslAsRgb, cssString, family, light, sphere, highlight) ?? "";

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
