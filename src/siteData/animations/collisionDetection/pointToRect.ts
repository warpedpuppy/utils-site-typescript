import { Circle, Point, Rectangle } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";
import { sineCurve } from "../utils/OmnibusUtils";
class PointToRectangle extends AnimationBaseClass {
  static t = "point to rectangle collision";
  static l = "point-to-rectangle-collision";
  title = "point to rectangle collision";
  rect1: Rectangle = {
    x: this.halfWidth - 150,
    y: this.halfHeight - 150,
    width: 300,
    height: 300,
    vx: 0,
    vy: 0,
    id: "rect1",
  };
  circle1: Circle = {
    x: this.canvasWidth * 0.33,
    y: this.halfHeight,
    radius: 5,
    vx: 0,
    vy: 0,
    id: "circle1",
  };
  startDrag: boolean = false;
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
    if (
      this.keyFunction({ x: this.circle1.x, y: this.circle1.y }, this.rect1)
    ) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "black";
    }

    // this.ctx.translate(-this.rect1.x, -this.rect1.y);

    this.ctx.beginPath();
    this.ctx.rect(
      this.rect1.x,
      this.rect1.y,
      this.rect1.width,
      this.rect1.height
    );
    this.ctx.fill();

    // this.ctx.resetTransform();

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
  keyFunction(point: Point, rectangle: Rectangle) {
    return (
      point.x >= rectangle.x &&
      point.x <= rectangle.x + rectangle.width &&
      point.y >= rectangle.y &&
      point.y <= rectangle.y + rectangle.height
    );
  }
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {
    this.circle1.x = e.pageX - this.left;
    this.circle1.y = e.pageY - this.top;
  }
}
export default PointToRectangle;
