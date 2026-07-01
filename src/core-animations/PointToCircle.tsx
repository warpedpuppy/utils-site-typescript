import { Circle } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { sineCurve } from "../pages/createJSON/formulas/animation/SineCurve";
import { pointCircle } from "../pages/createJSON/formulas/collision-detection/PointCollision";

export function drawPointToCircle(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  time: number,
  sineCurveFn: (
    startingValue: number,
    differential: number,
    speed: number,
    time: number
  ) => number,
  pointCircleFn: (
    point: { x: number; y: number },
    circle: { x: number; y: number; radius: number }
  ) => boolean
): void {
  const halfWidth = canvasWidth / 2;
  const halfHeight = canvasHeight / 2;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const circle = { x: halfWidth, y: halfHeight, radius: 100 };
  const x = sineCurveFn(halfWidth, 200, 0.001, time);
  const y = sineCurveFn(halfHeight, 200, 0.001, time);

  const hit = pointCircleFn({ x, y }, circle);
  ctx.fillStyle = hit ? "hsl(330, 95%, " + (55 + 25 * Math.sin(time / 120)) + "%)" : "#ff9f1c";

  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = hit ? "hsl(330, 95%, " + (55 + 25 * Math.sin(time / 120)) + "%)" : "#818cf8";
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();

  if (hit) {
    ctx.save();
    ctx.font = "600 16px ui-monospace, 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(129, 140, 248, 0.9)";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#cdd3ff";
    ctx.fillText("collision detected", halfWidth, 40);
    ctx.restore();
  }
}

class PointToCircleCollision extends AnimationBaseClass {
  static t = "point to circle collision";
  static l = "point-to-circle-collision";
  static f = pointCircle;
  title = "point to circle collision";
  animationObject = pointCircle;
  circle1: Circle = {
    x: this.canvasWidth * 0.33,
    y: this.halfHeight,
    radius: 5,
  };
  circle2: Circle = {
    x: this.canvasWidth * 0.5,
    y: this.halfHeight,
    radius: 100,
  };
  startDrag: boolean = false;
  init() {
    if (!this.ctx) return;
    this.ctx.font = "bold 20px Arial";
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    drawPointToCircle(
      this.ctx,
      this.canvasWidth,
      this.canvasHeight,
      performance.now(),
      sineCurve.keyFunction as (
        startingValue: number,
        differential: number,
        speed: number,
        time: number
      ) => number,
      pointCircle.keyFunction as (
        point: { x: number; y: number },
        circle: { x: number; y: number; radius: number }
      ) => boolean
    );

    this.raf(this.draw);
  };
  makePointMove() {
    let x = sineCurve.keyFunction(this.halfWidth, 200, 0.001, performance.now());
    let y = sineCurve.keyFunction(this.halfHeight, 200, 0.001, performance.now());
    return { x, y };
  }
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default PointToCircleCollision;
