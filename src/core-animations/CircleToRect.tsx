import { Circle } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { RectangleObject } from "../pages/createJSON/formulas/animation/Rectangle";
import { polygonCircle } from "../pages/createJSON/formulas/collision-detection/PolygonCollision";
import { sineCurve } from "../pages/createJSON/formulas/animation/SineCurve";

export function drawCircleToRectangle(
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
  polygonCircleFn: (
    polygon: { vertices: { x: number; y: number }[] },
    circle: { x: number; y: number; radius: number }
  ) => boolean,
  rectangleFn: (
    width: number,
    height: number,
    angle?: number,
    options?: {
      rotate?: boolean;
      rotateSpeed?: number;
      clockwise?: boolean;
      time?: number;
    }
  ) => { vertices: { x: number; y: number }[] }
): void {
  const halfWidth = canvasWidth / 2;
  const halfHeight = canvasHeight / 2;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const circle = { x: halfWidth, y: halfHeight, radius: 100 };
  const x = sineCurveFn(halfWidth, 200, 0.001, time);
  const y = sineCurveFn(halfHeight, 200, 0.001, time);

  const rect = rectangleFn(100, 100, 0, {
    rotate: true,
    rotateSpeed: 2000,
    time,
  });
  rect.vertices.forEach((vertex) => {
    vertex.x += x;
    vertex.y += y;
  });

  const hit = polygonCircleFn(rect, circle);
  const hitColor = "hsl(330, 95%, " + (55 + 25 * Math.sin(time / 120)) + "%)";

  ctx.fillStyle = hit ? hitColor : "#818cf8";
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = hit ? hitColor : "#ff9f1c";
  ctx.beginPath();
  rect.vertices.forEach((vertex, index) => {
    if (index === 0) {
      ctx.moveTo(vertex.x, vertex.y);
      return;
    }
    ctx.lineTo(vertex.x, vertex.y);
  });
  ctx.closePath();
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

class CirceToRectAnimation extends AnimationBaseClass {
  static t = "circle to rectangle collision";
  static l = "circle-to-rectangle-collision";
  static f = polygonCircle;
  title = "circle to rectangle collision";
  animationObject = polygonCircle;
  rect = RectangleObject.keyFunction(100, 100, 0, false);
  circle: Circle = {
    x: this.halfWidth,
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
    drawCircleToRectangle(
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
      polygonCircle.keyFunction as (
        polygon: { vertices: { x: number; y: number }[] },
        circle: { x: number; y: number; radius: number }
      ) => boolean,
      RectangleObject.keyFunction as (
        width: number,
        height: number,
        angle?: number,
        options?: {
          rotate?: boolean;
          rotateSpeed?: number;
          clockwise?: boolean;
          time?: number;
        }
      ) => { vertices: { x: number; y: number }[] }
    );

    this.raf(this.draw);
  };

  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default CirceToRectAnimation;
