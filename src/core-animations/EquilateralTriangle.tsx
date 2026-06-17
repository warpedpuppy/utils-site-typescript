import { Point } from "../types/shapes";
import { GenericObject } from "../types/types";
import { EquilateralTriangle as EquilateralTriangleFunc } from "../core-functions/EquilateralTriangle";
import { EquilateralTriangle as equilateralTriangleFormula } from "../pages/createJSON/formulas/animation/EquilateralTriangle";
import AnimationBaseClass from "./AnimationBaseClass";

function drawEquilateralTriangle(
  ctx: any,
  backgroundTris: any[],
  angle: number,
  startPoint: Point,
  endPoint: Point,
  canvasWidth: number,
  canvasHeight: number
): void {
  backgroundTris.forEach((tri: GenericObject) => {
    let { point1, point2, point3 } = EquilateralTriangleFunc(
      tri.radius,
      tri.centerPoint,
      angle || tri.angle
    );
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.lineTo(point3.x, point3.y);
    ctx.lineTo(point1.x, point1.y);
    ctx.stroke();
  });

  if (!startPoint || !endPoint) return;

  ctx.strokeStyle = "green";
  ctx.lineWidth = 3;

  let a = startPoint.x - endPoint.x;
  let b = startPoint.y - endPoint.y;

  let radius = Math.sqrt(a * a + b * b);

  let { point1, point2, point3 } = EquilateralTriangleFunc(
    radius,
    startPoint,
    angle
  );
  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
  ctx.lineTo(point3.x, point3.y);
  ctx.lineTo(point1.x, point1.y);
  ctx.stroke();
  [point1, point2, point3].forEach((item: Point) => {
    ctx.beginPath();
    ctx.arc(item.x, item.y, 5, 0, 2 * Math.PI);
    ctx.stroke();
  });
}

export { drawEquilateralTriangle };

export default class EquilateralTriangleAnimation extends AnimationBaseClass {
  static t = "draw equilateral triangle (from radius and center point)";
  static l = "equilateral-trianlge-points";
  static f = equilateralTriangleFormula;
  title = "draw equilateral triangle (from radius and center point)";
  backgroundTris: object[] = [];
  animationObject = equilateralTriangleFormula;
  angle = 0;
  startPoint: Point = { x: this.halfWidth, y: this.halfHeight + 50 };
  endPoint: Point = { x: this.halfWidth, y: this.halfHeight - 50 };

  init() {
    for (let i = 0; i < 10; i++) {
      let radius = Math.random() * 100 + 50;
      let centerPoint = {
        x: Math.random() * this.canvasWidth,
        y: Math.random() * this.canvasHeight,
      };
      let angle = Math.random() * 1;
      let obj: GenericObject = { radius, centerPoint, angle };
      this.backgroundTris.push(obj);
    }
    if (this.textDiv)
      this.textDiv.innerHTML = `<h3>Click and drag to draw triangle</h3>`;
    this.draw();
  }

  getLineAngle(originPoint: Point, destinationPoint: Point) {
    return Math.atan2(
      destinationPoint.y - originPoint.y,
      destinationPoint.x - originPoint.x
    );
  }

  draw = () => {
    if (!this.canvas || !this.cont || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.angle = this.getLineAngle(this.startPoint, this.endPoint);
    drawEquilateralTriangle(
      this.ctx,
      this.backgroundTris,
      this.angle,
      this.startPoint,
      this.endPoint,
      this.canvasWidth,
      this.canvasHeight
    );
  };

  pointerDownHandler(e: PointerEvent) {
    this.endPoint = {
      x: 0,
      y: 0,
    };
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
