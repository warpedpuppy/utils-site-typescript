import { Point } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { getRotation } from "@utilspalooza/core/GetRotation";
import { getRotation as getRotationFormula } from "../pages/createJSON/formulas/animation/GetRotation";

function pointsAroundCircle(
  circleCenter: Point,
  i: number,
  radius: number,
  numElements: number
): Point {
  const x =
    circleCenter.x + radius * Math.cos((2 * Math.PI * i) / numElements);
  const y =
    circleCenter.y + radius * Math.sin((2 * Math.PI * i) / numElements);
  return { x, y };
}

function drawPointTowards(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  i: number,
  img: HTMLImageElement
): void {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const halfWidth = canvasWidth / 2;
  const halfHeight = canvasHeight / 2;

  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 1;
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

  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 2;

  let point = pointsAroundCircle(
    { x: halfWidth, y: halfHeight },
    i,
    200,
    360
  );

  ctx.beginPath();
  ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI);
  ctx.stroke();

  let angle = getRotation(
    {
      x: halfWidth,
      y: halfHeight,
    },
    point
  );

  ctx.translate(halfWidth, halfHeight);
  ctx.rotate(angle);
  ctx.translate(-halfWidth, -halfHeight);

  ctx.drawImage(img, halfWidth - 50, halfHeight - 25);
  ctx.resetTransform();
}

export { drawPointTowards };

export default class PointTowardsMovingPoint extends AnimationBaseClass {
  static t = "point object towards another";
  static l = "point-object-towards-another";
  static f = getRotationFormula;
  title = "point object towards another";
  animationObject = getRotationFormula;
  img = new Image();
  i = 0;

  init() {
    if (!this.canvas || !this.ctx) return;
    this.img.addEventListener("load", () => {
      if (!this.ctx) return;
      this.ctx.drawImage(this.img, 0, 0);
      this.draw();
    });
    this.img.src = "/bmps/arrow.png";
  }

  draw = () => {
    if (!this.canvas || !this.ctx) return;
    drawPointTowards(
      this.ctx,
      this.canvasWidth,
      this.canvasHeight,
      this.i,
      this.img
    );
    this.i += 0.5;
    if (this.i > 360) this.i = 0;

    this.raf(this.draw);
  };

  pointerDownHandler(_e: PointerEvent) {}
  pointerUpHandler(_e: PointerEvent) {}
  pointerMoveHandler(_e: PointerEvent) {}
}
