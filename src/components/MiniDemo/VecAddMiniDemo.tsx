import { useEffect, useRef, useState } from "react";
import { vecAdd } from "@utilspalooza/core/Vec2";
import "./MiniDemo.scss";

type Vector = { x: number; y: number };

interface VecAddMiniDemoProps {
  height?: number;
}

function transformPoint(point: Vector, scale: number, offset: Vector): Vector {
  return {
    x: point.x * scale + offset.x,
    y: point.y * scale + offset.y,
  };
}

export default function VecAddMiniDemo({ height = 220 }: VecAddMiniDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [moveX, setMoveX] = useState(62);
  const [moveY, setMoveY] = useState(-18);
  const [windX, setWindX] = useState(28);
  const [windY, setWindY] = useState(34);

  const move = { x: moveX, y: moveY };
  const wind = { x: windX, y: windY };
  const result = vecAdd(move, wind);

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

    const drawArrow = (from: Vector, to: Vector, color: string, label: string, labelDx = 8, labelDy = -6) => {
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      const head = 9;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(to.x, to.y);
      ctx.lineTo(to.x - head * Math.cos(angle - Math.PI / 6), to.y - head * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(to.x - head * Math.cos(angle + Math.PI / 6), to.y - head * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
      ctx.font = "12px Space Mono, monospace";
      ctx.fillText(label, to.x + labelDx, to.y + labelDy);
      ctx.restore();
    };

    const lerpPoint = (a: Vector, b: Vector, t: number): Vector => ({
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
    });

    const drawPill = (x: number, y: number, text: string) => {
      ctx.save();
      ctx.font = "12px Space Mono, monospace";
      const width = ctx.measureText(text).width + 16;
      ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
      ctx.fillRect(x, y, width, 22);
      ctx.strokeStyle = "rgba(255,255,255,0.16)";
      ctx.strokeRect(x, y, width, 22);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillText(text, x + 8, y + 15);
      ctx.restore();
    };

    const drawLegend = (x: number, y: number, lines: string[]) => {
      ctx.save();
      ctx.font = "12px Space Mono, monospace";
      const width = Math.max(...lines.map((line) => ctx.measureText(line).width)) + 20;
      const lineHeight = 18;
      const height = 14 + lines.length * lineHeight;
      ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
      ctx.fillRect(x, y, width, height);
      ctx.strokeStyle = "rgba(255,255,255,0.16)";
      ctx.strokeRect(x, y, width, height);
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      lines.forEach((line, index) => {
        ctx.fillText(line, x + 10, y + 18 + index * lineHeight);
      });
      ctx.restore();
    };

    let raf = 0;
    let progress = 0;
    let holdFrames = 0;
    let holding = false;
    const step = 1 / (60 * 2.6);

    const loop = () => {
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

      const rawOrigin = { x: 0, y: 0 };
      const rawAfterMove = { x: move.x, y: move.y };
      const rawFinal = vecAdd(move, wind);
      const rawWindHitPoint = {
        x: move.x * 0.38,
        y: move.y * 0.38,
      };
      const rawWindPreviewEnd = {
        x: rawWindHitPoint.x + wind.x,
        y: rawWindHitPoint.y + wind.y,
      };

      const boundsPoints = [rawOrigin, rawAfterMove, rawFinal, rawWindHitPoint, rawWindPreviewEnd];
      const minX = Math.min(...boundsPoints.map((point) => point.x));
      const maxX = Math.max(...boundsPoints.map((point) => point.x));
      const minY = Math.min(...boundsPoints.map((point) => point.y));
      const maxY = Math.max(...boundsPoints.map((point) => point.y));
      const spanX = Math.max(1, maxX - minX);
      const spanY = Math.max(1, maxY - minY);
      const padLeft = 24;
      const padRight = 28;
      const padTop = 82;
      const padBottom = 26;
      const drawWidth = Math.max(40, size.w - padLeft - padRight);
      const drawHeight = Math.max(40, size.h - padTop - padBottom);
      const scale = Math.min(drawWidth / spanX, drawHeight / spanY) * 0.9;
      const offset = {
        x: padLeft + (drawWidth - spanX * scale) / 2 - minX * scale,
        y: padTop + (drawHeight - spanY * scale) / 2 - minY * scale,
      };

      const origin = transformPoint(rawOrigin, scale, offset);
      const afterMove = transformPoint(rawAfterMove, scale, offset);
      const final = transformPoint(rawFinal, scale, offset);
      const windHitPoint = transformPoint(rawWindHitPoint, scale, offset);
      const windPreviewEnd = transformPoint(rawWindPreviewEnd, scale, offset);
      const mover =
        progress < 0.42
          ? lerpPoint(origin, windHitPoint, progress / 0.42)
          : lerpPoint(windHitPoint, final, (progress - 0.42) / 0.58);

      ctx.clearRect(0, 0, size.w, size.h);

      const bg = ctx.createLinearGradient(0, 0, size.w, size.h);
      bg.addColorStop(0, "rgba(99, 102, 241, 0.08)");
      bg.addColorStop(1, "rgba(14, 165, 233, 0.08)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size.w, size.h);

      drawPill(Math.max(8, origin.x - 10), Math.min(size.h - 28, origin.y + 14), "start");
      drawPill(
        Math.min(size.w - 118, Math.max(12, final.x - 44)),
        Math.min(size.h - 28, final.y + 16),
        "actual position",
      );

      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(windHitPoint.x, windHitPoint.y);
      ctx.lineTo(final.x, final.y);
      ctx.stroke();
      ctx.setLineDash([]);

      drawArrow(origin, afterMove, "#818cf8", "move", 8, -12);
      drawArrow(windHitPoint, windPreviewEnd, "#22d3ee", "wind", 8, 16);
      drawArrow(origin, final, "#f97316", "combined", 8, -10);

      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.arc(origin.x, origin.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(afterMove.x, afterMove.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(final.x, final.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(windHitPoint.x, windHitPoint.y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(34,211,238,0.45)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(windHitPoint.x, windHitPoint.y, 12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowColor = "rgba(15, 23, 42, 0.45)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.arc(mover.x, mover.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      drawLegend(12, 12, [
        "purple = intended move",
        "blue = wind push",
        "orange = combined result",
        "wind starts at the cyan ring",
      ]);

      raf = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [height, move.x, move.y, result.x, result.y]);

  return (
    <div className="mini-demo mini-demo--geometry">
      <div className="mini-demo__call">
        <code>
          vecAdd({fmtVec(move)}, {fmtVec(wind)}) = <span className="mini-demo__result">{fmtVec(result)}</span>
        </code>
      </div>
      <div className="mini-demo__geometry-readout">
        <div>
          <span className="mini-demo__readout-label">player move</span>
          <code>{fmtVec(move)}</code>
        </div>
        <div>
          <span className="mini-demo__readout-label">wind push</span>
          <code>{fmtVec(wind)}</code>
        </div>
        <div className="mini-demo__touching is-live">
          <span className="mini-demo__readout-label">actual travel</span>
          <code>{fmtVec(result)}</code>
        </div>
      </div>
      <p className="mini-demo__hint">
        `vecAdd` combines influences into one final displacement. Here the dot starts along its own movement,
        then the wind kicks in at the marked point and bends the trip into the orange result.
      </p>
      <canvas
        ref={canvasRef}
        className="mini-demo__canvas"
        style={{ height }}
        aria-label="Animated vecAdd demo"
      />
      <div className="mini-demo__controls">
        <label className="mini-demo__control">
          <span className="mini-demo__control-name">move x</span>
          <input type="range" min={-90} max={90} step={1} value={moveX} onChange={(e) => setMoveX(Number(e.target.value))} />
          <span className="mini-demo__control-val">{moveX}</span>
        </label>
        <label className="mini-demo__control">
          <span className="mini-demo__control-name">move y</span>
          <input type="range" min={-90} max={90} step={1} value={moveY} onChange={(e) => setMoveY(Number(e.target.value))} />
          <span className="mini-demo__control-val">{moveY}</span>
        </label>
        <label className="mini-demo__control">
          <span className="mini-demo__control-name">wind x</span>
          <input type="range" min={-90} max={90} step={1} value={windX} onChange={(e) => setWindX(Number(e.target.value))} />
          <span className="mini-demo__control-val">{windX}</span>
        </label>
        <label className="mini-demo__control">
          <span className="mini-demo__control-name">wind y</span>
          <input type="range" min={-90} max={90} step={1} value={windY} onChange={(e) => setWindY(Number(e.target.value))} />
          <span className="mini-demo__control-val">{windY}</span>
        </label>
      </div>
    </div>
  );
}

function fmtVec(v: Vector): string {
  return `{ x: ${v.x}, y: ${v.y} }`;
}
