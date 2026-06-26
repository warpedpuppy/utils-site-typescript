import { Line } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { lineLine } from "../pages/createJSON/formulas/collision-detection/LineCollision";
import { sineCurve } from "../pages/createJSON/formulas/animation/SineCurve";

class LineToLineCollision extends AnimationBaseClass {
  static t = "line to line collision";
  static l = "line-to-line-collision";
  static f = lineLine;
  title = "line to line collision";
  animationObject = lineLine;
  line1: Line = {
    startPoint: { x: 0, y: 0 },
    endPoint: { x: 0, y: 0 },
  };
  line2: Line = {
    startPoint: { x: this.halfWidth - 100, y: this.halfHeight },
    endPoint: { x: this.halfWidth + 100, y: this.halfHeight },
  };
  lineLength: number = 100;
  rotate1: number = 0;
  rotate2: number = 0;
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

    this.ctx.lineWidth = 3;

    let { x, y } = this.makePointMove();
    let x1 = x + this.lineLength * Math.cos(2 * Math.PI * (this.rotate1 / 360));
    let y1 = y + this.lineLength * Math.sin(2 * Math.PI * (this.rotate1 / 360));
    let x2 = x - this.lineLength * Math.cos(2 * Math.PI * (this.rotate1 / 360));
    let y2 = y - this.lineLength * Math.sin(2 * Math.PI * (this.rotate1 / 360));
    this.rotate1++;
    if (this.rotate1 > 360) this.rotate1 = 0;

    this.line1.startPoint = { x: x1, y: y1 };
    this.line1.endPoint = { x: x2, y: y2 };
    this.line2.startPoint = { x: this.halfWidth - 100, y: this.halfHeight };
    this.line2.endPoint = { x: this.halfWidth + 100, y: this.halfHeight };

    const hit = lineLine.keyFunction(this.line1, this.line2).hit;

    this.ctx.strokeStyle = hit ? "hsl(330, 95%, " + (55 + 25 * Math.sin(performance.now() / 120)) + "%)" : "#ff9f1c";
    this.ctx.beginPath();
    this.ctx.moveTo(this.line1.startPoint.x, this.line1.startPoint.y);
    this.ctx.lineTo(this.line1.endPoint.x, this.line1.endPoint.y);
    this.ctx.stroke();

    this.ctx.strokeStyle = hit ? "hsl(330, 95%, " + (55 + 25 * Math.sin(performance.now() / 120)) + "%)" : "#818cf8";
    this.ctx.beginPath();
    this.ctx.moveTo(this.line2.startPoint.x, this.line2.startPoint.y);
    this.ctx.lineTo(this.line2.endPoint.x, this.line2.endPoint.y);
    this.ctx.stroke();

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
export default LineToLineCollision;
