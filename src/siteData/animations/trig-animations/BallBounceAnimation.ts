import { Ball } from "../../../types/shapes";
import AnimationBaseClass from "../AnimationBaseClass";
import { BallBounce } from "../../formulas/animation/BallBounce";
class BallBounceAnimation extends AnimationBaseClass {
  static t = "ball bounce";
  static l = "ball-bounce";
  static f = BallBounce;
  static relatedObject = BallBounce;
  title = "ball bounce";
  animationObject = BallBounce;
  ball: Ball = {
    x: 0,
    y: 0,
    radius: 10,
    vx: 4,
    vy: 1,
    id: "ball",
    color: "black",
  };
  init() {
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    let stage = {
      x: 0,
      y: 0,
      height: this.canvasHeight,
      width: this.canvasWidth,
    };
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.beginPath();

    BallBounce.keyFunction(this.ball, stage);
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, 2 * Math.PI);
    this.ctx.fill();
    requestAnimationFrame(this.draw);
  };

  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default BallBounceAnimation;
