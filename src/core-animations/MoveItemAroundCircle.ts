import AnimationBaseClass from "./AnimationBaseClass";
import { findPointAroundCircle as FindPointAroundCircleFunc } from "@utilspalooza/core/FindPointAroundCircle";
import { findPointAroundCircle as findPointAroundCircleFormula } from "../pages/createJSON/formulas/animation/FindPointAroundCircle";

const ELI5 = `<h3>Pick a point on a circle, or keep moving around it.</h3>
<p><b>findPointAroundCircle</b> takes a center point, a radius, and a percentage
around the circle, then returns the x/y position at that spot.</p>
<p>Use one fixed percentage to find a particular point, like 25% for the bottom
of the circle. To rotate an object, increase that percentage every frame and draw
the object at the returned x/y point.</p>`;

function drawMoveItemAroundCircle(
  ctx: any,
  halfWidth: any,
  halfHeight: any,
  canvasWidth: any,
  canvasHeight: any,
  i: number,
  findPointAroundCircleFn: (
    centerPoint: { x: number; y: number },
    radius: number,
    currentPoint: number
  ) => { x: number; y: number }
): void {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.strokeStyle = "green";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(0, halfHeight);
  ctx.lineTo(canvasWidth, halfHeight);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(halfWidth, 0);
  ctx.lineTo(halfWidth, canvasHeight);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(halfWidth, halfHeight, 200, 0, 2 * Math.PI);
  ctx.stroke();

  let point = findPointAroundCircleFn(
    { x: halfWidth, y: halfHeight },
    200,
    i
  );

  ctx.beginPath();
  ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(halfWidth, halfHeight);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(point.x, halfHeight);
  ctx.stroke();
}

export { drawMoveItemAroundCircle };

export default class MoveItemAroundCircleAnimation extends AnimationBaseClass {
  static t: string = "find points on a circle";
  static l: string = "find-points-on-a-circle";
  static f = findPointAroundCircleFormula;
  title = "find points on a circle";
  animationObject = findPointAroundCircleFormula;
  i: number = 0;

  init() {
    if (this.textDiv) this.textDiv.innerHTML = ELI5;
    this.draw();
  }

  draw = () => {
    if (!this.canvas || !this.ctx) return;
    drawMoveItemAroundCircle(
      this.ctx,
      this.halfWidth,
      this.halfHeight,
      this.canvasWidth,
      this.canvasHeight,
      this.i,
      FindPointAroundCircleFunc
    );
    this.i += 0.5;
    if (this.i > 100) this.i = 0;
    this.raf(this.draw);
  };

  keyFunction() {}
  pointerDownHandler(_e: PointerEvent) {}
  pointerUpHandler(_e: PointerEvent) {}
  pointerMoveHandler(_e: PointerEvent) {}
}
