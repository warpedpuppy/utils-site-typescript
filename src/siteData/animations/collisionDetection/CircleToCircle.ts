import { GenericObject, Point, Circle } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";

class CircleToCircleCollision extends AnimationBaseClass {
  static t = "circle to circle collision";
  static l = "circle-to-circle-collision";
  title = "circle to circle collision";
  circle1: Circle = {
    x: this.canvasWidth * 0.33,
    y: this.halfHeight,
    radius: 100,
    vx: 0,
    vy: 0,
    id: "circle1",
  };
  circle2: Circle = {
    x: this.canvasWidth * 0.66,
    y: this.halfHeight,
    radius: 100,
    vx: 0,
    vy: 0,
    id: "circle2",
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
    if (this.keyFunction(this.circle1, this.circle2)) {
      this.ctx.fillStyle = "red";
    }
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(
      this.circle2.x,
      this.circle2.y,
      this.circle2.radius,
      0,
      2 * Math.PI
    );

    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.beginPath();

    this.ctx.beginPath();
    this.ctx.arc(
      this.circle1.x,
      this.circle1.y,
      this.circle1.radius,
      0,
      2 * Math.PI
    );

    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = "black";
    this.ctx.fillText("circle 2", this.circle2.x - 35, this.circle2.y);
    this.ctx.fillText(
      "click and drag",
      this.circle1.x - 65,
      this.circle1.y - 15
    );
    this.ctx.fillText(
      "over circle 2",
      this.circle1.x - 55,
      this.circle1.y + 15
    );

    requestAnimationFrame(this.draw);
  };
  keyFunction(circle1: Circle, circle2: Circle) {
    let distX = circle1.x - circle2.x;
    let distY = circle1.y - circle2.y;
    let distance = Math.sqrt(distX * distX + distY * distY);
    return distance <= circle1.radius + circle2.radius;
  }
  pointCircle(mousePoint: Point, circle: Circle) {
    let distX = mousePoint.x - circle.x;
    let distY = mousePoint.y - circle.y;
    let distance = Math.sqrt(distX * distX + distY * distY);
    if (distance <= circle.radius) {
      return true;
    }
    return false;
  }
  pointerDownHandler(e: PointerEvent) {
    if (
      this.pointCircle(
        { x: e.pageX - this.left, y: e.pageY - this.top },
        this.circle1
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
      this.circle1.x = e.pageX - this.left;
      this.circle1.y = e.pageY - this.top;
    }
  }
}
export default CircleToCircleCollision;
