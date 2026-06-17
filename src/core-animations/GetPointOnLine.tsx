import { Point } from "../types/shapes";
import AnimationBaseClass from "../siteData/animations/AnimationBaseClass";
import { getPointOnLine as GetPointOnLineFunc } from "../core-functions/GetPointOnLine";
import { GetPointOnLine as getPointOnLineFormula } from "../siteData/formulas/animation/GetPointOnLine";

function drawGetPointOnLine(
  ctx: any,
  startPoint: Point,
  endPoint: Point,
  perc: number,
  textDiv: any
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.stroke();

  let point: Point = GetPointOnLineFunc(startPoint, endPoint, perc);

  // Draw the point — filled circle so it's always clearly visible
  ctx.fillStyle = "#f97316"; // orange — visible on any dark background
  ctx.beginPath();
  ctx.arc(point.x, point.y, 7, 0, 2 * Math.PI);
  ctx.fill();

  // Show the coordinates and percentage in the info area
  if (textDiv) {
    textDiv.innerHTML = `
      <p>Click and drag to draw a line.</p>
      <p>
        Point at <strong>${Math.round(perc * 100)}%</strong>:
        x&nbsp;=&nbsp;<strong>${Math.round(point.x)}</strong>,
        y&nbsp;=&nbsp;<strong>${Math.round(point.y)}</strong>
      </p>`;
  }
}

export { drawGetPointOnLine };

export default class GetPointOnLineAnimation extends AnimationBaseClass {
  static t = "get a point on a line";
  static l = "get-a-point-on-a-line";
  static f = getPointOnLineFormula;
  title = "get a point on a line";
  animationObject = getPointOnLineFormula;
  perc: number = 0.5;

  init() {
    this.startPoint = { x: this.halfWidth - 100, y: this.halfHeight + 100 };
    this.endPoint = { x: this.halfWidth + 100, y: this.halfHeight - 100 };
    this.draw();
  }

  extraHTML = (): any => {
    return null;
  };

  perChangeHandler = (value: string) => {
    this.perc = +value;
  };

  draw = () => {
    if (!this.ctx || !this.canvas || !this.startPoint || !this.endPoint) return;
    drawGetPointOnLine(this.ctx, this.startPoint, this.endPoint, this.perc, this.textDiv);
    this.raf(this.draw);
  };

  pointerDownHandler(e: PointerEvent) {
    this.startPoint = {
      x: Math.floor(e.pageX - this.left),
      y: Math.floor(e.pageY - this.top),
    };
    this.allowDraw = true;
  }

  pointerMoveHandler(e: PointerEvent) {
    if (this.allowDraw) {
      this.endPoint = {
        x: Math.floor(e.pageX - this.left),
        y: Math.floor(e.pageY - this.top),
      };
      this.draw();
    }
  }

  pointerUpHandler(e: PointerEvent) {
    this.allowDraw = false;
  }
}
