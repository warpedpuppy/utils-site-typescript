import { useEffect, useRef, useState } from "react";
import { wrapAngle } from "@utilspalooza/core/AngleInterpolation";
import "./MiniDemo.scss";

interface WrapAngleMiniDemoProps {
  height?: number;
}

interface DemoSnapshot {
  rawAngle: number;
  wrappedAngle: number;
  turns: number;
}

export default function WrapAngleMiniDemo({ height = 248 }: WrapAngleMiniDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rawAngleRef = useRef(0);
  const [snapshot, setSnapshot] = useState<DemoSnapshot>({
    rawAngle: 0,
    wrappedAngle: 0,
    turns: 0,
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
      if (!lastTime) lastTime = now;
      const dt = Math.min(40, now - lastTime);
      lastTime = now;

      rawAngleRef.current += dt * 0.00135;
      const rawAngle = rawAngleRef.current;
      const wrappedAngle = wrapAngle(rawAngle);
      const turns = rawAngle / (Math.PI * 2);

      drawWrapAngleMiniDemo(ctx, size.width, size.height, { rawAngle, wrappedAngle });
      setSnapshot({ rawAngle, wrappedAngle, turns });
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
          wrapAngle({fmt(snapshot.rawAngle)} rad) = <span className="mini-demo__result">{fmt(snapshot.wrappedAngle)} rad</span>
        </code>
      </div>

      <div className="mini-demo__geometry-readout">
        <div>
          <span className="mini-demo__readout-label">without wrapAngle</span>
          <code>{fmtDeg(snapshot.rawAngle)}° and still climbing</code>
        </div>
        <div className="mini-demo__touching is-live">
          <span className="mini-demo__readout-label">with wrapAngle</span>
          <code>{fmtSignedDeg(snapshot.wrappedAngle)}° kept in the -180° to 180° range</code>
        </div>
        <div>
          <span className="mini-demo__readout-label">full turns</span>
          <code>{fmt(snapshot.turns)} rotations so far</code>
        </div>
      </div>

      <p className="mini-demo__hint">
        The needle keeps spinning forever, but the wrapped value stays equivalent and tidy. Watch the bottom readout
        jump from about <code>+180°</code> to <code>-180°</code> instead of growing to <code>540°</code>, <code>900°</code>, and beyond.
      </p>

      <canvas
        ref={canvasRef}
        className="mini-demo__canvas"
        style={{ height }}
        aria-label="wrapAngle spinning normalization demo"
      />
    </div>
  );
}

function drawWrapAngleMiniDemo(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: { rawAngle: number; wrappedAngle: number },
) {
  const center = { x: Math.round(width * 0.52), y: Math.round(height * 0.52) };
  const compassRadius = Math.min(82, Math.round(width * 0.16), Math.round(height * 0.28));

  ctx.clearRect(0, 0, width, height);
  drawBackdrop(ctx, width, height);
  drawCompassRose(ctx, center.x, center.y, compassRadius);
  drawWrapBand(ctx, center.x, center.y, compassRadius + 17);
  drawNeedle(ctx, center.x, center.y, compassRadius - 8, frame.wrappedAngle);
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

function drawWrapBand(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.strokeStyle = "rgba(125, 211, 252, 0.28)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI, Math.PI);
  ctx.stroke();

  ctx.fillStyle = "rgba(186, 230, 253, 0.72)";
  ctx.font = "11px monospace";
  ctx.textAlign = "center";
  ctx.fillText("-180°", cx, cy + r + 20);
  ctx.fillText("+180°", cx, cy - r - 20);
  ctx.textAlign = "left";
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

function drawLegend(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: { rawAngle: number; wrappedAngle: number },
) {
  ctx.fillStyle = "rgba(15, 23, 42, 0.68)";
  ctx.fillRect(12, 12, Math.min(292, width - 24), 56);
  ctx.fillStyle = "rgba(255,255,255,0.84)";
  ctx.font = "12px monospace";
  ctx.fillText(`raw: ${fmtDeg(frame.rawAngle)}°`, 22, 33);
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.fillText(`wrapped: ${fmtSignedDeg(frame.wrappedAngle)}°`, 22, 52);
  ctx.fillStyle = "rgba(255,255,255,0.48)";
  ctx.fillText("same direction, tidier number", 22, height - 14);
}

function fitCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, height: number) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || 480;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height };
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function fmt(n: number): string {
  return (Math.round(n * 100) / 100).toFixed(2);
}

function fmtDeg(rad: number): string {
  return `${Math.round(toDeg(rad))}`;
}

function fmtSignedDeg(rad: number): string {
  const deg = Math.round(toDeg(rad));
  return `${deg >= 0 ? "+" : ""}${deg}`;
}
