import AnimationBaseClass from "./AnimationBaseClass";
import { lerpAngle } from "@utilspalooza/core/AngleInterpolation";
import { CollisionDetectionObject } from "../types/types";

function drawDial(
  ctx: any,
  cx: number,
  cy: number,
  r: number,
  angle: number,
  color: string,
  label: string
): void {
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
  ctx.stroke();

  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = color;
  ctx.font = "bold 13px monospace";
  ctx.textAlign = "center";
  ctx.fillText(label, cx, cy + r + 28);
  ctx.textAlign = "left";
}

function drawAngleLerp(
  ctx: any,
  canvasWidth: number,
  canvasHeight: number,
  naiveAngle: number,
  smartAngle: number,
  startAngle: number,
  targetAngle: number,
  t: number
): void {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  const r = Math.min(canvasHeight, canvasWidth) * 0.22;
  const cy = canvasHeight / 2;
  const lx = canvasWidth * 0.3;
  const rx = canvasWidth * 0.7;

  // start (orange) and target (green) reference spokes on both dials
  [lx, rx].forEach((cx) => {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(249,115,22,0.35)";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(startAngle) * r, cy + Math.sin(startAngle) * r);
    ctx.stroke();
    ctx.strokeStyle = "rgba(52,211,153,0.5)";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(targetAngle) * r, cy + Math.sin(targetAngle) * r);
    ctx.stroke();
  });

  drawDial(ctx, lx, cy, r, naiveAngle, "#ef4444", "naive lerp — spins the long way");
  drawDial(ctx, rx, cy, r, smartAngle, "#6366f1", "lerpAngle — shortest path");

  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "12px monospace";
  ctx.fillText(`t: ${t.toFixed(2)}    (orange = start, green = target)`, 12, canvasHeight - 14);
}

export { drawAngleLerp };

const AngleLerpFormula: CollisionDetectionObject = {
  keyFunction: lerpAngle,
  dependencies: [],
  functionString: `function wrapAngle(radians: number): number {
  return Math.atan2(Math.sin(radians), Math.cos(radians));
}
function shortestAngleBetween(a: number, b: number): number {
  return wrapAngle(b - a);
}
function lerpAngle(a: number, b: number, t: number): number {
  return a + shortestAngleBetween(a, b) * t;
}`,
};

class AngleLerpAnimation extends AnimationBaseClass {
  static t = "angle interpolation (shortest turn)";
  static l = "angle-lerp-shortest-turn";
  static f = AngleLerpFormula;
  title = "angle interpolation (shortest turn)";
  animationObject = AngleLerpFormula;

  startAngle = (350 * Math.PI) / 180;
  targetAngle = (10 * Math.PI) / 180;
  t = 0;
  speed = 0.008;
  direction = 1;

  init() {
    if (this.textDiv) {
      this.textDiv.innerHTML =
        "<h3>Both needles rotate from 350° (orange) to 10° (green). The left needle lerps the raw numbers and makes the long almost-full spin backward through 180°. The right uses <code>lerpAngle</code>, which understands angle wrap-around and takes the tiny 20° hop across the 0°/360° seam.</h3>";
    }
    this.draw();
  }

  draw = () => {
    if (!this.ctx) return;
    this.t += this.speed * this.direction;
    if (this.t >= 1) {
      this.t = 1;
      this.direction = -1;
    } else if (this.t <= 0) {
      this.t = 0;
      this.direction = 1;
    }
    const naive = this.startAngle + (this.targetAngle - this.startAngle) * this.t;
    const smart = lerpAngle(this.startAngle, this.targetAngle, this.t);
    drawAngleLerp(
      this.ctx,
      this.canvasWidth,
      this.canvasHeight,
      naive,
      smart,
      this.startAngle,
      this.targetAngle,
      this.t
    );
    this.raf(this.draw);
  };

  extraHTML = () => {
    return (
      <div className="extra-html">
        <label style={{ marginRight: 10 }}>animation speed:</label>
        <input
          type="range"
          min="0.002"
          max="0.03"
          step="0.002"
          defaultValue={this.speed}
          style={{ verticalAlign: "middle", width: 160 }}
          onChange={(e) => {
            this.speed = +e.currentTarget.value;
          }}
        />
      </div>
    );
  };
}

export default AngleLerpAnimation;
