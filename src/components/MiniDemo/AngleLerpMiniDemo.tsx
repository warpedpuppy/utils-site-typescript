import { useEffect, useRef, useState } from "react";
import { lerpAngle, shortestAngleBetween } from "@utilspalooza/core/AngleInterpolation";
import "./MiniDemo.scss";

interface AngleLerpMiniDemoProps {
  height?: number;
}

interface DemoSnapshot {
  previousAngle: number;
  currentAngle: number;
  targetAngle: number;
  rawDelta: number;
  shortestDelta: number;
  targetIndex: number;
  blend: number;
}

const TARGET_SEQUENCE_DEG = [350, 18, 214, 332, 76, 288];
const TARGET_HOLD_MS = 1500;
const TARGET_FADE_MS = 420;
const TARGET_RADIUS = 92;

export default function AngleLerpMiniDemo({ height = 248 }: AngleLerpMiniDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({
    currentAngle: toRad(350),
    targetAngle: toRad(TARGET_SEQUENCE_DEG[0]),
    targetIndex: 0,
    enteredAt: 0,
    alpha: 0,
  });
  const [snapshot, setSnapshot] = useState<DemoSnapshot>(() => {
    const currentAngle = toRad(350);
    const targetAngle = toRad(TARGET_SEQUENCE_DEG[0]);
    return {
      previousAngle: currentAngle,
      currentAngle,
      targetAngle,
      rawDelta: targetAngle - currentAngle,
      shortestDelta: shortestAngleBetween(currentAngle, targetAngle),
      targetIndex: 0,
      blend: 0,
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
    let lastTime = 0;

    const loop = (now: number) => {
      if (!lastTime) {
        lastTime = now;
        stateRef.current.enteredAt = now;
      }
      const dt = Math.min(40, now - lastTime);
      lastTime = now;

      const state = stateRef.current;
      const phaseElapsed = now - state.enteredAt;
      if (phaseElapsed >= TARGET_HOLD_MS) {
        const nextIndex = (state.targetIndex + 1) % TARGET_SEQUENCE_DEG.length;
        state.targetIndex = nextIndex;
        state.targetAngle = toRad(TARGET_SEQUENCE_DEG[nextIndex]);
        state.enteredAt = now;
      }

      state.alpha = clamp01((now - state.enteredAt) / TARGET_FADE_MS);
      const smoothing = 1 - Math.exp(-dt / 260);
      const previousAngle = state.currentAngle;
      state.currentAngle = lerpAngle(state.currentAngle, state.targetAngle, smoothing);

      const rawDelta = state.targetAngle - state.currentAngle;
      const shortestDelta = shortestAngleBetween(state.currentAngle, state.targetAngle);
      drawAngleLerpMiniDemo(ctx, size.width, size.height, {
        currentAngle: state.currentAngle,
        targetAngle: state.targetAngle,
        targetAlpha: state.alpha,
        targetIndex: state.targetIndex,
        rawDelta,
        shortestDelta,
      });

      setSnapshot({
        previousAngle,
        currentAngle: state.currentAngle,
        targetAngle: state.targetAngle,
        rawDelta,
        shortestDelta,
        targetIndex: state.targetIndex,
        blend: smoothing,
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
          lerpAngle({fmt(snapshot.previousAngle)} rad, {fmt(snapshot.targetAngle)} rad, {fmt(snapshot.blend)}) ={" "}
          <span className="mini-demo__result">{fmt(snapshot.currentAngle)} rad</span>
        </code>
      </div>

      <div className="mini-demo__geometry-readout">
        <div>
          <span className="mini-demo__readout-label">target</span>
          <code>dot #{snapshot.targetIndex + 1} at {fmtDeg(snapshot.targetAngle)}°</code>
        </div>
        <div>
          <span className="mini-demo__readout-label">naive turn</span>
          <code>{fmtSignedDeg(snapshot.rawDelta)}° if you just subtract angles</code>
        </div>
        <div className="mini-demo__touching is-live">
          <span className="mini-demo__readout-label">shortest turn</span>
          <code>{fmtSignedDeg(snapshot.shortestDelta)}° is the turn the needle actually takes</code>
        </div>
      </div>

      <p className="mini-demo__hint">
        A target fades in, the compass retargets, then the target hops elsewhere. The orange arc is the turn
        `lerpAngle` follows. When the target crosses the `0°/360°` seam, this avoids the ugly long spin.
      </p>

      <canvas
        ref={canvasRef}
        className="mini-demo__canvas"
        style={{ height }}
        aria-label="lerpAngle compass retargeting demo"
      />
    </div>
  );
}

function drawAngleLerpMiniDemo(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: {
    currentAngle: number;
    targetAngle: number;
    targetAlpha: number;
    targetIndex: number;
    rawDelta: number;
    shortestDelta: number;
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
  drawShortestArc(ctx, center.x, center.y, compassRadius + 18, frame.currentAngle, frame.shortestDelta);
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

function drawShortestArc(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  shortestDelta: number,
) {
  if (Math.abs(shortestDelta) < 0.01) return;
  ctx.strokeStyle = "rgba(249, 115, 22, 0.9)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, startAngle + shortestDelta, shortestDelta < 0);
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
  frame: { currentAngle: number; targetAngle: number; rawDelta: number; shortestDelta: number },
) {
  ctx.fillStyle = "rgba(15, 23, 42, 0.68)";
  ctx.fillRect(12, 12, Math.min(260, width - 24), 56);
  ctx.fillStyle = "rgba(255,255,255,0.84)";
  ctx.font = "12px monospace";
  ctx.fillText(`needle ${fmtDeg(frame.currentAngle)}°  →  target ${fmtDeg(frame.targetAngle)}°`, 22, 33);
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.fillText(`raw ${fmtSignedDeg(frame.rawDelta)}°   shortest ${fmtSignedDeg(frame.shortestDelta)}°`, 22, 52);
  ctx.fillStyle = "rgba(255,255,255,0.48)";
  ctx.fillText("Watch the seam-crossing jumps near north.", 22, height - 14);
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
