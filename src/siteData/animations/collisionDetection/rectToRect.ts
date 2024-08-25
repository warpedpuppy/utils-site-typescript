import { GenericObject, Point } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";
import Rectangle from "../utils/Rectangle";
import { polyPoly } from "../utils/PolygonUtils";
import { sineCurve } from "../utils/OmnibusUtils";
class RectToRect extends AnimationBaseClass {
  static t = "rectangle to rectangle collision";
  static l = "rectangle-to-rectangle-collision";
  title = "rectangle to rectangle collision";
  rect1: Rectangle = new Rectangle(50, 50, 0, this.ctx, false, "rect", {
    stroke: false,
    fill: true,
    spinSpeed: 3,
  });
  rect2: Rectangle = new Rectangle(50, 50, 0, this.ctx, false, "rect", {
    stroke: false,
    fill: true,
    spinSpeed: 1,
  });
  init() {
    if (!this.ctx) return;
    this.ctx.font = "bold 20px Arial";
    this.draw();
  }
  makePointMove() {
    let x = sineCurve(this.halfWidth, 200, 0.001);
    let y = sineCurve(this.halfHeight, 200, 0.001);
    return { x, y };
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.fillStyle = "transparent";
    this.ctx.strokeStyle = "black";
    if (polyPoly(this.rect1.returnRectangle(), this.rect2.returnRectangle())) {
      this.ctx.fillStyle = "red";
    }
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();

    let { x, y } = this.makePointMove();
    this.rect1.draw(this.top, this.left, {
      x,
      y,
    });

    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.rect2.draw(this.top, this.left, {
      x: this.halfWidth,
      y: this.halfHeight,
    });

    this.ctx.fill();
    this.ctx.stroke();

    requestAnimationFrame(this.draw);
  };
  keyFunction(rectangle1: Rectangle, rectangle2: Rectangle) {
    // return (
    //   rectangle1.x + rectangle1.width >= rectangle2.x &&
    //   rectangle1.x <= rectangle2.x + rectangle2.width &&
    //   rectangle1.y + rectangle1.height >= rectangle2.y &&
    //   rectangle1.y <= rectangle2.y + rectangle2.height
    // );
  }
  pointRectangle(point: Point, rectangle: Rectangle) {
    // return (
    //   point.x >= rectangle.x &&
    //   point.x <= rectangle.x + rectangle.width &&
    //   point.y >= rectangle.y &&
    //   point.y <= rectangle.y + rectangle.height
    // );
  }
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default RectToRect;
