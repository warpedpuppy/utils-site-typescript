import { Circle } from "../../../types/shapes";
import { CircleCircle } from "../../formulas/collision-detection/CircleCollision";
import AnimationBaseClass from "../AnimationBaseClass";
import { SineCurve } from "../../formulas/animation/SineCurve";
class CircleToCircleAnimation extends AnimationBaseClass {
  static t = "circle to circle collision";
  static l = "circle-to-circle-collision";
  static f = CircleCircle;
  title = "circle to circle collision";
  animationObject = CircleCircle;
  circle1: Circle = {
    x: this.canvasWidth * 0.5,
    y: this.halfHeight,
    radius: 100,
  };
  circle2: Circle = {
    x: this.canvasWidth * 0.66,
    y: this.halfHeight,
    radius: 100,
  };
  startDrag: boolean = false;
  init() {
    if (!this.ctx) return;
    this.ctx.font = "bold 20px Arial";
    this.draw();
  }
  makePointMove() {
    let x = SineCurve.keyFunction(this.halfWidth, 200, 0.001);
    let y = SineCurve.keyFunction(this.halfHeight, 200, 0.001);
    return { x, y };
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.circle1.x = this.halfWidth;
    this.circle1.y = this.halfHeight;

    const { x, y } = this.makePointMove();
    this.circle2.x = x;
    this.circle2.y = y;

    const hit = CircleCircle.keyFunction(this.circle1, this.circle2);

    this.ctx.fillStyle = hit ? "#ef4444" : "rgba(255,255,255,0.85)";
    this.ctx.beginPath();
    this.ctx.arc(this.circle2.x, this.circle2.y, this.circle2.radius, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.fillStyle = hit ? "#22d3ee" : "rgba(255,255,255,0.85)";
    this.ctx.beginPath();
    this.ctx.arc(this.circle1.x, this.circle1.y, this.circle1.radius, 0, 2 * Math.PI);
    this.ctx.fill();

    if (hit) {
      this.ctx.font = "bold 26px 'Courier New', monospace";
      this.ctx.textAlign = "center";
      this.ctx.fillStyle = "rgba(255, 0, 100, 0.55)";
      this.ctx.fillText("[ COLLISION DETECTED ]", this.halfWidth + 3, 43);
      this.ctx.fillStyle = "rgba(0, 255, 255, 0.55)";
      this.ctx.fillText("[ COLLISION DETECTED ]", this.halfWidth - 3, 37);
      this.ctx.fillStyle = "#e0f7ff";
      this.ctx.fillText("[ COLLISION DETECTED ]", this.halfWidth, 40);
      this.ctx.textAlign = "left";
    }

    this.raf(this.draw);
  };

  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default CircleToCircleAnimation;
