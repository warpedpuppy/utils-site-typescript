import { Point, Line, Circle } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { linePoint } from "../pages/createJSON/formulas/collision-detection/LineCollision";
import { sineCurve } from "../pages/createJSON/formulas/animation/SineCurve";
class LineToPointCollision extends AnimationBaseClass {
  static t = "line to point collision";
  static l = "line-to-point-collision";
  static f = linePoint;
  title = "line to point collision";
  animationObject = linePoint;
  line: Line = {
    startPoint: { x: 0, y: 0 },
    endPoint: { x: this.canvasWidth, y: this.canvasHeight },
  };
  circle: Circle = {
    x: this.halfWidth,
    y: this.halfHeight,
    radius: 5,
  };
  point: Point = {
    x: 0,
    y: 0,
  };
  init() {
    this.draw();
  }
  makePointMove() {
    let x = sineCurve.keyFunction(this.halfWidth, 200, 0.001, performance.now());
    let y = sineCurve.keyFunction(this.halfHeight, 200, 0.001, performance.now());
    return { x, y };
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    let { x, y } = this.makePointMove();
    this.point.x = x;
    this.point.y = y;

    this.line.startPoint = { x: this.halfWidth - 200, y: this.halfHeight };
    this.line.endPoint = { x: this.halfWidth + 200, y: this.halfHeight };

    const hit = linePoint.keyFunction(this.line, this.point);

    this.ctx.strokeStyle = hit ? "hsl(330, 95%, " + (55 + 25 * Math.sin(performance.now() / 120)) + "%)" : "#ff9f1c";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(this.halfWidth - 200, this.halfHeight);
    this.ctx.lineTo(this.halfWidth + 200, this.halfHeight);
    this.ctx.stroke();

    this.ctx.fillStyle = hit ? "hsl(330, 95%, " + (55 + 25 * Math.sin(performance.now() / 120)) + "%)" : "#818cf8";
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.circle.radius, 0, 2 * Math.PI);
    this.ctx.fill();

    if (hit) {
      this.ctx.save();
      this.ctx.font = "600 16px ui-monospace, 'Courier New', monospace";
      this.ctx.textAlign = "center";
      this.ctx.shadowColor = "rgba(129, 140, 248, 0.9)";
      this.ctx.shadowBlur = 14;
      this.ctx.fillStyle = "#cdd3ff";
      this.ctx.fillText("collision detected", this.halfWidth, 40);
      this.ctx.restore();
    }

    this.raf(this.draw);
  };
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default LineToPointCollision;
