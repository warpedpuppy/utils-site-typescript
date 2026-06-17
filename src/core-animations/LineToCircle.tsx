import { Line, Circle } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { LineCircle } from "../pages/createJSON/formulas/collision-detection/LineCollision";
import { SineCurve } from "../pages/createJSON/formulas/animation/SineCurve";
class LineToCircleCollision extends AnimationBaseClass {
  static t = "line to circle collision";
  static l = "line-to-circle-collision";
  static f = LineCircle;
  title = "line to circle collision";
  animationObject = LineCircle;
  line: Line = {
    startPoint: { x: 0, y: 0 },
    endPoint: { x: 0, y: 0 },
  };
  lineLength: number = 50;
  rotate: number = 0;
  circle: Circle = {
    x: this.halfWidth,
    y: this.halfHeight,
    radius: 100,
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

    this.circle.x = this.halfWidth;
    this.circle.y = this.halfHeight;

    let { x, y } = this.makePointMove();
    let x1 = x + this.lineLength * Math.cos(2 * Math.PI * (this.rotate / 360));
    let y1 = y + this.lineLength * Math.sin(2 * Math.PI * (this.rotate / 360));
    let x2 = x - this.lineLength * Math.cos(2 * Math.PI * (this.rotate / 360));
    let y2 = y - this.lineLength * Math.sin(2 * Math.PI * (this.rotate / 360));
    this.line.startPoint = { x: x1, y: y1 };
    this.line.endPoint = { x: x2, y: y2 };

    const hit = LineCircle.keyFunction(this.line, this.circle);

    this.ctx.fillStyle = hit ? "#22d3ee" : "rgba(255,255,255,0.85)";
    this.ctx.beginPath();
    this.ctx.arc(this.circle.x, this.circle.y, this.circle.radius, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.strokeStyle = hit ? "#ef4444" : "rgba(255,255,255,0.85)";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);

    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();

    this.rotate++;
    if (this.rotate > 360) {
      this.rotate = 0;
    }
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
export default LineToCircleCollision;
