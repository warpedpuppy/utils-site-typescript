import { Circle } from "../../../types/shapes";
import AnimationBaseClass from "../AnimationBaseClass";
import { SineCurve } from "../../formulas/animation/SineCurve";
import { PolygonPoint } from "../../formulas/collision-detection/PolygonCollision";
import { RectangleObject } from "../../formulas/animation/Rectangle";
import { Point } from "../../../types/shapes";
class PointToRectangle extends AnimationBaseClass {
  static t = "point to polygon collision";
  static l = "point-to-rectangle-collision";
  static f = PolygonPoint;
  title = "point to rectangle (or any polygon) collision";
  animationObject = PolygonPoint;
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
    let x = SineCurve.keyFunction(this.halfWidth, 200, 0.001);
    let y = SineCurve.keyFunction(this.halfHeight, 200, 0.001);
    return { x, y };
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.fillStyle = "transparent";

    let { x, y } = this.makePointMove();
    this.circle1.x = x;
    this.circle1.y = y;

    if (
      PolygonPoint.keyFunction(this.rect, {
        x: this.circle1.x,
        y: this.circle1.y,
      })
    ) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "black";
    }

    this.rect = RectangleObject.keyFunction(100, 100, 0, {
      rotate: true,
      rotateSpeed: 1000,
    });
    this.ctx.beginPath();
    this.rect.vertices.forEach((rect: Point, i: number) => {
      rect.x += this.halfWidth;
      rect.y += this.halfHeight;
      if (i === 0) {
        this.ctx?.moveTo(rect.x, rect.y);
      } else {
        this.ctx?.lineTo(rect.x, rect.y);
      }
    });
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.fillStyle = "black";
    this.ctx.beginPath();
    this.ctx.arc(
      this.circle1.x,
      this.circle1.y,
      this.circle1.radius,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
    requestAnimationFrame(this.draw);
  };
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default PointToRectangle;
