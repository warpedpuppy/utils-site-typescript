import { GenericObject, Point } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";

class BallBounce extends AnimationBaseClass {
  static t = "ball bounce";
  static l = "ball-bounce";
  title = "ball bounce";
  vx: number = 4;
  vy: number = 1;
  x: number = 1;
  y: number = 1;
  gravity: number = 0.5;
  ballRadius: number = 10;
  init() {
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.beginPath();
    let { x, y } = this.keyFunction({ x: this.x, y: this.y });
    this.x = x;
    this.y = y;
    this.ctx.arc(this.x, this.y, this.ballRadius, 0, 2 * Math.PI);
    this.ctx.fill();
    requestAnimationFrame(this.draw);
  };
  keyFunction(currentPosition: Point) {
    currentPosition.x += this.vx;
    currentPosition.y += this.vy;
    this.vy += this.gravity;
    if (currentPosition.y >= this.canvasHeight - this.ballRadius) {
      this.vy *= -1;
    }
    if (currentPosition.x >= this.canvasWidth) {
      this.vy = 1;
      currentPosition.x = 1;
      currentPosition.y = 1;
    }
    return currentPosition;
  }
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default BallBounce;
