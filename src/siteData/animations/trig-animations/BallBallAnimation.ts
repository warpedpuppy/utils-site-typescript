import { Ball } from "../../../types/shapes";
import { BallToBallBounce } from "../../formulas/animation/BallToBallBounce";
import AnimationBaseClass from "../AnimationBaseClass";

class BallsBouncingAgainstEachOther extends AnimationBaseClass {
  static t = "balls bouncing against each other";
  static l = "balls-bouncing-against-each-other";
  static f = BallToBallBounce.functionString;
  title = "balls bouncing against each other";
  animationObject = BallToBallBounce;
  // vx: number = 4;
  // vy: number = 1;
  // x: number = 1;
  // y: number = 1;
  // ballRadius: number = 10;
  ballQ: number = 20;
  balls: Ball[] = [];
  // spring = 0.05;
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
      this.balls[i] = { x, y, radius, id: `${i}`, vx: 1, vy: 1 };
    }
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
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
    this.balls.forEach((ball1) => {
      if (!this.ctx) return;
      ball1.x += ball1.vx;
      ball1.y += ball1.vy;
      this.ctx.beginPath();
      this.ctx.arc(ball1.x, ball1.y, ball1.radius, 0, 2 * Math.PI);
      this.ctx.stroke();
      this.balls.forEach((ball2) => {
        BallToBallBounce.keyFunction(ball1, ball2);
      });
      this.keepOnScreen(ball1);
      this.imposeSpeedLimit(ball1);
    });
    requestAnimationFrame(this.draw);
  };
  imposeSpeedLimit(ball1: Ball) {
    if (ball1.vx > this.speedLimit) ball1.vx = this.speedLimit;
    if (ball1.vy > this.speedLimit) ball1.vy = this.speedLimit;
  }
  keepOnScreen(ball1: Ball) {
    if (ball1.y > this.canvasHeight - ball1.radius) {
      ball1.y = this.canvasHeight - ball1.radius;
      ball1.vy *= -1;
    }

    if (ball1.y < ball1.radius) {
      ball1.y = ball1.radius;
      ball1.vy *= -1;
    }

    if (ball1.x > this.canvasWidth - ball1.radius) {
      ball1.x = this.canvasWidth - ball1.radius;
      ball1.vx *= -1;
    }
    if (ball1.x < ball1.radius) {
      ball1.x = ball1.radius;
      ball1.vx *= -1;
    }
  }
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default BallsBouncingAgainstEachOther;
