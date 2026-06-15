import { Ball } from "../../../types/shapes";
import AnimationBaseClass from "../AnimationBaseClass";
import { BallBounce } from "../../formulas/animation/BallBounce";

class BallBounceAnimation extends AnimationBaseClass {
  static t = "ball bounce";
  static l = "ball-bounce";
  static f = BallBounce;
  title = "ball bounce";
  animationObject = BallBounce;

  ball: Ball = {
    x: 0,
    y: 0,
    radius: 18,
    vx: 5,
    vy: -10,
    id: "ball",
    color: "#818cf8",
  };

  init() {
    // Start near top-left and throw the ball diagonally across the canvas.
    this.ball.x  = this.canvasWidth  * 0.25;
    this.ball.y  = this.canvasHeight * 0.25;
    this.ball.vx = 5;
    this.ball.vy = -10;
    this.draw();
  }

  draw = () => {
    if (!this.ctx) return;
    const ctx   = this.ctx;
    const stage = { x: 0, y: 0, width: this.canvasWidth, height: this.canvasHeight };

    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    BallBounce.keyFunction(this.ball, stage);

    // ── Shadow on the floor ────────────────────────────────────────────────
    // Gets larger and darker as the ball nears the floor.
    const maxDist    = stage.height - this.ball.radius;
    const distFrac   = Math.max(0, 1 - (stage.height - this.ball.radius - this.ball.y) / maxDist);
    const shadowAlpha = distFrac * 0.45;
    const shadowRx    = this.ball.radius * (0.7 + distFrac * 0.8);
    const shadowRy    = this.ball.radius * 0.22;

    ctx.save();
    ctx.fillStyle = `rgba(0,0,0,${shadowAlpha})`;
    ctx.beginPath();
    ctx.ellipse(
      this.ball.x,
      stage.height - 3,
      Math.max(shadowRx, 4),
      Math.max(shadowRy, 2),
      0, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.restore();

    // ── Ball with radial gradient ──────────────────────────────────────────
    const gr = ctx.createRadialGradient(
      this.ball.x - this.ball.radius * 0.32,
      this.ball.y - this.ball.radius * 0.32,
      0,
      this.ball.x,
      this.ball.y,
      this.ball.radius
    );
    gr.addColorStop(0, "#c7d2fe");   // highlight
    gr.addColorStop(0.55, "#818cf8");
    gr.addColorStop(1,    "#3730a3"); // deep edge

    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    ctx.fill();

    this.raf(this.draw);
  };

  pointerDownHandler(_e: PointerEvent) {}
  pointerUpHandler(_e: PointerEvent)   {}
  pointerMoveHandler(_e: PointerEvent) {}
}

export default BallBounceAnimation;
