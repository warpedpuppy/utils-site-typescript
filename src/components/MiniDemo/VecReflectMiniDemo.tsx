import { useEffect, useRef, useState } from "react";
import { vecNormalize, vecPerpendicular, vecReflect } from "@utilspalooza/core/Vec2";
import { MotionToggle, useMotionGate } from "./useMotionGate";
import "./MiniDemo.scss";

type Vector = { x: number; y: number };

interface VecReflectMiniDemoProps {
  height?: number;
}

const INCOMING = vecNormalize({ x: 1, y: 0.42 });
const GUIDE_LENGTH = 120;

export default function VecReflectMiniDemo({ height = 220 }: VecReflectMiniDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { playing, playingRef, setPlaying } = useMotionGate();
  const [wallAngle, setWallAngle] = useState(-0.52);

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
      return { w: cssW, h: height };
    };

    let size = fit();
    const onResize = () => {
      size = fit();
    };
    window.addEventListener("resize", onResize);

    const drawArrow = (from: Vector, to: Vector, color: string, dashed = false) => {
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      const head = 9;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.5;
      if (dashed) ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(to.x, to.y);
      ctx.lineTo(to.x - head * Math.cos(angle - Math.PI / 6), to.y - head * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(to.x - head * Math.cos(angle + Math.PI / 6), to.y - head * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    let raf = 0;
    let progress = 0;
    let holdFrames = 0;
    let holding = false;
    const step = 1 / (60 * 2.5);

    const loop = () => {
      // Motion gate: progress only advances while playing; the frame still
      // draws so slider changes and resizes stay visible.
      if (playingRef.current) {
        if (holding) {
          holdFrames -= 1;
          if (holdFrames <= 0) {
            holding = false;
            progress = 0;
          }
        } else {
          progress += step;
          if (progress >= 1) {
            progress = 1;
            holding = true;
            holdFrames = 24;
          }
        }
      }

      const wallDir = { x: Math.cos(wallAngle), y: Math.sin(wallAngle) };
      const normal = vecNormalize(vecPerpendicular(wallDir));
      const reflected = vecReflect(INCOMING, normal);
      const contact = { x: size.w * 0.54, y: size.h * 0.58 };
      const wallExtent = Math.max(size.w, size.h);
      const start = {
        x: contact.x - INCOMING.x * GUIDE_LENGTH,
        y: contact.y - INCOMING.y * GUIDE_LENGTH,
      };
      const end = {
        x: contact.x + reflected.x * GUIDE_LENGTH,
        y: contact.y + reflected.y * GUIDE_LENGTH,
      };
      const puck =
        progress < 0.5
          ? {
              x: start.x + (contact.x - start.x) * (progress / 0.5),
              y: start.y + (contact.y - start.y) * (progress / 0.5),
            }
          : {
              x: contact.x + (end.x - contact.x) * ((progress - 0.5) / 0.5),
              y: contact.y + (end.y - contact.y) * ((progress - 0.5) / 0.5),
            };

      ctx.clearRect(0, 0, size.w, size.h);

      const bg = ctx.createLinearGradient(0, 0, size.w, size.h);
      bg.addColorStop(0, "rgba(14, 165, 233, 0.08)");
      bg.addColorStop(1, "rgba(249, 115, 22, 0.08)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size.w, size.h);

      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(contact.x - wallDir.x * wallExtent, contact.y - wallDir.y * wallExtent);
      ctx.lineTo(contact.x + wallDir.x * wallExtent, contact.y + wallDir.y * wallExtent);
      ctx.stroke();

      drawArrow(start, contact, "rgba(249,115,22,0.9)", true);
      drawArrow(contact, end, "rgba(99,102,241,0.95)", true);
      drawArrow(
        contact,
        { x: contact.x + normal.x * 58, y: contact.y + normal.y * 58 },
        "rgba(52,211,153,0.95)",
        true,
      );

      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.arc(contact.x, contact.y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = progress < 0.5 ? "#f97316" : "#6366f1";
      ctx.shadowColor = "rgba(15, 23, 42, 0.45)";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(puck.x, puck.y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "rgba(248,250,252,0.88)";
      ctx.font = "12px Space Mono, monospace";
      ctx.fillText("incoming", start.x - 8, start.y - 8);
      ctx.fillText("reflected", end.x + 8, end.y + 14);
      ctx.fillText("normal", contact.x + normal.x * 62 + 6, contact.y + normal.y * 62);

      raf = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [height, wallAngle]);

  const normal = vecNormalize(vecPerpendicular({ x: Math.cos(wallAngle), y: Math.sin(wallAngle) }));
  const reflected = vecReflect(INCOMING, normal);

  return (
    <div className="mini-demo mini-demo--geometry">
      <div className="mini-demo__call">
        <code>
          vecReflect({fmtVec(INCOMING)}, {fmtVec(normal)}) = <span className="mini-demo__result">{fmtVec(reflected)}</span>
        </code>
      </div>
      <div className="mini-demo__geometry-readout">
        <div>
          <span className="mini-demo__readout-label">incoming velocity</span>
          <code>{fmtVec(INCOMING)}</code>
        </div>
        <div>
          <span className="mini-demo__readout-label">surface normal</span>
          <code>{fmtVec(normal)}</code>
        </div>
        <div>
          <span className="mini-demo__readout-label">wall angle</span>
          <code>{fmtDeg(wallAngle)}</code>
        </div>
        <div className="mini-demo__touching is-live">
          <span className="mini-demo__readout-label">bounce result</span>
          <code>{fmtVec(reflected)}</code>
        </div>
      </div>
      <p className="mini-demo__hint">
        The orange puck always arrives with the same velocity. Change the wall angle and the green normal changes,
        so <code>vecReflect</code> sends the puck out along a new ricochet path.
      </p>
      <canvas
        ref={canvasRef}
        className="mini-demo__canvas"
        style={{ height }}
        aria-label="Animated vecReflect demo"
      />
      <MotionToggle playing={playing} setPlaying={setPlaying} />
      <div className="mini-demo__controls">
        <label className="mini-demo__control">
          <span className="mini-demo__control-name">wall angle</span>
          <input
            type="range"
            min={-1.2}
            max={1.2}
            step={0.01}
            value={wallAngle}
            onChange={(e) => setWallAngle(Number(e.target.value))}
          />
          <span className="mini-demo__control-val">{fmtDeg(wallAngle)}</span>
        </label>
      </div>
    </div>
  );
}

function fmt(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return rounded.toFixed(2);
}

function fmtVec(v: Vector): string {
  return `{ x: ${fmt(v.x)}, y: ${fmt(v.y)} }`;
}

function fmtDeg(radians: number): string {
  return `${Math.round((radians * 180) / Math.PI)}°`;
}
