import { GenericObject, Point, Rectangle } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";

class RectToRect extends AnimationBaseClass {
  static t = "rectangle to rectangle collision";
  static l = "rectangle-to-rectangle-collision";
  title = "rectangle to rectangle collision";
  rect1: Rectangle = {
    x: this.canvasWidth * 0.33,
    y: this.halfHeight,
    width: 100,
    height: 100,
    vx: 0,
    vy: 0,
    id: "rect1",
  };
  rect2: Rectangle = {
    x: this.canvasWidth * 0.66,
    y: this.halfHeight,
    width: 100,
    height: 100,
    vx: 0,
    vy: 0,
    id: "rect2",
  };
  startDrag: boolean = false;
  init() {
    if (!this.ctx) return;
    this.ctx.font = "bold 20px Arial";
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.fillStyle = "transparent";
    this.ctx.strokeStyle = "black";
    if (this.keyFunction(this.rect1, this.rect2)) {
      this.ctx.fillStyle = "red";
    }
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.rect(
      this.rect2.x,
      this.rect2.y,
      this.rect2.width,
      this.rect2.height
    );

    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.beginPath();

    this.ctx.beginPath();
    this.ctx.rect(
      this.rect1.x,
      this.rect1.y,
      this.rect1.width,
      this.rect1.height
    );

    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = "black";
    this.ctx.fillText("rect 2", this.rect2.x - 35, this.rect2.y);
    this.ctx.fillText("click and drag", this.rect1.x - 65, this.rect1.y - 15);
    this.ctx.fillText("over recty 2", this.rect1.x - 55, this.rect1.y + 15);

    requestAnimationFrame(this.draw);
  };
  keyFunction(rectangle1: Rectangle, rectangle2: Rectangle) {
    return (
      rectangle1.x + rectangle1.width >= rectangle2.x &&
      rectangle1.x <= rectangle2.x + rectangle2.width &&
      rectangle1.y + rectangle1.height >= rectangle2.y &&
      rectangle1.y <= rectangle2.y + rectangle2.height
    );
  }
  pointRectangle(point: Point, rectangle: Rectangle) {
    return (
      point.x >= rectangle.x &&
      point.x <= rectangle.x + rectangle.width &&
      point.y >= rectangle.y &&
      point.y <= rectangle.y + rectangle.height
    );
  }
  pointerDownHandler(e: PointerEvent) {
    if (
      this.pointRectangle(
        { x: e.pageX - this.left, y: e.pageY - this.top },
        this.rect1
      )
    ) {
      this.startDrag = true;
    }
  }
  pointerUpHandler(e: PointerEvent) {
    this.startDrag = false;
  }
  pointerMoveHandler(e: PointerEvent) {
    if (this.startDrag) {
      this.rect1.x = e.pageX - this.left;
      this.rect1.y = e.pageY - this.top;
    }
  }
}
export default RectToRect;
