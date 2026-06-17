import { Point, Line, Circle } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { LinePoint } from "../pages/createJSON/formulas/collision-detection/LineCollision";
import { SineCurve } from "../pages/createJSON/formulas/animation/SineCurve";
class LineToPointCollision extends AnimationBaseClass {
  static t = "line to point collision";
  static l = "line-to-point-collision";
  static f = LinePoint;
  title = "line to point collision";
  animationObject = LinePoint;
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
    let x = SineCurve.keyFunction(this.halfWidth, 200, 0.001);
    let y = SineCurve.keyFunction(this.halfHeight, 200, 0.001);
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

    const hit = LinePoint.keyFunction(this.line, this.point);

    this.ctx.strokeStyle = hit ? "#ef4444" : "rgba(255,255,255,0.85)";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(this.halfWidth - 200, this.halfHeight);
    this.ctx.lineTo(this.halfWidth + 200, this.halfHeight);
    this.ctx.stroke();

    this.ctx.fillStyle = "#f97316";
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.circle.radius, 0, 2 * Math.PI);
    this.ctx.fill();

    if (hit) {
      this.ctx.font = "bold 26px 'Courier New', monospace";
      this.ctx.textAlign = "center";
      this.ctx.fillStyle = "rgba(255, 0, 100, 0.55)";
      this.ctx.fillText("[ COLLISION DETECTED ]", this.halfWidth + 3, 43);
      this.ctx.fillStyle = "rgba(0, 255, 255, 0.55)";
      this.ctx.fillText("[ COLLISION DETECTED ]", this.halfWidth - 3, 37);
      this.ctx.fillStyle = "#e0f7ff";
      this.ctx.fillText("[ COLLISION DETECTED ]", this.halfWidth, 40);
      this.ctx.textAlign = "left";
    }

    this.raf(this.draw);
  };
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default LineToPointCollision;
