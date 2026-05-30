import AnimationBaseClass from "../AnimationBaseClass";
import { QuadraticBezier } from "../../formulas/animation/QuadraticBezier";
import { Point } from "../../../types/shapes";

type HandleKey = "p0" | "p1" | "p2";

const HANDLE_RADIUS = 14;
const HIT_SLOP      = 6;   // extra px around each handle for easier grabbing

class QuadraticBezierAnimation extends AnimationBaseClass {
  static t = "quadratic bezier curve";
  static l = "quadratic-bezier-curve";
  static f = QuadraticBezier;
  title = "quadratic bezier curve";
  animationObject = QuadraticBezier;

  p0: Point = { x: 0, y: 0 };
  p1: Point = { x: 0, y: 0 };  // control point
  p2: Point = { x: 0, y: 0 };
  dragTarget: HandleKey | null = null;

  init() {
    this.p0 = { x: this.canvasWidth  * 0.15, y: this.canvasHeight * 0.72 };
    this.p1 = { x: this.halfWidth,            y: this.canvasHeight * 0.12 };
    this.p2 = { x: this.canvasWidth  * 0.85, y: this.canvasHeight * 0.72 };

    if (this.textDiv) {
      this.textDiv.innerHTML =
        "<h3>Drag any of the three handles to reshape the curve. P1 is the control point that pulls the curve off the straight line between P0 and P2.</h3>";
    }
    this.draw();
  }

  draw = () => {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // ── Dashed control polygon  P0 → P1 → P2 ──────────────────────────────
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth   = 1.2;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(this.p0.x, this.p0.y);
    ctx.lineTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
    ctx.restore();

    // ── Bezier curve (100 steps) ──────────────────────────────────────────
    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth   = 3;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const pt = QuadraticBezier.keyFunction(i / 100, this.p0, this.p1, this.p2) as Point;
      i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    // ── Moving dot (oscillates along the curve) ───────────────────────────
    const tDot  = (Math.sin(Date.now() * 0.0009) + 1) / 2;
    const dotPt = QuadraticBezier.keyFunction(tDot, this.p0, this.p1, this.p2) as Point;

    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.arc(dotPt.x, dotPt.y, 7, 0, Math.PI * 2);
    ctx.fill();

    // ── Handles ───────────────────────────────────────────────────────────
    const handles: { key: HandleKey; pt: Point; label: string; color: string }[] = [
      { key: "p0", pt: this.p0, label: "P0",          color: "#34d399" },
      { key: "p1", pt: this.p1, label: "P1 (control)", color: "#f472b6" },
      { key: "p2", pt: this.p2, label: "P2",           color: "#34d399" },
    ];

    ctx.font      = "bold 10px monospace";
    ctx.textAlign = "center";

    handles.forEach(({ key, pt, label, color }) => {
      // Glow on active drag
      if (this.dragTarget === key) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle   = color;
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
      ctx.font      = "10px monospace";
      ctx.fillText(label, pt.x, pt.y + HANDLE_RADIUS + 14);
      ctx.font      = "bold 10px monospace";
    });

    ctx.textAlign = "left";
    requestAnimationFrame(this.draw);
  };

  private hitTest(x: number, y: number): HandleKey | null {
    const order: HandleKey[] = ["p1", "p0", "p2"]; // control point takes priority
    for (const key of order) {
      const pt = this[key] as Point;
      const dx = pt.x - x, dy = pt.y - y;
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

export default QuadraticBezierAnimation;
