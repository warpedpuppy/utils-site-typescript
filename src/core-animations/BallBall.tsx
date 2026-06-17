import { Ball } from "../types/shapes";
import AnimationBaseClass from "../siteData/animations/AnimationBaseClass";
import { BallToBallBounce as ballToBallBouncePhysics } from "../core-functions/BallToBallBounce";
import { BallToBallBounce as ballToBallBounceFormula } from "../siteData/formulas/animation/BallToBallBounce";

interface GradientBall extends Ball {
  h: number;
  s: number;
  l: number;
}

function drawBallBall(ctx: any, balls: any[], canvasWidth: any, canvasHeight: any): void {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  const SPEED_LIMIT = 5;

  balls.forEach((ball1) => {
    ball1.x += ball1.vx;
    ball1.y += ball1.vy;

    const gr = ctx.createRadialGradient(
      ball1.x - ball1.radius * 0.32,
      ball1.y - ball1.radius * 0.32,
      0,
      ball1.x,
      ball1.y,
      ball1.radius
    );
    gr.addColorStop(0, `hsl(${ball1.h} ${ball1.s}% ${Math.min(95, ball1.l + 25)}%)`);
    gr.addColorStop(0.55, `hsl(${ball1.h} ${ball1.s}% ${ball1.l}%)`);
    gr.addColorStop(1, `hsl(${ball1.h} ${ball1.s}% ${Math.max(5, ball1.l - 25)}%)`);

    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.arc(ball1.x, ball1.y, ball1.radius, 0, 2 * Math.PI);
    ctx.fill();

    balls.forEach((ball2) => {
      ballToBallBouncePhysics(ball1, ball2);
    });

    // Keep on screen
    if (ball1.y > canvasHeight - ball1.radius) {
      ball1.y = canvasHeight - ball1.radius;
      ball1.vy *= -1;
    }
    if (ball1.y < ball1.radius) {
      ball1.y = ball1.radius;
      ball1.vy *= -1;
    }
    if (ball1.x > canvasWidth - ball1.radius) {
      ball1.x = canvasWidth - ball1.radius;
      ball1.vx *= -1;
    }
    if (ball1.x < ball1.radius) {
      ball1.x = ball1.radius;
      ball1.vx *= -1;
    }

    // Impose speed limit
    if (ball1.vx > SPEED_LIMIT) ball1.vx = SPEED_LIMIT;
    if (ball1.vy > SPEED_LIMIT) ball1.vy = SPEED_LIMIT;
  });
}

export { drawBallBall };

export default class BallsBouncingAgainstEachOther extends AnimationBaseClass {
  static t = "balls bouncing against each other";
  static l = "balls-bouncing-against-each-other";
  static f = ballToBallBounceFormula;
  title = "balls bouncing against each other";
  animationObject = ballToBallBounceFormula;

  ballQ: number = 20;
  balls: GradientBall[] = [];
  speedLimit = 5;
  storeCanvasSize = { width: 0, height: 0 };

  init() {
    if (this.textDiv) this.textDiv.innerHTML = `<h2>${this.title}</h2>`;
    this.storeCanvasSize = {
      width: this.canvasWidth,
      height: this.canvasHeight,
    };
    this.createBalls();
    this.draw();
  }

  createBalls() {
    this.balls = [];
    let totalArea = this.canvasWidth * this.canvasHeight;
    this.ballQ = Math.floor(totalArea / 20000);

    for (let i = 0; i < this.ballQ; i++) {
      let radius = Math.random() * 50 + 10;
      let x = Math.random() * (this.canvasWidth - 2 * radius) + radius;
      let y = Math.random() * (this.canvasHeight - 2 * radius) + radius;
      const H = Math.random() * 360;
      const S = Math.random() * 100;
      const L = Math.random() * 100;

      this.balls[i] = {
        x,
        y,
        radius,
        id: `${i}`,
        vx: 1,
        vy: 1,
        color: `hsl(${H} ${S}% ${L}%)`,
        h: H,
        s: S,
        l: L,
      };
    }
  }

  draw = () => {
    if (!this.ctx) return;

    if (
      this.canvasHeight !== this.storeCanvasSize.height ||
      this.canvasWidth !== this.storeCanvasSize.width
    ) {
      this.createBalls();
      this.storeCanvasSize = {
        width: this.canvasWidth,
        height: this.canvasHeight,
      };
    }

    drawBallBall(this.ctx, this.balls, this.canvasWidth, this.canvasHeight);
    this.raf(this.draw);
  };

  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
