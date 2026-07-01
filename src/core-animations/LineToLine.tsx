import { Line } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { lineLine } from "../pages/createJSON/formulas/collision-detection/LineCollision";
import { sineCurve } from "../pages/createJSON/formulas/animation/SineCurve";

export function drawLineToLine(
  ctx: CanvasRenderingContext2D,
  line1: Line,
  line2: Line,
  hit: boolean,
  halfWidth: number,
  time: number
) {
  const pulse = "hsl(330, 95%, " + (55 + 25 * Math.sin(time / 120)) + "%)";

  ctx.lineWidth = 3;

  ctx.strokeStyle = hit ? pulse : "#ff9f1c";
  ctx.beginPath();
  ctx.moveTo(line1.startPoint.x, line1.startPoint.y);
  ctx.lineTo(line1.endPoint.x, line1.endPoint.y);
  ctx.stroke();

  ctx.strokeStyle = hit ? pulse : "#818cf8";
  ctx.beginPath();
  ctx.moveTo(line2.startPoint.x, line2.startPoint.y);
  ctx.lineTo(line2.endPoint.x, line2.endPoint.y);
  ctx.stroke();

  if (!hit) return;

  ctx.save();
  ctx.font = "600 16px ui-monospace, 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(129, 140, 248, 0.9)";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "#cdd3ff";
  ctx.fillText("collision detected", halfWidth, 40);
  ctx.restore();
}

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
    drawLineToLine(
      this.ctx,
      this.line1,
      this.line2,
      hit,
      this.halfWidth,
      performance.now()
    );

    this.raf(this.draw);
  };
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default LineToLineCollision;
