import { Point } from "../types/shapes";
import { Nullable } from "../types/types";
import { lineLength as LineLengthFunc } from "@utilspalooza/core/LineLength";
import { lineLength as lineLengthFormula } from "../pages/createJSON/formulas/animation/LineLength";
import AnimationBaseClass from "./AnimationBaseClass";

function drawLineLength(
  ctx: CanvasRenderingContext2D,
  startPoint: Point,
  endPoint: Point,
  canvasWidth: number,
  canvasHeight: number,
  lineLengthFn: (line: { startPoint: Point; endPoint: Point }) => number
): void {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.font = "bold 12px Verdana";
  ctx.fillStyle = "rgba(255,255,255,0.85)";

  // ADJACENT
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 1;
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, startPoint.y);
  let adjacent = lineLengthFn({
    startPoint: { x: startPoint.x, y: startPoint.y },
    endPoint: { x: endPoint.x, y: startPoint.y },
  });
  if (endPoint.x < startPoint.x) adjacent *= -1;
  ctx.fillText(
    `${Math.abs(adjacent)} pixels`,
    startPoint.x + adjacent / 2,
    startPoint.y - 10
  );
  ctx.stroke();

  // OPPOSITE
  ctx.moveTo(endPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  let opposite = lineLengthFn({
    startPoint: { x: endPoint.x, y: startPoint.y },
    endPoint: { x: endPoint.x, y: endPoint.y },
  });
  if (endPoint.y > startPoint.y) opposite *= -1;
  let textY = startPoint.y - opposite * 0.75;
  ctx.translate(endPoint.x, textY);
  ctx.rotate(Math.PI / 2);
  ctx.translate(-endPoint.x, -textY);
  ctx.fillText(`${Math.abs(opposite)} pixels`, endPoint.x, textY + 14);
  ctx.stroke();
  ctx.resetTransform();

  // HYPOTENUSE
  let hypotenuse = Math.floor(
    lineLengthFn({
      startPoint: startPoint,
      endPoint: endPoint,
    })
  );
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 2;
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.stroke();
  textY = startPoint.y;
  ctx.translate(startPoint.x, textY);
  let angle = getHypAngle(startPoint, endPoint);
  ctx.rotate(angle);
  ctx.translate(-startPoint.x, -textY);

  ctx.fillText(
    `${Math.abs(hypotenuse)} pixels`,
    startPoint.x + hypotenuse * 0.25,
    textY - 12
  );
  ctx.stroke();
  ctx.resetTransform();

  ctx.beginPath();
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 1;
  ctx.arc(startPoint.x, startPoint.y, hypotenuse, 0, 2 * Math.PI);
  ctx.stroke();
}

function getHypAngle(originPoint: Point, destinationPoint: Point) {
  return Math.atan2(
    destinationPoint.y - originPoint.y,
    destinationPoint.x - originPoint.x
  );
}

export { drawLineLength };

export default class LineLengthAnimation extends AnimationBaseClass {
  static t = "get line length";
  static l = "line-length";
  static f = lineLengthFormula;
  title = "get line length";
  startPoint: Nullable<Point> = null;
  animationObject = lineLengthFormula;
  endPoint: Nullable<Point> = null;
  allowDraw: boolean = false;

  init() {
    if (this.textDiv)
      this.textDiv.innerHTML = `
        <p>Every pixel on screen has an <em>(x, y)</em> address on the Cartesian grid, so two of the three sides of this triangle are free: the <strong>horizontal</strong> distance is just the difference in the x's, and the <strong>vertical</strong> distance is the difference in the y's. You can practically read them off the grid.</p>
        <p>Those two sides meet at a right angle, which leaves the slanted line — the <strong>hypotenuse</strong> — as the only unknown. And the hypotenuse of a right triangle is exactly what Pythagoras solved: <strong>a&sup2; + b&sup2; = c&sup2;</strong>. Square the horizontal, square the vertical, add them, take the square root. That's the length of any line.</p>
        <h3>Click and drag on the screen to draw a line.</h3>`;
    this.startPoint = { x: this.halfWidth - 100, y: this.halfHeight + 100 };
    this.endPoint = { x: this.halfWidth + 100, y: this.halfHeight - 100 };
    this.draw();
  }

  draw = () => {
    if (!this.canvas || !this.ctx || !this.startPoint || !this.endPoint) return;
    drawLineLength(
      this.ctx,
      this.startPoint,
      this.endPoint,
      this.canvasWidth,
      this.canvasHeight,
      LineLengthFunc
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
