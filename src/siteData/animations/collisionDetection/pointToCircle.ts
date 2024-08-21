import { GenericObject, Point, Circle } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";

class PointToCircleCollision extends AnimationBaseClass {
  static t = "point to circle collision";
  static l = "point-to-circle-collision";
  title = "point to circle collision";
  circle1: Circle = {
    x: this.canvasWidth * 0.33,
    y: this.halfHeight,
    radius: 5,
    vx: 0,
    vy: 0,
    id: "circle1",
  };
  circle2: Circle = {
    x: this.canvasWidth * 0.5,
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
    if (
      this.keyFunction({ x: this.circle1.x, y: this.circle1.y }, this.circle2)
    ) {
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
    this.ctx.stroke();

    requestAnimationFrame(this.draw);
  };
  keyFunction(point: Point, circle: Circle) {
    let distX = point.x - circle.x;
    let distY = point.y - circle.y;
    let distance = Math.sqrt(distX * distX + distY * distY);
    return distance <= circle.radius;
  }
  pointerDownHandler(e: PointerEvent) {
    // if (
    //   this.pointCircle(
    //     { x: e.pageX - this.left, y: e.pageY - this.top },
    //     this.circle1
    //   )
    // ) {
    //   this.startDrag = true;
    // }
  }
  pointerUpHandler(e: PointerEvent) {
    // this.startDrag = false;
  }
  pointerMoveHandler(e: PointerEvent) {
    // if (this.startDrag) {
    this.circle1.x = e.pageX - this.left;
    this.circle1.y = e.pageY - this.top;
    // }
  }
}
export default PointToCircleCollision;
