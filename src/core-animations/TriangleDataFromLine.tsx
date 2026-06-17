import { Point } from "../types/shapes";
import AnimationBaseClass from "../siteData/animations/AnimationBaseClass";
import { LineLength as LineLengthFunc } from "../core-functions/LineLength";
import { TriangleDataFromLine as triangleDataFromLineFormula } from "../siteData/formulas/animation/TriangleDataFromLine";

function calculateTriangleData(startPoint: Point, endPoint: Point) {
  let hypotenuse = LineLengthFunc({ startPoint, endPoint });
  let adjacent = LineLengthFunc({
    startPoint,
    endPoint: {
      x: endPoint.x,
      y: startPoint.y,
    },
  });
  let opposite = LineLengthFunc({
    startPoint: {
      x: endPoint.x,
      y: startPoint.y,
    },
    endPoint,
  });

  let oh = opposite / hypotenuse;
  let angle1 = Math.asin(oh);
  let angleInDegrees = Math.floor(angle1 * (180 / Math.PI));
  let remainingAngle = 180 - angleInDegrees - 90;

  return { angleInDegrees, remainingAngle, hypotenuse, adjacent, opposite };
}

function drawTriangleDataFromLine(
  ctx: any,
  startPoint: Point,
  endPoint: Point,
  textDiv: any
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.85)";

  ctx.beginPath();
  ctx.strokeStyle = "green";
  ctx.lineWidth = 3;
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.stroke();
  ctx.fillText("A", startPoint.x, startPoint.y);

  ctx.strokeStyle = "rgba(255,255,255,0.65)";
  ctx.lineWidth = 1;
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, startPoint.y);
  ctx.stroke();
  ctx.fillText("C", endPoint.x, startPoint.y);

  ctx.moveTo(endPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.stroke();
  ctx.fillText("B", endPoint.x, endPoint.y);

  let radius = distanceBetweenPoints(startPoint, endPoint);

  let { angleInDegrees, remainingAngle, hypotenuse, opposite, adjacent } =
    calculateTriangleData(startPoint, endPoint);

  if (textDiv) {
    textDiv.innerHTML = `
        <h3>click and drag to draw line and get data.</h3>
        <h5>the hypotenuse  is ${Math.floor(hypotenuse)} pixels long.</h5>
        <h5>the adjacent  is ${Math.floor(adjacent)} pixels long.</h5>
        <h5>the opposite  is ${Math.floor(opposite)} pixels long.</h5>
        <h5>angle "A" is ${Math.floor(angleInDegrees)} degrees.</h5>
        <h5>angle "B" is ${Math.floor(remainingAngle)} degrees.</h5>
        <h5>angle "C" is 90 degrees.</h3>
        `;
  }

  ctx.beginPath();
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 1;
  ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
  ctx.stroke();
}

function distanceBetweenPoints(startPoint: Point, endPoint: Point) {
  let a = startPoint.x - endPoint.x;
  let b = startPoint.y - endPoint.y;
  return Math.sqrt(a * a + b * b);
}

export { drawTriangleDataFromLine };

export default class TriangleDataFromLineAnimation extends AnimationBaseClass {
  static t = "get triangle data from line";
  static l = "get-triangle-data-from-line";
  static f = triangleDataFromLineFormula;
  title = "get triangle data from line";
  animationObject = triangleDataFromLineFormula;
  allowDraw: boolean = false;

  init() {
    this.startPoint = { x: this.halfWidth - 100, y: this.halfHeight + 100 };
    this.endPoint = { x: this.halfWidth + 100, y: this.halfHeight - 100 };
    this.draw();
  }

  draw = () => {
    if (
      !this.canvas ||
      !this.ctx ||
      !this.startPoint ||
      !this.endPoint ||
      !this.textDiv
    )
      return;
    drawTriangleDataFromLine(
      this.ctx,
      this.startPoint,
      this.endPoint,
      this.textDiv
    );
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
