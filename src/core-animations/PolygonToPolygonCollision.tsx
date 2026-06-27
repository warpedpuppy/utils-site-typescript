import AnimationBaseClass from "./AnimationBaseClass";
import { polygonPolygon } from "../pages/createJSON/formulas/collision-detection/PolygonCollision";
import { StarObject } from "../pages/createJSON/formulas/animation/Star";
import { sineCurve } from "../pages/createJSON/formulas/animation/SineCurve";

export function drawPolygonToPolygon(
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
  polygonPolygonFn: (
    polygon1: { vertices: { x: number; y: number }[] },
    polygon2: { vertices: { x: number; y: number }[] }
  ) => boolean,
  starFn: (
    spikes: number,
    innerRadius: number,
    outerRadius: number,
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

  ctx.fillStyle = "#1e1b4b";
  ctx.rect(0, 0, canvasWidth, canvasHeight);
  ctx.fill();

  // small 5-spike moving star
  const star1 = starFn(5, 50, 25, 0, { rotate: true, rotateSpeed: 2000, time });
  // large 9-spike center star
  const star2 = starFn(9, 150, 25, 0, { rotate: true, rotateSpeed: 2800, time });

  const vertices1: { x: number; y: number }[] = [];
  star2.vertices.forEach((pt) => {
    vertices1.push({ x: halfWidth + pt.x, y: halfHeight + pt.y });
  });

  const x = sineCurveFn(halfWidth, 200, 0.001, time);
  const y = sineCurveFn(halfHeight, 200, 0.001, time);

  const vertices2: { x: number; y: number }[] = [];
  star1.vertices.forEach((pt) => {
    vertices2.push({ x: x + pt.x, y: y + pt.y });
  });

  const hit = polygonPolygonFn({ vertices: vertices1 }, { vertices: vertices2 });
  const hitColor = "hsl(330, 95%, " + (55 + 25 * Math.sin(time / 120)) + "%)";

  // large center star
  ctx.fillStyle = hit ? hitColor : "#818cf8";
  ctx.beginPath();
  vertices1.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.closePath();
  ctx.fill();

  // small moving star
  ctx.fillStyle = hit ? hitColor : "#ff9f1c";
  ctx.beginPath();
  vertices2.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
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

class PolygonToPolygonCollision extends AnimationBaseClass {
  static t = "polygon to polygon collision";
  static l = "polygon-to-polygon-collision";
  static f = polygonPolygon;
  title = "polygon to polygon collision";
  animationObject = polygonPolygon;
  init() {
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    drawPolygonToPolygon(
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
      polygonPolygon.keyFunction as (
        polygon1: { vertices: { x: number; y: number }[] },
        polygon2: { vertices: { x: number; y: number }[] }
      ) => boolean,
      StarObject.keyFunction as (
        spikes: number,
        innerRadius: number,
        outerRadius: number,
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
export default PolygonToPolygonCollision;
