import { Circle, Point, Rectangle } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";

class PointToRectangle extends AnimationBaseClass {
  static t = "point to rectangle collision";
  static l = "point-to-rectangle-collision";
  title = "point to rectangle collision";
  rect1: Rectangle = {
    x: this.canvasWidth * 0.33,
    y: this.halfHeight,
    width: 100,
    height: 100,
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
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.fillStyle = "transparent";
    this.ctx.strokeStyle = "black";
    if (
      this.keyFunction({ x: this.circle1.x, y: this.circle1.y }, this.rect1)
    ) {
      this.ctx.fillStyle = "red";
    }
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

    this.ctx.lineWidth = 3;
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.beginPath();
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

    this.ctx.fillStyle = "black";
    this.ctx.fillText("rect 2", this.rect1.x - 35, this.rect1.y);
    this.ctx.fillText("click and drag", this.rect1.x - 65, this.rect1.y - 15);
    this.ctx.fillText("over recty 2", this.rect1.x - 55, this.rect1.y + 15);

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
