import { Ball } from "../types/shapes";
import AnimationBaseClass from "../siteData/animations/AnimationBaseClass";
import { BallBounce as ballBouncePhysics } from "../core-functions/BallBounce";
import { BallBounce as ballBounceFormula } from "../siteData/formulas/animation/BallBounce";

function drawBallBounce(ctx: any, ball: any, stage: any): void {
  ctx.clearRect(0, 0, stage.width, stage.height);

  ballBouncePhysics(ball, stage);

  // ── Shadow on the floor ────────────────────────────────────────────────
  const maxDist = stage.height - ball.radius;
  const distFrac = Math.max(0, 1 - (stage.height - ball.radius - ball.y) / maxDist);
  const shadowAlpha = distFrac * 0.45;
  const shadowRx = ball.radius * (0.7 + distFrac * 0.8);
  const shadowRy = ball.radius * 0.22;

  ctx.save();
  ctx.fillStyle = `rgba(0,0,0,${shadowAlpha})`;
  ctx.beginPath();
  ctx.ellipse(
    ball.x,
    stage.height - 3,
    Math.max(shadowRx, 4),
    Math.max(shadowRy, 2),
    0, 0, Math.PI * 2
  );
  ctx.fill();
  ctx.restore();

  // ── Ball with radial gradient ──────────────────────────────────────────
  const gr = ctx.createRadialGradient(
    ball.x - ball.radius * 0.32,
    ball.y - ball.radius * 0.32,
    0,
    ball.x,
    ball.y,
    ball.radius
  );
  gr.addColorStop(0, "#c7d2fe");
  gr.addColorStop(0.55, "#818cf8");
  gr.addColorStop(1, "#3730a3");

  ctx.fillStyle = gr;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}

export { drawBallBounce };

export default class BallBounceAnimation extends AnimationBaseClass {
  static t = "ball bounce";
  static l = "ball-bounce";
  static f = ballBounceFormula;
  title = "ball bounce";
  animationObject = ballBounceFormula;

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
    this.ball.x = this.canvasWidth * 0.25;
    this.ball.y = this.canvasHeight * 0.25;
    this.ball.vx = 5;
    this.ball.vy = -10;
    this.draw();
  }

  draw = () => {
    if (!this.ctx) return;
    const stage = { x: 0, y: 0, width: this.canvasWidth, height: this.canvasHeight };
    drawBallBounce(this.ctx, this.ball, stage);
    this.raf(this.draw);
  };

  pointerDownHandler(_e: PointerEvent) {}
  pointerUpHandler(_e: PointerEvent) {}
  pointerMoveHandler(_e: PointerEvent) {}
}
