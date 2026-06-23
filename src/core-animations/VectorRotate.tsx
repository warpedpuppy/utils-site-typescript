import AnimationBaseClass from "./AnimationBaseClass";
import { vecRotate } from "@utilspalooza/core/Vec2";
import { CollisionDetectionObject } from "../types/types";

type V = { x: number; y: number };

function drawVectorRotate(
  ctx: any,
  cx: number,
  cy: number,
  basePoints: V[],
  angle: number,
  canvasWidth: number,
  canvasHeight: number
): void {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // faint center cross
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(canvasWidth, cy);
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, canvasHeight);
  ctx.stroke();

  const rotated = basePoints.map((p) => vecRotate(p, angle));

  rotated.forEach((p, i) => {
    const x = cx + p.x;
    const y = cy + p.y;
    ctx.strokeStyle = "rgba(99,102,241,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.fillStyle = i === 0 ? "#f97316" : "#c7d2fe";
    ctx.beginPath();
    ctx.arc(x, y, i === 0 ? 8 : 5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "12px monospace";
  ctx.fillText(`angle: ${(angle % (Math.PI * 2)).toFixed(2)} rad`, 12, canvasHeight - 14);
}

export { drawVectorRotate };

const VectorRotateFormula: CollisionDetectionObject = {
  keyFunction: vecRotate,
  dependencies: [],
  functionString: `function vecRotate(v: { x: number; y: number }, radians: number) {
  const c = Math.cos(radians);
  const s = Math.sin(radians);
  return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
}`,
};

class VectorRotateAnimation extends AnimationBaseClass {
  static t = "vector rotation";
  static l = "vector-rotation";
  static f = VectorRotateFormula;
  title = "vector rotation";
  animationObject = VectorRotateFormula;

  angle = 0;
  spinSpeed = 0.01;
  count = 8;
  basePoints: V[] = [];

  buildPoints() {
    const pts: V[] = [];
    const n = this.count;
    for (let i = 0; i < n; i++) {
      const a = (2 * Math.PI * i) / n;
      const r = i % 2 === 0 ? 160 : 80; // alternating radii => rotation is obvious
      pts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
    }
    this.basePoints = pts;
  }

  init() {
    this.buildPoints();
    if (this.textDiv) {
      this.textDiv.innerHTML =
        "<h3>Every spoke is the <em>same</em> set of points run through <code>vecRotate</code> by a steadily growing angle. Rotation just remixes each point's x and y with sine &amp; cosine — the orange dot marks where the shape 'starts'.</h3>";
    }
    this.draw();
  }

  draw = () => {
    if (!this.ctx) return;
    this.angle += this.spinSpeed;
    drawVectorRotate(
      this.ctx,
      this.halfWidth,
      this.halfHeight,
      this.basePoints,
      this.angle,
      this.canvasWidth,
      this.canvasHeight
    );
    this.raf(this.draw);
  };

  extraHTML = () => {
    return (
      <div className="extra-html">
        <label style={{ marginRight: 10 }}>spin speed:</label>
        <input
          type="range"
          min="0"
          max="0.05"
          step="0.002"
          defaultValue={this.spinSpeed}
          style={{ verticalAlign: "middle", width: 140 }}
          onChange={(e) => {
            this.spinSpeed = +e.currentTarget.value;
          }}
        />
        <label style={{ margin: "0 10px 0 18px" }}>points:</label>
        <input
          type="range"
          min="3"
          max="16"
          step="1"
          defaultValue={this.count}
          style={{ verticalAlign: "middle", width: 120 }}
          onChange={(e) => {
            this.count = +e.currentTarget.value;
            this.buildPoints();
          }}
        />
      </div>
    );
  };
}

export default VectorRotateAnimation;
