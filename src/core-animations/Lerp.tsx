import AnimationBaseClass from "./AnimationBaseClass";
import { lerp as lerpFunction } from "@utilspalooza/core/Lerp";
import { lerp as lerpFormula } from "../pages/createJSON/formulas/animation/Lerp";
import { Point } from "../types/shapes";

function drawLerp(
  ctx: any,
  target: any,
  follower: any,
  lerpFactor: any,
  canvasWidth: any,
  canvasHeight: any
): void {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Line connecting follower to target
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(follower.x, follower.y);
  ctx.lineTo(target.x, target.y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Target (orange)
  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.arc(target.x, target.y, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "bold 11px monospace";
  ctx.fillText("target", target.x + 14, target.y + 4);

  // Follower (white-indigo)
  const gr = ctx.createRadialGradient(
    follower.x, follower.y, 0,
    follower.x, follower.y, 16
  );
  gr.addColorStop(0, "#c7d2fe");
  gr.addColorStop(1, "#6366f1");
  ctx.fillStyle = gr;
  ctx.beginPath();
  ctx.arc(follower.x, follower.y, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillText("follower", follower.x + 20, follower.y + 4);

  // Factor label in corner
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "12px monospace";
  ctx.fillText(`lerp factor: ${lerpFactor.toFixed(3)}`, 12, canvasHeight - 14);
}

export { drawLerp };

class LerpAnimation extends AnimationBaseClass {
  static t = "lerp (smooth follow)";
  static l = "lerp-smooth-follow";
  static f = lerpFormula;
  title = "lerp (smooth follow)";
  animationObject = lerpFormula;

  target: Point = { x: 0, y: 0 };
  follower: Point = { x: 0, y: 0 };
  lerpFactor: number = 0.08;
  autoT: number = 0;

  init() {
    this.target = { x: this.halfWidth, y: this.halfHeight };
    this.follower = { x: this.halfWidth, y: this.halfHeight };
    if (this.textDiv) {
      this.textDiv.innerHTML =
        "<h3>Move your mouse (or touch) over the canvas. The white dot chases the orange target using lerp. Adjust the factor to see how it changes the feel.</h3>";
    }
    this.draw();
  }

  draw = () => {
    if (!this.ctx) return;

    // Auto-animate target when mouse is not being moved
    this.autoT += 0.012;
    this.target.x = this.halfWidth + Math.sin(this.autoT) * this.halfWidth * 0.55;
    this.target.y = this.halfHeight + Math.sin(this.autoT * 1.7) * this.halfHeight * 0.38;

    // lerp the follower toward the target
    this.follower.x = lerpFunction(this.follower.x, this.target.x, this.lerpFactor) as number;
    this.follower.y = lerpFunction(this.follower.y, this.target.y, this.lerpFactor) as number;

    drawLerp(this.ctx, this.target, this.follower, this.lerpFactor, this.canvasWidth, this.canvasHeight);
    this.raf(this.draw);
  };

  extraHTML = () => {
    return (
      <div className="extra-html">
        <label style={{ marginRight: 10 }}>lerp factor (t):</label>
        <input
          type="range"
          min="0.005"
          max="0.3"
          step="0.005"
          defaultValue={this.lerpFactor}
          style={{ verticalAlign: "middle", width: 160 }}
          onChange={(e) => { this.lerpFactor = +e.currentTarget.value; }}
        />
        <span style={{ marginLeft: 8, opacity: 0.7, fontSize: "0.85rem" }}>
          low = floaty · high = snappy
        </span>
      </div>
    );
  };

  pointerDownHandler(e: PointerEvent) {
    this.target = { x: e.pageX - this.left, y: e.pageY - this.top };
    this.autoT = Math.asin((this.target.x - this.halfWidth) / (this.halfWidth * 0.55 + 0.001));
  }

  pointerMoveHandler(e: PointerEvent) {
    this.target = { x: e.pageX - this.left, y: e.pageY - this.top };
  }

  pointerUpHandler(_e: PointerEvent) {}
}

export default LerpAnimation;
