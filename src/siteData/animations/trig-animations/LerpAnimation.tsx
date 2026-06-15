import AnimationBaseClass from "../AnimationBaseClass";
import { Lerp } from "../../formulas/animation/Lerp";
import { Point } from "../../../types/shapes";

class LerpAnimation extends AnimationBaseClass {
  static t = "lerp (smooth follow)";
  static l = "lerp-smooth-follow";
  static f = Lerp;
  title = "lerp (smooth follow)";
  animationObject = Lerp;

  target: Point   = { x: 0, y: 0 };
  follower: Point = { x: 0, y: 0 };
  lerpFactor: number = 0.08;
  autoT: number = 0;  // drives automatic target movement when mouse is idle

  init() {
    this.target   = { x: this.halfWidth, y: this.halfHeight };
    this.follower = { x: this.halfWidth, y: this.halfHeight };
    if (this.textDiv) {
      this.textDiv.innerHTML =
        "<h3>Move your mouse (or touch) over the canvas. The white dot chases the orange target using lerp. Adjust the factor to see how it changes the feel.</h3>";
    }
    this.draw();
  }

  draw = () => {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // Auto-animate target when mouse is not being moved
    this.autoT += 0.012;
    this.target.x = this.halfWidth  + Math.sin(this.autoT)       * this.halfWidth  * 0.55;
    this.target.y = this.halfHeight + Math.sin(this.autoT * 1.7) * this.halfHeight * 0.38;

    // Lerp the follower toward the target
    this.follower.x = Lerp.keyFunction(this.follower.x, this.target.x, this.lerpFactor) as number;
    this.follower.y = Lerp.keyFunction(this.follower.y, this.target.y, this.lerpFactor) as number;

    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Line connecting follower to target
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(this.follower.x, this.follower.y);
    ctx.lineTo(this.target.x, this.target.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Target (orange)
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.arc(this.target.x, this.target.y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "bold 11px monospace";
    ctx.fillText("target", this.target.x + 14, this.target.y + 4);

    // Follower (white-indigo)
    const gr = ctx.createRadialGradient(
      this.follower.x, this.follower.y, 0,
      this.follower.x, this.follower.y, 16
    );
    gr.addColorStop(0, "#c7d2fe");
    gr.addColorStop(1, "#6366f1");
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.arc(this.follower.x, this.follower.y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillText("follower", this.follower.x + 20, this.follower.y + 4);

    // Factor label in corner
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "12px monospace";
    ctx.fillText(`lerp factor: ${this.lerpFactor.toFixed(3)}`, 12, this.canvasHeight - 14);

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

  // Mouse override: let user steer the target manually
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
