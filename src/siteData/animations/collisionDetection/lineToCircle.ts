import { Point, Line, Circle } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";
import { LineCircle } from "../utils/collision-detection/LineCollision";

class LineToCircleCollision extends AnimationBaseClass {
  static t = "line to circle collision";
  static l = "line-to-circle-collision";
  title = "line to circle collision";
  line: Line = {
    startPoint: { x: 0, y: 0 },
    endPoint: { x: 0, y: 0 },
  };
  circle: Circle = {
    x: this.halfWidth,
    y: this.halfHeight,
    radius: 200,
    vx: 0,
    vy: 0,
    id: "circle",
  };
  init() {
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    if (LineCircle(this.line, this.circle)) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "transparent";
    }

    this.ctx.beginPath();
    this.ctx.arc(
      this.circle.x,
      this.circle.y,
      this.circle.radius,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
    this.ctx.stroke();

    let x = this.circle.x + this.circle.radius * Math.cos(2 * Math.PI * 0.1);
    let y = this.circle.y + this.circle.radius * Math.sin(2 * Math.PI * 0.1);

    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(this.circle.x, this.circle.y);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();

    x = this.circle.x - this.circle.radius * Math.cos(2 * Math.PI * 0.1);
    y = this.circle.y - this.circle.radius * Math.sin(2 * Math.PI * 0.1);

    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(this.circle.x, this.circle.y);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();

    requestAnimationFrame(this.draw);
  };
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default LineToCircleCollision;
