import { Point, Line, Circle } from "../../../types/shapes";
import AnimationBaseClass from "../AnimationBaseClass";
import { LinePoint } from "../utils/collision-detection/LineCollision";
import { sineCurve } from "../utils/OmnibusUtils";
class LineToPointCollision extends AnimationBaseClass {
  static t = "line to point collision";
  static l = "line-to-point-collision";
  title = "line to point collision";
  line: Line = {
    startPoint: { x: 0, y: 0 },
    endPoint: { x: this.canvasWidth, y: this.canvasHeight },
  };
  circle: Circle = {
    x: this.halfWidth,
    y: this.halfHeight,
    radius: 5,
    vx: 0,
    vy: 0,
    id: "circle",
  };
  point: Point = {
    x: 0,
    y: 0,
  };
  init() {
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

    if (LinePoint(this.line, this.point)) {
      this.ctx.fillStyle = "red";
      this.ctx.strokeStyle = "red";
    } else {
      this.ctx.fillStyle = "black";
      this.ctx.strokeStyle = "black";
    }

    let { x, y } = this.makePointMove();
    this.point.x = x;
    this.point.y = y;

    this.ctx.beginPath();
    this.ctx.arc(x, y, this.circle.radius, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.lineWidth = 3;
    this.line.startPoint = { x: this.halfWidth - 200, y: this.halfHeight };
    this.line.endPoint = { x: this.halfWidth + 200, y: this.halfHeight };
    this.ctx.beginPath();
    this.ctx.moveTo(this.halfWidth - 200, this.halfHeight);
    this.ctx.lineTo(this.halfWidth + 200, this.halfHeight);
    this.ctx.stroke();

    requestAnimationFrame(this.draw);
  };
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default LineToPointCollision;
