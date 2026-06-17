import AnimationBaseClass from "../siteData/animations/AnimationBaseClass";
import { FindPointAroundCircle as FindPointAroundCircleFunc } from "../core-functions/FindPointAroundCircle";
import { FindPointAroundCircle as findPointAroundCircleFormula } from "../siteData/formulas/animation/FindPointAroundCircle";

function drawMoveItemAroundCircle(
  ctx: any,
  halfWidth: any,
  halfHeight: any,
  canvasWidth: any,
  canvasHeight: any,
  i: number
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

  let point = FindPointAroundCircleFunc(
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
      this.i
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
