import AnimationBaseClass from "./AnimationBaseClass";
import {
  vecReflect,
  vecNormalize,
  vecPerpendicular,
} from "@utilspalooza/core/Vec2";
import { CollisionDetectionObject } from "../types/types";

type V = { x: number; y: number };

function drawArrow(
  ctx: any,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
  label?: string
): void {
  const ang = Math.atan2(toY - fromY, toX - fromX);
  const head = 11;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - head * Math.cos(ang - Math.PI / 6), toY - head * Math.sin(ang - Math.PI / 6));
  ctx.lineTo(toX - head * Math.cos(ang + Math.PI / 6), toY - head * Math.sin(ang + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  if (label) {
    ctx.font = "bold 12px monospace";
    ctx.fillText(label, toX + 8, toY - 8);
  }
}

function drawVectorReflect(
  ctx: any,
  cx: number,
  cy: number,
  incoming: V,
  normal: V,
  reflected: V,
  wallDir: V,
  canvasWidth: number,
  canvasHeight: number
): void {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  const L = 150;
  const wlen = Math.max(canvasWidth, canvasHeight);

  // The wall
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - wallDir.x * wlen, cy - wallDir.y * wlen);
  ctx.lineTo(cx + wallDir.x * wlen, cy + wallDir.y * wlen);
  ctx.stroke();

  // Surface normal (dashed, green)
  ctx.setLineDash([5, 5]);
  drawArrow(ctx, cx, cy, cx + normal.x * L * 0.6, cy + normal.y * L * 0.6, "rgba(52,211,153,0.95)", "normal");
  ctx.setLineDash([]);

  // Incoming (orange, arriving at center) and reflected (indigo, leaving)
  drawArrow(ctx, cx - incoming.x * L, cy - incoming.y * L, cx, cy, "#f97316", "incoming");
  drawArrow(ctx, cx, cy, cx + reflected.x * L, cy + reflected.y * L, "#6366f1", "reflected");

  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();
}

export { drawVectorReflect };

const VectorReflectFormula: CollisionDetectionObject = {
  keyFunction: vecReflect,
  dependencies: [],
  functionString: `function vecReflect(v: { x: number; y: number }, normal: { x: number; y: number }) {
  // normal must be a unit vector;  r = v - 2(v·n)n
  const d = 2 * (v.x * normal.x + v.y * normal.y);
  return { x: v.x - d * normal.x, y: v.y - d * normal.y };
}`,
};

class VectorReflectAnimation extends AnimationBaseClass {
  static t = "vector reflection (bounce)";
  static l = "vector-reflection";
  static f = VectorReflectFormula;
  title = "vector reflection (bounce)";
  animationObject = VectorReflectFormula;

  wallAngle = Math.PI / 4;
  spinSpeed = 0.006;
  incoming: V = vecNormalize({ x: 1, y: 0.55 });

  init() {
    if (this.textDiv) {
      this.textDiv.innerHTML =
        "<h3>An incoming arrow (orange) hits a wall and bounces off (indigo). The bounce is computed with <code>vecReflect</code> using the wall's normal (green dashed). Watch how the reflection changes as the wall rotates — slide to freeze it.</h3>";
    }
    this.draw();
  }

  draw = () => {
    if (!this.ctx) return;
    this.wallAngle += this.spinSpeed;
    const wallDir: V = { x: Math.cos(this.wallAngle), y: Math.sin(this.wallAngle) };
    const normal = vecNormalize(vecPerpendicular(wallDir));
    const reflected = vecReflect(this.incoming, normal);
    drawVectorReflect(
      this.ctx,
      this.halfWidth,
      this.halfHeight,
      this.incoming,
      normal,
      reflected,
      wallDir,
      this.canvasWidth,
      this.canvasHeight
    );
    this.raf(this.draw);
  };

  extraHTML = () => {
    return (
      <div className="extra-html">
        <label style={{ marginRight: 10 }}>wall spin speed:</label>
        <input
          type="range"
          min="0"
          max="0.03"
          step="0.002"
          defaultValue={this.spinSpeed}
          style={{ verticalAlign: "middle", width: 160 }}
          onChange={(e) => {
            this.spinSpeed = +e.currentTarget.value;
          }}
        />
        <span style={{ marginLeft: 8, opacity: 0.7, fontSize: "0.85rem" }}>0 = freeze the wall</span>
      </div>
    );
  };
}

export default VectorReflectAnimation;
