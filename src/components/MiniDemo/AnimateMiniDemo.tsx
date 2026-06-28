import { useEffect, useRef, useState } from "react";
import {
  delay,
  loop,
  stagger,
  ticker,
  tweenFrame,
  tweenObject,
  tweenValue,
  yoyo,
} from "@utilspalooza/core/Animate";
import type { AnimateDemoDef } from "./animateDemos";
import "./MiniDemo.scss";

interface AnimateMiniDemoProps {
  demo: AnimateDemoDef;
  height?: number;
}

interface AnimateControls {
  elapsed: number;
  duration: number;
  from: number;
  to: number;
  delayMs: number;
  staggerMs: number;
  index: number;
}

interface TickerSnapshot {
  frame: number;
  elapsed: number;
  delta: number;
}

const DEFAULT_CONTROLS: AnimateControls = {
  elapsed: 420,
  duration: 1000,
  from: 0,
  to: 100,
  delayMs: 280,
  staggerMs: 160,
  index: 2,
};

const OBJECT_SPEC = {
  x: { from: 36, to: 244 },
  y: { from: 28, to: 96 },
  alpha: { from: 0.2, to: 1 },
};

export default function AnimateMiniDemo({
  demo,
  height = 210,
}: AnimateMiniDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [controls, setControls] = useState<AnimateControls>(DEFAULT_CONTROLS);
  const [auto, setAuto] = useState(true);
  const controlsRef = useRef(controls);
  const autoRef = useRef(auto);
  const [tickerFrame, setTickerFrame] = useState<TickerSnapshot>({
    frame: 0,
    elapsed: 0,
    delta: 16.7,
  });
  controlsRef.current = controls;
  autoRef.current = auto;

  useEffect(() => {
    controlsRef.current = DEFAULT_CONTROLS;
    setControls(DEFAULT_CONTROLS);
    setAuto(true);
    setTickerFrame({ frame: 0, elapsed: 0, delta: 16.7 });
  }, [demo]);

  useEffect(() => {
    if (demo.kind !== "ticker") return;
    let active = true;
    const handle = ticker((frame) => {
      if (!active) return;
      setTickerFrame({
        frame: frame.frame,
        elapsed: frame.elapsed,
        delta: frame.delta,
      });
    });
    return () => {
      active = false;
      handle.cancel();
    };
  }, [demo.kind]);

  useEffect(() => {
    if (demo.kind === "ticker") return;
    let raf = 0;
    let previous = performance.now();

    const step = (now: number) => {
      const dt = now - previous;
      previous = now;
      if (autoRef.current) {
        const current = controlsRef.current;
        const span = cycleSpan(demo.kind, current);
        const nextElapsed = span <= 0 ? 0 : (current.elapsed + dt * 0.8) % span;
        const next = { ...current, elapsed: nextElapsed };
        controlsRef.current = next;
        setControls(next);
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [demo.kind]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const cssW = canvas.clientWidth || 480;
      canvas.width = cssW * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return cssW;
    };

    let width = fit();
    const onResize = () => {
      width = fit();
      paint(ctx, demo, width, height, controlsRef.current, tickerFrame);
    };
    window.addEventListener("resize", onResize);

    paint(ctx, demo, width, height, controls, tickerFrame);

    return () => window.removeEventListener("resize", onResize);
  }, [controls, demo, height, tickerFrame]);

  const summary = summarize(demo, controls, tickerFrame);

  return (
    <div className="mini-demo mini-demo--animate">
      <div className="mini-demo__call">
        <code>{summary.call}</code>
      </div>
      <div className="mini-demo__geometry-readout">
        {summary.readouts.map((row) => (
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
        className="mini-demo__canvas"
        style={{ height }}
        aria-label={`Interactive ${demo.fnName} animation demo`}
      />
      {demo.kind !== "ticker" && (
        <div className="mini-demo__controls">
          <RangeControl
            name="elapsedMs"
            min={0}
            max={cycleSpan(demo.kind, controls)}
            step={1}
            value={controls.elapsed}
            tag={auto ? "auto" : "manual"}
            onChange={(value) => updateControl("elapsed", value, true)}
          />
          {(demo.kind === "loop" ||
            demo.kind === "yoyo" ||
            demo.kind === "delay" ||
            demo.kind === "stagger" ||
            demo.kind === "tween-value" ||
            demo.kind === "tween-object") && (
            <RangeControl
              name="durationMs"
              min={200}
              max={1800}
              step={10}
              value={controls.duration}
              onChange={(value) => updateControl("duration", value)}
            />
          )}
          {demo.kind === "delay" && (
            <RangeControl
              name="delayMs"
              min={0}
              max={900}
              step={10}
              value={controls.delayMs}
              onChange={(value) => updateControl("delayMs", value)}
            />
          )}
          {demo.kind === "stagger" && (
            <>
              <RangeControl
                name="index"
                min={0}
                max={4}
                step={1}
                value={controls.index}
                onChange={(value) => updateControl("index", value)}
              />
              <RangeControl
                name="staggerMs"
                min={60}
                max={320}
                step={10}
                value={controls.staggerMs}
                onChange={(value) => updateControl("staggerMs", value)}
              />
            </>
          )}
          {demo.kind === "tween-value" && (
            <>
              <RangeControl
                name="from"
                min={-100}
                max={100}
                step={5}
                value={controls.from}
                onChange={(value) => updateControl("from", value)}
              />
              <RangeControl
                name="to"
                min={-100}
                max={140}
                step={5}
                value={controls.to}
                onChange={(value) => updateControl("to", value)}
              />
            </>
          )}
          {!auto && (
            <button type="button" className="mini-demo__resume" onClick={() => setAuto(true)}>
              ▶ resume auto-sweep
            </button>
          )}
        </div>
      )}
    </div>
  );

  function updateControl(key: keyof AnimateControls, value: number, stopAuto = false) {
    const next = { ...controlsRef.current, [key]: value };
    controlsRef.current = next;
    setControls(next);
    if (stopAuto && autoRef.current) setAuto(false);
  }
}

function RangeControl({
  name,
  min,
  max,
  step,
  value,
  tag,
  onChange,
}: {
  name: string;
  min: number;
  max: number;
  step: number;
  value: number;
  tag?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="mini-demo__control">
      <span className="mini-demo__control-name">
        {name}
        {tag && <span className="mini-demo__control-tag">{tag}</span>}
      </span>
      <input
        type="range"
        min={min}
        max={Math.max(min, max)}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="mini-demo__control-val">{fmt(value)}</span>
    </label>
  );
}

function summarize(
  demo: AnimateDemoDef,
  controls: AnimateControls,
  tickerFrame: TickerSnapshot,
) {
  if (demo.kind === "ticker") {
    return {
      call: `ticker(({ elapsed, delta, frame }) => draw(elapsed))`,
      readouts: [
        { label: "frame", value: String(tickerFrame.frame) },
        { label: "elapsed", value: `${fmt(tickerFrame.elapsed)} ms` },
        { label: "delta", value: `${fmt(tickerFrame.delta)} ms`, live: true },
      ],
    };
  }

  if (demo.kind === "tween-value") {
    const value = tweenValue(controls.from, controls.to, controls.elapsed, controls.duration);
    return {
      call: `tweenValue(${fmt(controls.from)}, ${fmt(controls.to)}, ${fmt(controls.elapsed)}, ${fmt(controls.duration)}) = ${fmt(value)}`,
      readouts: [
        { label: "from", value: fmt(controls.from) },
        { label: "to", value: fmt(controls.to) },
        { label: "t", value: fmt(clamp01(controls.duration <= 0 ? 1 : controls.elapsed / controls.duration)) },
        { label: "value", value: fmt(value), live: true },
      ],
    };
  }

  if (demo.kind === "tween-object") {
    const sampler = demo.fnName === "tweenFrame" ? tweenFrame : tweenObject;
    const value = sampler(OBJECT_SPEC, controls.elapsed, controls.duration);
    return {
      call: `${demo.fnName}({ x, y, alpha }, ${fmt(controls.elapsed)}, ${fmt(controls.duration)})`,
      readouts: [
        { label: "x", value: fmt(value.x) },
        { label: "y", value: fmt(value.y) },
        { label: "alpha", value: fmt(value.alpha), live: true },
      ],
    };
  }

  if (demo.kind === "loop") {
    const value = loop(controls.elapsed, controls.duration);
    return {
      call: `loop(${fmt(controls.elapsed)}, ${fmt(controls.duration)}) = ${fmt(value)}`,
      readouts: [
        { label: "elapsed", value: `${fmt(controls.elapsed)} ms` },
        { label: "duration", value: `${fmt(controls.duration)} ms` },
        { label: "progress", value: fmt(value), live: true },
      ],
    };
  }

  if (demo.kind === "yoyo") {
    const value = yoyo(controls.elapsed, controls.duration);
    return {
      call: `yoyo(${fmt(controls.elapsed)}, ${fmt(controls.duration)}) = ${fmt(value)}`,
      readouts: [
        { label: "elapsed", value: `${fmt(controls.elapsed)} ms` },
        { label: "duration", value: `${fmt(controls.duration)} ms` },
        { label: "progress", value: fmt(value), live: true },
      ],
    };
  }

  if (demo.kind === "delay") {
    const value = delay(controls.elapsed, controls.delayMs, controls.duration);
    return {
      call: `delay(${fmt(controls.elapsed)}, ${fmt(controls.delayMs)}, ${fmt(controls.duration)}) = ${fmt(value)}`,
      readouts: [
        { label: "delay", value: `${fmt(controls.delayMs)} ms` },
        { label: "duration", value: `${fmt(controls.duration)} ms` },
        { label: "progress", value: fmt(value), live: true },
      ],
    };
  }

  const itemValue = stagger(
    controls.index,
    controls.elapsed,
    controls.duration,
    controls.staggerMs,
  );
  return {
    call: `stagger(${fmt(controls.index)}, ${fmt(controls.elapsed)}, ${fmt(controls.duration)}, ${fmt(controls.staggerMs)}) = ${fmt(itemValue)}`,
    readouts: [
      { label: "index", value: fmt(controls.index) },
      { label: "stagger", value: `${fmt(controls.staggerMs)} ms` },
      { label: "item progress", value: fmt(itemValue), live: true },
    ],
  };
}

function paint(
  ctx: CanvasRenderingContext2D,
  demo: AnimateDemoDef,
  width: number,
  height: number,
  controls: AnimateControls,
  tickerFrame: TickerSnapshot,
) {
  drawBackdrop(ctx, width, height);
  if (demo.kind === "ticker") {
    drawTickerScene(ctx, width, height, tickerFrame);
    return;
  }
  if (demo.kind === "stagger") {
    drawStaggerScene(ctx, width, height, controls);
    return;
  }
  if (demo.kind === "tween-object") {
    drawTweenObjectScene(ctx, width, height, controls, demo.fnName === "tweenFrame");
    return;
  }
  if (demo.kind === "tween-value") {
    drawTweenValueScene(ctx, width, height, controls);
    return;
  }
  drawProgressScene(ctx, width, height, demo.kind, controls);
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

function drawProgressScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  kind: "loop" | "yoyo" | "delay",
  controls: AnimateControls,
) {
  const x0 = 34;
  const x1 = width - 34;
  const timeY = 72;
  const valueY = 146;
  const span = cycleSpan(kind, controls);
  const timeFrac = span <= 0 ? 0 : controls.elapsed / span;
  const value =
    kind === "loop"
      ? loop(controls.elapsed, controls.duration)
      : kind === "yoyo"
        ? yoyo(controls.elapsed, controls.duration)
        : delay(controls.elapsed, controls.delayMs, controls.duration);

  drawTrack(ctx, x0, x1, timeY, "elapsed");
  drawTrack(ctx, x0, x1, valueY, "output");

  if (kind === "delay") {
    const delayX = x0 + (controls.delayMs / Math.max(span, 1)) * (x1 - x0);
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = "rgba(249, 115, 22, 0.9)";
    ctx.beginPath();
    ctx.moveTo(delayX, valueY - 18);
    ctx.lineTo(delayX, valueY + 18);
    ctx.stroke();
    ctx.setLineDash([]);
    label(ctx, delayX + 22, valueY - 22, "delay wall", "#fdba74");
  }

  drawDot(ctx, x0 + timeFrac * (x1 - x0), timeY, "#60a5fa");
  drawDot(ctx, x0 + value * (x1 - x0), valueY, "#f97316");
  label(ctx, x0 + timeFrac * (x1 - x0), timeY - 18, "time", "#60a5fa");
  label(ctx, x0 + value * (x1 - x0), valueY - 18, "value", "#f97316");
}

function drawTweenValueScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  controls: AnimateControls,
) {
  const x0 = 34;
  const x1 = width - 34;
  const timeY = 72;
  const valueY = 146;
  const value = tweenValue(controls.from, controls.to, controls.elapsed, controls.duration);
  const span = cycleSpan("tween-value", controls);
  const timeFrac = span <= 0 ? 0 : controls.elapsed / span;
  const min = Math.min(controls.from, controls.to);
  const max = Math.max(controls.from, controls.to);
  const valueFrac = min === max ? 0.5 : (value - min) / (max - min);

  drawTrack(ctx, x0, x1, timeY, "elapsed");
  drawTrack(ctx, x0, x1, valueY, "value");
  drawDot(ctx, x0 + timeFrac * (x1 - x0), timeY, "#60a5fa");
  drawDot(ctx, x0 + valueFrac * (x1 - x0), valueY, "#f97316");
  label(ctx, x0 + 12, valueY - 22, `from ${fmt(controls.from)}`, "#cbd5e1");
  label(ctx, x1 - 16, valueY - 22, `to ${fmt(controls.to)}`, "#cbd5e1", "right");
}

function drawTweenObjectScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  controls: AnimateControls,
  isAlias: boolean,
) {
  const value = (isAlias ? tweenFrame : tweenObject)(OBJECT_SPEC, controls.elapsed, controls.duration);
  const barX = 34;
  const barW = width - 68;
  const rows = [
    { key: "x", y: 70, min: OBJECT_SPEC.x.from, max: OBJECT_SPEC.x.to, value: value.x, color: "#818cf8" },
    { key: "y", y: 112, min: OBJECT_SPEC.y.from, max: OBJECT_SPEC.y.to, value: value.y, color: "#60a5fa" },
    { key: "alpha", y: 154, min: OBJECT_SPEC.alpha.from, max: OBJECT_SPEC.alpha.to, value: value.alpha, color: "#f97316" },
  ] as const;

  rows.forEach((row) => {
    const frac = (row.value - row.min) / (row.max - row.min);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(barX, row.y - 7, barW, 14);
    ctx.fillStyle = row.color;
    ctx.fillRect(barX, row.y - 7, frac * barW, 14);
    label(ctx, barX, row.y - 18, row.key, row.color);
    label(ctx, barX + frac * barW, row.y - 18, fmt(row.value), row.color);
  });

  ctx.fillStyle = `rgba(251, 146, 60, ${value.alpha})`;
  ctx.fillRect(value.x, 28 + value.y * 0.45, 34, 24);
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.strokeRect(value.x, 28 + value.y * 0.45, 34, 24);
}

function drawStaggerScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  controls: AnimateControls,
) {
  const x0 = 34;
  const x1 = width - 34;
  const rows = [54, 88, 122, 156, 190];
  rows.forEach((y, index) => {
    const progress = stagger(index, controls.elapsed, controls.duration, controls.staggerMs);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(x0, y - 8, x1 - x0, 16);
    ctx.fillStyle = index === controls.index ? "#f97316" : "#818cf8";
    ctx.fillRect(x0, y - 8, progress * (x1 - x0), 16);
    label(ctx, x0 - 2, y - 18, `item ${index}`, index === controls.index ? "#fdba74" : "#c7d2fe");
  });
}

function drawTickerScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tickerFrame: TickerSnapshot,
) {
  const x0 = 34;
  const x1 = width - 34;
  const y = 116;
  const frac = loop(tickerFrame.elapsed, 1600);

  drawTrack(ctx, x0, x1, y, "elapsed");
  drawDot(ctx, x0 + frac * (x1 - x0), y, "#f97316");
  label(ctx, x0 + frac * (x1 - x0), y - 18, `frame ${tickerFrame.frame}`, "#fdba74");

  ctx.font = "600 12px 'Space Mono', monospace";
  ctx.fillStyle = "#cbd5e1";
  ctx.fillText("callback payload updates every frame", 34, 54);
  ctx.fillStyle = "#93c5fd";
  ctx.fillText(`elapsed: ${fmt(tickerFrame.elapsed)} ms`, 34, 76);
  ctx.fillText(`delta: ${fmt(tickerFrame.delta)} ms`, 34, 94);
}

function drawTrack(
  ctx: CanvasRenderingContext2D,
  x0: number,
  x1: number,
  y: number,
  text: string,
) {
  ctx.strokeStyle = "rgba(255,255,255,0.24)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.lineTo(x1, y);
  ctx.stroke();
  label(ctx, x0, y - 18, text, "#e2e8f0");
}

function drawDot(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
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
  const pad = 12;
  const w = metrics.width + pad;
  const left = align === "right" ? x - w : align === "center" ? x - w / 2 : x;
  ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
  ctx.fillRect(left, y - 11, w, 18);
  ctx.fillStyle = color;
  ctx.fillText(text, align === "right" ? x - 6 : align === "center" ? x : x + 6, y + 2);
  ctx.textAlign = "start";
}

function cycleSpan(kind: AnimateDemoDef["kind"], controls: AnimateControls) {
  if (kind === "delay") return controls.delayMs + controls.duration + 260;
  if (kind === "stagger") return controls.duration + controls.staggerMs * 5 + 160;
  if (kind === "yoyo") return controls.duration * 2;
  return controls.duration;
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function fmt(n: number): string {
  const r = Math.round(n * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}
