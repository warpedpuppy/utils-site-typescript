import AnimationBaseClass from "./AnimationBaseClass";
import { quadraticBezier } from "@utilspalooza/core/QuadraticBezier";
import { quadraticBezier as quadraticBezierFormula } from "../pages/createJSON/formulas/animation/QuadraticBezier";
import { Point } from "../types/shapes";

type HandleKey = "p0" | "p1" | "p2";

const HANDLE_RADIUS = 14;
const HIT_SLOP = 6; // extra px around each handle for easier grabbing

function drawQuadraticBezier(
  ctx: CanvasRenderingContext2D,
  p0: Point,
  p1: Point,
  p2: Point,
  dragTarget: HandleKey | null,
  quadraticBezierFn: (percentage: number, startPoint: Point, controlPoint: Point, endPoint: Point) => Point
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // ── Dashed control polygon  P0 → P1 → P2 ──────────────────────────────
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1.2;
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
  ctx.restore();

  // ── Bezier curve (100 steps) ──────────────────────────────────────────
  ctx.strokeStyle = "#818cf8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 100; i++) {
    const pt = quadraticBezierFn(i / 100, p0, p1, p2) as Point;
    i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
  }
  ctx.stroke();

  // ── Moving dot (oscillates along the curve) ───────────────────────────
  const tDot = (Math.sin(Date.now() * 0.0009) + 1) / 2;
  const dotPt = quadraticBezierFn(tDot, p0, p1, p2) as Point;

  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.arc(dotPt.x, dotPt.y, 7, 0, Math.PI * 2);
  ctx.fill();

  // ── Handles ───────────────────────────────────────────────────────────
  const handles: { key: HandleKey; pt: Point; label: string; color: string }[] = [
    { key: "p0", pt: p0, label: "P0", color: "#34d399" },
    { key: "p1", pt: p1, label: "P1 (control)", color: "#f472b6" },
    { key: "p2", pt: p2, label: "P2", color: "#34d399" },
  ];

  ctx.font = "bold 10px monospace";
  ctx.textAlign = "center";

  handles.forEach(({ key, pt, label, color }) => {
    // Glow on active drag
    if (dragTarget === key) {
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, HANDLE_RADIUS * 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, HANDLE_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Label inside handle
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillText(label.length > 2 ? "P1" : label, pt.x, pt.y + 4);

    // Full label below
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "10px monospace";
    ctx.fillText(label, pt.x, pt.y + HANDLE_RADIUS + 14);
    ctx.font = "bold 10px monospace";
  });

  ctx.textAlign = "left";
}

export { drawQuadraticBezier };

export default class QuadraticBezierAnimation extends AnimationBaseClass {
  static t = "quadratic bezier curve";
  static l = "quadratic-bezier-curve";
  static f = quadraticBezierFormula;
  title = "quadratic bezier curve";
  animationObject = quadraticBezierFormula;

  p0: Point = { x: 0, y: 0 };
  p1: Point = { x: 0, y: 0 }; // control point
  p2: Point = { x: 0, y: 0 };
  dragTarget: HandleKey | null = null;

  init() {
    this.p0 = { x: this.canvasWidth * 0.15, y: this.canvasHeight * 0.72 };
    this.p1 = { x: this.halfWidth, y: this.canvasHeight * 0.12 };
    this.p2 = { x: this.canvasWidth * 0.85, y: this.canvasHeight * 0.72 };

    if (this.textDiv) {
      this.textDiv.innerHTML =
        "<h3>Drag any of the three handles to reshape the curve. P1 is the control point that pulls the curve off the straight line between P0 and P2.</h3>";
    }
    this.draw();
  }

  draw = () => {
    if (!this.ctx) return;
    drawQuadraticBezier(
      this.ctx,
      this.p0,
      this.p1,
      this.p2,
      this.dragTarget,
      quadraticBezier
    );
    this.raf(this.draw);
  };

  private hitTest(x: number, y: number): HandleKey | null {
    const order: HandleKey[] = ["p1", "p0", "p2"]; // control point takes priority
    for (const key of order) {
      const pt = this[key] as Point;
      const dx = pt.x - x,
        dy = pt.y - y;
      if (Math.sqrt(dx * dx + dy * dy) <= HANDLE_RADIUS + HIT_SLOP) return key;
    }
    return null;
  }

  pointerDownHandler(e: PointerEvent) {
    this.dragTarget = this.hitTest(e.pageX - this.left, e.pageY - this.top);
  }

  pointerMoveHandler(e: PointerEvent) {
    if (!this.dragTarget) return;
    (this[this.dragTarget] as Point).x = e.pageX - this.left;
    (this[this.dragTarget] as Point).y = e.pageY - this.top;
  }

  pointerUpHandler(_e: PointerEvent) {
    this.dragTarget = null;
  }
}
