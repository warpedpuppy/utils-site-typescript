// All Canvas 2D drawing for the Animate mini-demo. paint() dispatches on the
// demo kind to the matching scene; every scene reads live values from
// @utilspalooza/core so the picture and the printed call can never disagree.
// Sibling to AnimateMiniDemo.tsx (the React shell), mirroring drawScalarMiniDemo.ts.
import { delay, loop, stagger, tweenFrame, tweenObject, tweenValue, yoyo } from "@utilspalooza/core/Animate";
import type { AnimateDemoDef } from "./animateDemos";
import {
  AnimateControls,
  cycleSpan,
  fmt,
  OBJECT_SPEC,
  TickerSnapshot,
} from "./animateMiniDemoModel";

export function paint(
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
