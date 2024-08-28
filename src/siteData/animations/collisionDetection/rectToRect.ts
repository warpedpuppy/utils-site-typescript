import AnimationBaseClass from "../AnimationBaseClass";
import { RectangleObject } from "../utils/animation/Rectangle";
import { PolygonPolygon } from "../utils/collision-detection/PolygonCollision";
import { SineCurve } from "../utils/animation/SineCurve";
import { Point } from "../../../types/shapes";
class RectToRect extends AnimationBaseClass {
  static t = "rectangle to rectangle collision";
  static l = "rectangle-to-rectangle-collision";
  title = "rectangle to rectangle collision";
  animationObject = PolygonPolygon;
  rect1 = RectangleObject.keyFunction(50, 50, 0);
  rect2 = RectangleObject.keyFunction(50, 50, 0);
  init() {
    if (!this.ctx) return;
    this.ctx.font = "bold 20px Arial";
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
    if (PolygonPolygon.keyFunction(this.rect1, this.rect2)) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "black";
    }
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();

    let { x, y } = this.makePointMove();
    this.rect1 = RectangleObject.keyFunction(100, 100, 0, {
      rotate: true,
      rotateSpeed: 1000,
    });
    this.ctx.beginPath();
    this.rect1.vertices.forEach((rect: Point, i: number) => {
      rect.x += x;
      rect.y += y;
      if (i === 0) {
        this.ctx?.moveTo(rect.x, rect.y);
      } else {
        this.ctx?.lineTo(rect.x, rect.y);
      }
    });
    this.ctx.closePath();
    this.ctx.fill();

    this.rect2 = RectangleObject.keyFunction(100, 100, 0, {
      rotate: true,
      rotateSpeed: 1000,
    });
    this.ctx.beginPath();
    this.rect2.vertices.forEach((rect: Point, i: number) => {
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

    requestAnimationFrame(this.draw);
  };
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default RectToRect;
