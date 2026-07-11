import { Point } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { moveAlongLine } from "@utilspalooza/core/MoveAlongLine";
import { moveAlongLine as moveAlongLineFormula } from "../pages/createJSON/formulas/animation/MoveAlongLine";
import { getRotation } from "@utilspalooza/core/GetRotation";

function drawMoveToDestination(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement | null,
  dot: Point,
  dotNew: Point,
  arrowPoint: Point,
  ratio: number,
  img: HTMLImageElement
): void {
  if (!canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "green";
  ctx.lineWidth = 10;

  let newDotPoint = moveAlongLine(dot, dotNew, ratio);
  dot.x = newDotPoint.x;
  dot.y = newDotPoint.y;

  ctx.beginPath();
  ctx.arc(dot.x, dot.y, 20, 0, 2 * Math.PI);
  ctx.stroke();

  let newPoint = moveAlongLine(arrowPoint, dot, ratio);
  arrowPoint.x = newPoint.x;
  arrowPoint.y = newPoint.y;

  let angle = getRotation(newPoint, dot);

  ctx.translate(newPoint.x, newPoint.y);
  ctx.rotate(angle);
  ctx.translate(-newPoint.x, -newPoint.y);

  ctx.drawImage(img, arrowPoint.x - 50, arrowPoint.y - 25);
  ctx.resetTransform();
}

export { drawMoveToDestination };

export default class MoveObjectToDestinationPoint extends AnimationBaseClass {
  static t = "move object to changing point";
  static l = "move-to-changing-point";
  static f = moveAlongLineFormula;
  title: string = "move object to changing point";
  animationObject = moveAlongLineFormula;
  points = [];
  text = [];
  interval: ReturnType<typeof setInterval> | undefined = undefined;
  dot: Point = { x: 0, y: 0 };
  dotNew: Point = { x: 0, y: 0 };
  arrowPoint: Point = { x: 0, y: 0 };
  img = new Image();
  ratio = 0;

  init() {
    if (this.textDiv) {
      this.textDiv.innerHTML =
        "<h3>this function shows you how the arrow moves to the point.  To see how to get the arrow to point towards the point, please see 'point one object towards a moving object'.</h3>";
    }

    this.dot = {
      x: Math.floor(Math.random() * this.canvasWidth),
      y: Math.floor(Math.random() * this.canvasHeight),
    };
    this.drawDot();

    this.img.addEventListener("load", () => {
      if (!this.ctx) return;
      this.ctx.drawImage(this.img, 0, 0);
      this.draw();
    });

    this.img.src = "/bmps/arrow.png";

    this.arrowPoint = { x: this.halfWidth - 50, y: this.halfHeight - 25 };

    this.interval = setInterval(this.drawDot, 2000);
  }

  drawDot = () => {
    this.ratio = 0;
    this.dotNew = {
      x: Math.floor(Math.random() * this.canvasWidth),
      y: Math.floor(Math.random() * this.canvasHeight),
    };
  };

  draw = () => {
    if (!this.canvas || !this.ctx) return;
    drawMoveToDestination(
      this.ctx,
      this.canvas,
      this.dot,
      this.dotNew,
      this.arrowPoint,
      this.ratio,
      this.img
    );
    this.ratio += 0.0001;

    this.raf(this.draw);
  };

  pointerDownHandler(_e: PointerEvent) {}
  pointerUpHandler(_e: PointerEvent) {}
  pointerMoveHandler(_e: PointerEvent) {}

  stop() {
    // The 2s drawDot interval outlived navigation before this override.
    clearInterval(this.interval);
    this.interval = undefined;
    super.stop();
  }
}
