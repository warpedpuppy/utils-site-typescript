import { Circle } from "../../../types/types";
import { CircleCircle } from "../utils/collision-detection/CircleCollision";
import AnimationBaseClass from "../AnimationBaseClass";
import { sineCurve } from "../utils/OmnibusUtils";
class CircleToCircleCollision extends AnimationBaseClass {
  static t = "circle to circle collision";
  static l = "circle-to-circle-collision";
  title = "circle to circle collision";
  circle1: Circle = {
    x: this.canvasWidth * 0.5,
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
  makePointMove() {
    let x = sineCurve(this.halfWidth, 200, 0.001);
    let y = sineCurve(this.halfHeight, 200, 0.001);
    return { x, y };
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    if (CircleCircle(this.circle1, this.circle2)) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "black";
    }
    this.circle1.x = this.halfWidth;
    this.circle1.y = this.halfHeight;

    const { x, y } = this.makePointMove();
    this.circle2.x = x;
    this.circle2.y = y;
    this.ctx.beginPath();
    this.ctx.arc(
      this.circle2.x,
      this.circle2.y,
      this.circle2.radius,
      0,
      2 * Math.PI
    );
    this.ctx.fill();

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
export default CircleToCircleCollision;
