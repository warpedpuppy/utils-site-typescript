import { useEffect, useRef, useState } from "react";
import { shortestAngleBetween } from "@utilspalooza/core/AngleInterpolation";
import "./MiniDemo.scss";

interface ShortestAngleBetweenMiniDemoProps {
  height?: number;
}

interface DemoSnapshot {
  currentAngle: number;
  targetAngle: number;
  shortestDelta: number;
  longDelta: number;
  targetIndex: number;
}

const CURRENT_ANGLE_DEG = -90;
const TARGET_SEQUENCE_DEG = [18, 214, 332, 76, 288, 10];
const TARGET_HOLD_MS = 1650;
const TARGET_FADE_MS = 420;
const TARGET_RADIUS = 92;

export default function ShortestAngleBetweenMiniDemo({ height = 248 }: ShortestAngleBetweenMiniDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({
    targetIndex: 0,
    enteredAt: 0,
    alpha: 0,
  });
  const [snapshot, setSnapshot] = useState<DemoSnapshot>(() => {
    const currentAngle = toRad(CURRENT_ANGLE_DEG);
    const targetAngle = toRad(TARGET_SEQUENCE_DEG[0]);
    const shortestDelta = shortestAngleBetween(currentAngle, targetAngle);
    return {
      currentAngle,
      targetAngle,
      shortestDelta,
      longDelta: longestTurn(shortestDelta),
      targetIndex: 0,
    };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let size = fitCanvas(canvas, ctx, height);
    const onResize = () => {
      size = fitCanvas(canvas, ctx, height);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const currentAngle = toRad(CURRENT_ANGLE_DEG);

    const loop = (now: number) => {
      const state = stateRef.current;
      if (!state.enteredAt) state.enteredAt = now;

      const phaseElapsed = now - state.enteredAt;
      if (phaseElapsed >= TARGET_HOLD_MS) {
        state.targetIndex = (state.targetIndex + 1) % TARGET_SEQUENCE_DEG.length;
        state.enteredAt = now;
      }

      state.alpha = clamp01((now - state.enteredAt) / TARGET_FADE_MS);
      const targetAngle = toRad(TARGET_SEQUENCE_DEG[state.targetIndex]);
      const shortestDelta = shortestAngleBetween(currentAngle, targetAngle);
      const longDelta = longestTurn(shortestDelta);

      drawShortestAngleBetweenMiniDemo(ctx, size.width, size.height, {
        currentAngle,
        targetAngle,
        shortestDelta,
        longDelta,
        targetAlpha: state.alpha,
      });

      setSnapshot({
        currentAngle,
        targetAngle,
        shortestDelta,
        longDelta,
        targetIndex: state.targetIndex,
      });

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [height]);

  return (
    <div className="mini-demo mini-demo--geometry">
      <div className="mini-demo__call">
        <code>
          shortestAngleBetween({fmt(snapshot.currentAngle)} rad, {fmt(snapshot.targetAngle)} rad) ={" "}
          <span className="mini-demo__result">{fmt(snapshot.shortestDelta)} rad</span>
        </code>
      </div>

      <div className="mini-demo__geometry-readout">
        <div>
          <span className="mini-demo__readout-label">current heading</span>
          <code>{fmtDeg(snapshot.currentAngle)}° fixed</code>
        </div>
        <div>
          <span className="mini-demo__readout-label">target</span>
          <code>dot #{snapshot.targetIndex + 1} at {fmtDeg(snapshot.targetAngle)}°</code>
        </div>
        <div className="mini-demo__touching is-live">
          <span className="mini-demo__readout-label">instruction</span>
          <code>{fmtSignedDeg(snapshot.shortestDelta)}° {snapshot.shortestDelta >= 0 ? "(turn CCW)" : "(turn CW)"}</code>
        </div>
      </div>

      <p className="mini-demo__hint">
        This demo does not rotate the needle. It compares both possible turns to the target, dims the long way,
        and highlights the signed shortest instruction your steering code should use.
      </p>

      <canvas
        ref={canvasRef}
        className="mini-demo__canvas"
        style={{ height }}
        aria-label="shortestAngleBetween turn choice demo"
      />
    </div>
  );
}

function drawShortestAngleBetweenMiniDemo(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: {
    currentAngle: number;
    targetAngle: number;
    shortestDelta: number;
    longDelta: number;
    targetAlpha: number;
  },
) {
  const center = { x: Math.round(width * 0.52), y: Math.round(height * 0.52) };
  const compassRadius = Math.min(82, Math.round(width * 0.16), Math.round(height * 0.28));
  const target = {
    x: center.x + Math.cos(frame.targetAngle) * TARGET_RADIUS,
    y: center.y + Math.sin(frame.targetAngle) * TARGET_RADIUS,
  };

  ctx.clearRect(0, 0, width, height);
  drawBackdrop(ctx, width, height);
  drawCompassRose(ctx, center.x, center.y, compassRadius);
  drawArc(ctx, center.x, center.y, compassRadius + 16, frame.currentAngle, frame.longDelta, "rgba(255,255,255,0.18)", 3);
  drawArc(ctx, center.x, center.y, compassRadius + 16, frame.currentAngle, frame.shortestDelta, "rgba(249, 115, 22, 0.92)", 5);
  drawTargetLine(ctx, center.x, center.y, target.x, target.y, frame.targetAlpha);
  drawNeedle(ctx, center.x, center.y, compassRadius - 8, frame.currentAngle);
  drawTarget(ctx, target.x, target.y, frame.targetAlpha);
  drawLegend(ctx, width, height, frame);
}

function drawBackdrop(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "rgba(14, 165, 233, 0.12)");
  gradient.addColorStop(1, "rgba(249, 115, 22, 0.08)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawCompassRose(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * (r - 10), cy + Math.sin(angle) * (r - 10));
    ctx.lineTo(cx + Math.cos(angle) * (r + 8), cy + Math.sin(angle) * (r + 8));
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "11px monospace";
  ctx.textAlign = "center";
  ctx.fillText("N", cx, cy - r - 14);
  ctx.fillText("E", cx + r + 16, cy + 4);
  ctx.fillText("S", cx, cy + r + 26);
  ctx.fillText("W", cx - r - 16, cy + 4);
  ctx.textAlign = "left";
}

function drawArc(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  delta: number,
  color: string,
  lineWidth: number,
) {
  if (Math.abs(delta) < 0.01) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, startAngle + delta, delta < 0);
  ctx.stroke();
}

function drawTargetLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, alpha: number) {
  ctx.strokeStyle = `rgba(125, 211, 252, ${0.14 + alpha * 0.22})`;
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawNeedle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, angle: number) {
  const tip = { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  const tail = { x: cx - Math.cos(angle) * (r * 0.28), y: cy - Math.sin(angle) * (r * 0.28) };
  const left = angle + Math.PI * 0.5;
  const right = angle - Math.PI * 0.5;

  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.moveTo(tip.x, tip.y);
  ctx.lineTo(cx + Math.cos(left) * 7, cy + Math.sin(left) * 7);
  ctx.lineTo(tail.x, tail.y);
  ctx.lineTo(cx + Math.cos(right) * 7, cy + Math.sin(right) * 7);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawTarget(ctx: CanvasRenderingContext2D, x: number, y: number, alpha: number) {
  const resolvedAlpha = 0.18 + alpha * 0.42;
  ctx.fillStyle = `rgba(125, 211, 252, ${resolvedAlpha})`;
  ctx.beginPath();
  ctx.arc(x, y, 8 + alpha * 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `rgba(186, 230, 253, ${0.26 + alpha * 0.34})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 16 + alpha * 5, 0, Math.PI * 2);
  ctx.stroke();
}

function drawLegend(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: { currentAngle: number; targetAngle: number; shortestDelta: number; longDelta: number },
) {
  ctx.fillStyle = "rgba(15, 23, 42, 0.68)";
  ctx.fillRect(12, 12, Math.min(285, width - 24), 56);
  ctx.fillStyle = "rgba(255,255,255,0.84)";
  ctx.font = "12px monospace";
  ctx.fillText(`from ${fmtDeg(frame.currentAngle)}° to ${fmtDeg(frame.targetAngle)}°`, 22, 33);
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.fillText(`long ${fmtSignedDeg(frame.longDelta)}°   shortest ${fmtSignedDeg(frame.shortestDelta)}°`, 22, 52);
  ctx.fillStyle = "rgba(255,255,255,0.48)";
  ctx.fillText("orange = chosen turn, gray = rejected turn", 22, height - 14);
}

function longestTurn(shortestDelta: number): number {
  return shortestDelta >= 0 ? shortestDelta - Math.PI * 2 : shortestDelta + Math.PI * 2;
}

function fitCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, height: number) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || 480;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height };
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function fmt(n: number): string {
  return (Math.round(n * 100) / 100).toFixed(2);
}

function fmtDeg(rad: number): string {
  return `${Math.round(toDeg(rad))}°`;
}

function fmtSignedDeg(rad: number): string {
  const deg = Math.round(toDeg(rad));
  return `${deg >= 0 ? "+" : ""}${deg}°`;
}
