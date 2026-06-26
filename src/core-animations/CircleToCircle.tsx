import { Circle } from "../types/shapes";
import { circleCircle } from "../pages/createJSON/formulas/collision-detection/CircleCollision";
import AnimationBaseClass from "./AnimationBaseClass";
import { sineCurve } from "../pages/createJSON/formulas/animation/SineCurve";
class CircleToCircleAnimation extends AnimationBaseClass {
  static t = "circle to circle collision";
  static l = "circle-to-circle-collision";
  static f = circleCircle;
  title = "circle to circle collision";
  animationObject = circleCircle;
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
    let x = sineCurve.keyFunction(this.halfWidth, 200, 0.001, performance.now());
    let y = sineCurve.keyFunction(this.halfHeight, 200, 0.001, performance.now());
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

    const hit = circleCircle.keyFunction(this.circle1, this.circle2);

    this.ctx.fillStyle = hit ? "hsl(330, 95%, " + (55 + 25 * Math.sin(performance.now() / 120)) + "%)" : "#ff9f1c";
    this.ctx.beginPath();
    this.ctx.arc(this.circle2.x, this.circle2.y, this.circle2.radius, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.fillStyle = hit ? "hsl(330, 95%, " + (55 + 25 * Math.sin(performance.now() / 120)) + "%)" : "#818cf8";
    this.ctx.beginPath();
    this.ctx.arc(this.circle1.x, this.circle1.y, this.circle1.radius, 0, 2 * Math.PI);
    this.ctx.fill();

    if (hit) {
      this.ctx.save();
      this.ctx.font = "600 16px ui-monospace, 'Courier New', monospace";
      this.ctx.textAlign = "center";
      this.ctx.shadowColor = "rgba(129, 140, 248, 0.9)";
      this.ctx.shadowBlur = 14;
      this.ctx.fillStyle = "#cdd3ff";
      this.ctx.fillText("collision detected", this.halfWidth, 40);
      this.ctx.restore();
    }

    this.raf(this.draw);
  };

  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default CircleToCircleAnimation;
