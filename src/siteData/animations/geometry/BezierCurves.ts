import Template from "../animationTemplate";
import { CollisionDetectionObject } from "../../../types/types";

interface Point { x: number; y: number; }

const ELI5 = `〰️ Bézier Curves — What's going on?

A Bézier curve is a smooth curve defined by "control points."
The endpoints (P0, P3) are where the curve starts and ends.
The middle points (P1, P2) are like magnets that pull the curve toward them
without the curve actually touching them.

The math uses something called "lerp" (linear interpolation):
  lerp(A, B, t) = A + t * (B - A)
  When t=0 you're at A. When t=1 you're at B. In between, you're... in between.

The de Casteljau algorithm (what you see animated) works like this:
  1. Draw lines between all control points
  2. Find the midpoint on each line at time t
  3. Connect THOSE midpoints and find THEIR midpoint at t
  4. Keep going until one point remains — that's the curve point at t

As t goes from 0 → 1, that final point traces the entire curve.

Drag the colored dots to reshape the curve in real time.
Real-world uses: font design, SVG paths, CSS animations, game movement paths.`;

interface ControlPoint extends Point {
  dragging: boolean;
  color: string;
}

// de Casteljau's algorithm — returns the interpolated point AND all intermediate levels
function deCasteljau(pts: Point[], t: number): { point: Point; levels: Point[][] } {
  const levels: Point[][] = [pts.map((p) => ({ ...p }))];
  let current = pts.map((p) => ({ ...p }));

  while (current.length > 1) {
    const next: Point[] = [];
    for (let i = 0; i < current.length - 1; i++) {
      next.push({
        x: (1 - t) * current[i].x + t * current[i + 1].x,
        y: (1 - t) * current[i].y + t * current[i + 1].y,
      });
    }
    levels.push(next);
    current = next;
  }
  return { point: current[0], levels };
}

const BezierFormula: CollisionDetectionObject = {
  keyFunction: deCasteljau,
  functionString: `function deCasteljau(pts: Point[], t: number): { point: Point; levels: Point[][] } {
  const levels: Point[][] = [pts.map(p => ({ ...p }))];
  let current = pts.map(p => ({ ...p }));
  while (current.length > 1) {
    const next: Point[] = [];
    for (let i = 0; i < current.length - 1; i++) {
      next.push({
        x: (1 - t) * current[i].x + t * current[i + 1].x,
        y: (1 - t) * current[i].y + t * current[i + 1].y,
      });
    }
    levels.push(next);
    current = next;
  }
  return { point: current[0], levels };
}`,
    dependencies: [],
};

class BezierCurves extends Template {
  static t = "Bézier curves";
  static l = "bezier-curves";
  static f = BezierFormula;
  title = "Bézier curves";

  animationObject = BezierFormula;

  controlPoints: ControlPoint[] = [];
  animT: number = 0;
  animDir: number = 1;
  animId: number = 0;
  dragIndex: number = -1;
  POINT_RADIUS = 10;
  controlsDiv: HTMLDivElement | null = null;
  infoPanel: HTMLDivElement | null = null;
  mode: number = 3; // 2=quadratic, 3=cubic, 4=quartic

  keyFunction(controlPoints: Point[], t: number): Point {
    // de Casteljau: lerp between each adjacent pair, recursively, until one point remains
    return deCasteljau(controlPoints, t).point;
  }

  defaultPoints(): ControlPoint[] {
    const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12"];
    if (this.mode === 2) {
      return [
        { x: this.halfWidth - 160, y: this.halfHeight + 80, dragging: false, color: colors[0] },
        { x: this.halfWidth, y: this.halfHeight - 120, dragging: false, color: colors[1] },
        { x: this.halfWidth + 160, y: this.halfHeight + 80, dragging: false, color: colors[2] },
      ];
    }
    if (this.mode === 4) {
      return [
        { x: this.halfWidth - 180, y: this.halfHeight + 80, dragging: false, color: colors[0] },
        { x: this.halfWidth - 80, y: this.halfHeight - 130, dragging: false, color: colors[1] },
        { x: this.halfWidth + 80, y: this.halfHeight - 130, dragging: false, color: colors[2] },
        { x: this.halfWidth + 180, y: this.halfHeight + 80, dragging: false, color: colors[3] },
        { x: this.halfWidth, y: this.halfHeight + 120, dragging: false, color: "#9b59b6" },
      ];
    }
    // cubic (default)
    return [
      { x: this.halfWidth - 160, y: this.halfHeight + 80, dragging: false, color: colors[0] },
      { x: this.halfWidth - 60, y: this.halfHeight - 130, dragging: false, color: colors[1] },
      { x: this.halfWidth + 60, y: this.halfHeight - 130, dragging: false, color: colors[2] },
      { x: this.halfWidth + 160, y: this.halfHeight + 80, dragging: false, color: colors[3] },
    ];
  }

  addControls() {
    if (!this.cont) return;
    this.controlsDiv = document.createElement("div");
    this.controlsDiv.style.cssText =
      "position:absolute;top:8px;left:8px;display:flex;gap:8px;align-items:center;z-index:10;background:rgba(255,255,255,0.85);padding:6px 10px;border-radius:6px;font-family:monospace;font-size:13px;";

    const label = document.createElement("span");
    label.textContent = "degree:";
    this.controlsDiv.appendChild(label);

    [{ n: 2, label: "quadratic" }, { n: 3, label: "cubic" }, { n: 4, label: "quartic" }].forEach(
      ({ n, label: lbl }) => {
        const btn = document.createElement("button");
        btn.textContent = lbl;
        btn.style.cssText =
          "padding:3px 8px;cursor:pointer;border:1px solid #aaa;border-radius:4px;background:#fff;font-family:monospace;font-size:12px;";
        btn.addEventListener("click", () => {
          this.mode = n;
          this.controlPoints = this.defaultPoints();
        });
        this.controlsDiv!.appendChild(btn);
      }
    );

    const hint = document.createElement("span");
    hint.textContent = "drag the colored points";
    hint.style.color = "#666";
    this.controlsDiv.appendChild(hint);

    const makeBtn = (label: string, fn: () => void) => {
      const b = document.createElement("button");
      b.textContent = label;
      b.style.cssText = "padding:3px 8px;cursor:pointer;border:1px solid #aaa;border-radius:4px;background:#fff;font-family:monospace;font-size:12px;";
      b.addEventListener("click", fn);
      return b;
    };

    // Info panel
    this.infoPanel = document.createElement("div");
    this.infoPanel.style.cssText =
      "display:none;position:absolute;top:56px;left:8px;width:400px;background:#1e1e2e;color:#cdd6f4;padding:16px;border-radius:8px;font-family:monospace;font-size:12px;line-height:1.6;white-space:pre-wrap;z-index:20;box-shadow:0 4px 20px rgba(0,0,0,0.4);";
    this.infoPanel.textContent = ELI5;
    const closeInfo = document.createElement("button");
    closeInfo.textContent = "✕";
    closeInfo.style.cssText = "position:absolute;top:8px;right:8px;background:none;border:none;color:#cdd6f4;cursor:pointer;font-size:14px;";
    closeInfo.addEventListener("click", () => { this.infoPanel!.style.display = "none"; });
    this.infoPanel.appendChild(closeInfo);

    const infoBtn = makeBtn("? explain", () => {
      this.infoPanel!.style.display = this.infoPanel!.style.display === "none" ? "block" : "none";
    });
    infoBtn.style.background = "#6c8ebf";
    infoBtn.style.color = "#fff";
    infoBtn.style.borderColor = "#6c8ebf";
    this.controlsDiv.appendChild(infoBtn);

    (this.cont as HTMLElement).style.position = "relative";
    this.cont.appendChild(this.controlsDiv);
    this.cont.appendChild(this.infoPanel);
  }

  init() {
    this.controlPoints = this.defaultPoints();
    this.addControls();
    this.animate();
  }

  animate = () => {
    this.draw();
    this.animId = requestAnimationFrame(this.animate);
  };

  draw = () => {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const pts = this.controlPoints;

    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Draw the full Bezier curve
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const { point } = deCasteljau(pts, t);
      if (i === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();

    // Draw construction lines between control points (hull)
    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw de Casteljau construction at current t
    const t = this.animT;
    const { levels } = deCasteljau(pts, t);
    const levelColors = ["rgba(230,100,100,0.8)", "rgba(100,180,100,0.8)", "rgba(100,100,230,0.8)", "rgba(200,150,50,0.8)"];

    for (let lvl = 1; lvl < levels.length; lvl++) {
      const color = levelColors[(lvl - 1) % levelColors.length];
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(levels[lvl][0].x, levels[lvl][0].y);
      for (let i = 1; i < levels[lvl].length; i++) {
        ctx.lineTo(levels[lvl][i].x, levels[lvl][i].y);
      }
      ctx.stroke();

      // Draw dots at interpolated points
      for (const p of levels[lvl]) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, lvl === levels.length - 1 ? 6 : 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Draw final point on curve at t
    if (levels.length > 0) {
      const tip = levels[levels.length - 1][0];
      ctx.fillStyle = "#e74c3c";
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 7, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }

    // Draw t label
    ctx.fillStyle = "#333";
    ctx.font = "bold 14px monospace";
    ctx.fillText(`t = ${t.toFixed(2)}`, 12, this.canvasHeight - 12);

    // Draw control points
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      ctx.fillStyle = p.color;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, this.POINT_RADIUS, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#333";
      ctx.font = "bold 11px monospace";
      ctx.fillText(`P${i}`, p.x + 13, p.y - 6);
    }

    // Advance t
    this.animT += 0.005 * this.animDir;
    if (this.animT >= 1) { this.animT = 1; this.animDir = -1; }
    if (this.animT <= 0) { this.animT = 0; this.animDir = 1; }
  };

  pointerDownHandler(e: PointerEvent) {
    const mx = e.pageX - this.left;
    const my = e.pageY - this.top;
    for (let i = 0; i < this.controlPoints.length; i++) {
      const p = this.controlPoints[i];
      const dist = Math.hypot(mx - p.x, my - p.y);
      if (dist < this.POINT_RADIUS + 4) {
        p.dragging = true;
        this.dragIndex = i;
        return;
      }
    }
  }

  pointerMoveHandler(e: PointerEvent) {
    if (this.dragIndex < 0) return;
    const mx = e.pageX - this.left;
    const my = e.pageY - this.top;
    this.controlPoints[this.dragIndex].x = mx;
    this.controlPoints[this.dragIndex].y = my;
  }

  pointerUpHandler(_e: PointerEvent) {
    if (this.dragIndex >= 0) {
      this.controlPoints[this.dragIndex].dragging = false;
      this.dragIndex = -1;
    }
  }

  stop() {
    cancelAnimationFrame(this.animId);
    if (this.controlsDiv?.parentNode) this.controlsDiv.parentNode.removeChild(this.controlsDiv);
    if (this.infoPanel?.parentNode) this.infoPanel.parentNode.removeChild(this.infoPanel);
    super.stop();
  }
}

export default BezierCurves;
