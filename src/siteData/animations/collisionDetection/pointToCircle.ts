import { Circle } from "../../../types/shapes";
import AnimationBaseClass from "../AnimationBaseClass";
import { sineCurve } from "../utils/OmnibusUtils";
import {
  PointCircle,
  PointCircleString,
} from "../utils/collision-detection/PointCollision";

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
  dependencies: string[] = [];
  keyFunction: string = PointCircleString;
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

    this.circle2.x = this.halfWidth;
    this.circle2.y = this.halfHeight;
    let { x, y } = this.makePointMove();

    if (PointCircle({ x, y }, this.circle2)) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "black";
    }

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
    this.ctx.fillStyle = "black";
    this.ctx.arc(x, y, this.circle1.radius, 0, 2 * Math.PI);
    this.ctx.fill();

    requestAnimationFrame(this.draw);
  };
  makePointMove() {
    let x = sineCurve(this.halfWidth, 200, 0.001);
    let y = sineCurve(this.halfHeight, 200, 0.001);
    return { x, y };
  }
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default PointToCircleCollision;
