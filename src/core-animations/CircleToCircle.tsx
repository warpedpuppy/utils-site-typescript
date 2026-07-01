import { Circle } from "../types/shapes";
import { circleCircle } from "../pages/createJSON/formulas/collision-detection/CircleCollision";
import AnimationBaseClass from "./AnimationBaseClass";
import { sineCurve } from "../pages/createJSON/formulas/animation/SineCurve";
export function drawCircleToCircle(
  ctx: CanvasRenderingContext2D,
  circle1: Circle,
  circle2: Circle,
  hit: boolean,
  canvasWidth: number,
  time: number = performance.now()
) {
  const pulseLightness = 55 + 25 * Math.sin(time / 120);
  const hitColor = `hsl(330, 95%, ${pulseLightness}%)`;

  ctx.fillStyle = hit ? hitColor : "#ff9f1c";
  ctx.beginPath();
  ctx.arc(circle2.x, circle2.y, circle2.radius, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = hit ? hitColor : "#818cf8";
  ctx.beginPath();
  ctx.arc(circle1.x, circle1.y, circle1.radius, 0, 2 * Math.PI);
  ctx.fill();

  if (!hit) return;

  ctx.save();
  ctx.font = "600 16px ui-monospace, 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(129, 140, 248, 0.9)";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "#cdd3ff";
  ctx.fillText("collision detected", canvasWidth / 2, 40);
  ctx.restore();
}

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
    drawCircleToCircle(
      this.ctx,
      this.circle1,
      this.circle2,
      hit,
      this.canvasWidth
    );

    this.raf(this.draw);
  };

  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default CircleToCircleAnimation;
