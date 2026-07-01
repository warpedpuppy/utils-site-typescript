import { Circle } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { sineCurve } from "../pages/createJSON/formulas/animation/SineCurve";
import { polygonPoint } from "../pages/createJSON/formulas/collision-detection/PolygonCollision";
import { RectangleObject } from "../pages/createJSON/formulas/animation/Rectangle";

export function drawPointToRectangle(
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
  polygonPointFn: (
    polygon: { vertices: { x: number; y: number }[] },
    point: { x: number; y: number }
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
  ctx.fillStyle = "transparent";

  const x = sineCurveFn(halfWidth, 200, 0.001, time);
  const y = sineCurveFn(halfHeight, 200, 0.001, time);

  const rect = rectangleFn(100, 100, 0, {
    rotate: true,
    rotateSpeed: 2000,
    time,
  });
  rect.vertices.forEach((vertex) => {
    vertex.x += halfWidth;
    vertex.y += halfHeight;
  });

  const hit = polygonPointFn(rect, { x, y });
  const hitColor = "hsl(330, 95%, " + (55 + 25 * Math.sin(time / 120)) + "%)";

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

  ctx.fillStyle = hit ? hitColor : "#818cf8";
  ctx.beginPath();
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

class PointToRectangle extends AnimationBaseClass {
  static t = "point to polygon collision";
  static l = "point-to-rectangle-collision";
  static f = polygonPoint;
  title = "point to rectangle (or any polygon) collision";
  animationObject = polygonPoint;
  rect = RectangleObject.keyFunction(200, 300, 0);
  circle1: Circle = {
    x: this.canvasWidth * 0.33,
    y: this.halfHeight,
    radius: 5,
  };
  startDrag: boolean = false;
  init() {
    if (!this.ctx) return;
    this.draw();
  }
  makePointMove() {
    let x = sineCurve.keyFunction(this.halfWidth, 200, 0.001, performance.now());
    let y = sineCurve.keyFunction(this.halfHeight, 200, 0.001, performance.now());
    return { x, y };
  }
  draw = () => {
    if (!this.ctx) return;
    drawPointToRectangle(
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
      polygonPoint.keyFunction as (
        polygon: { vertices: { x: number; y: number }[] },
        point: { x: number; y: number }
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
export default PointToRectangle;
