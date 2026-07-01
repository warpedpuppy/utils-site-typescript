import { Line, Circle } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { lineCircle } from "../pages/createJSON/formulas/collision-detection/LineCollision";
import { sineCurve } from "../pages/createJSON/formulas/animation/SineCurve";

export function drawLineToCircle(
  ctx: CanvasRenderingContext2D,
  line: Line,
  circle: Circle,
  hit: boolean,
  halfWidth: number,
  time: number
) {
  const pulse = "hsl(330, 95%, " + (55 + 25 * Math.sin(time / 120)) + "%)";

  ctx.fillStyle = hit ? pulse : "#818cf8";
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  ctx.fill();

  ctx.strokeStyle = hit ? pulse : "#ff9f1c";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(line.startPoint.x, line.startPoint.y);
  ctx.lineTo(line.endPoint.x, line.endPoint.y);
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

class LineToCircleCollision extends AnimationBaseClass {
  static t = "line to circle collision";
  static l = "line-to-circle-collision";
  static f = lineCircle;
  title = "line to circle collision";
  animationObject = lineCircle;
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
    let x = sineCurve.keyFunction(this.halfWidth, 200, 0.001, performance.now());
    let y = sineCurve.keyFunction(this.halfHeight, 200, 0.001, performance.now());
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

    const hit = lineCircle.keyFunction(this.line, this.circle);
    drawLineToCircle(
      this.ctx,
      this.line,
      this.circle,
      hit,
      this.halfWidth,
      performance.now()
    );

    this.rotate++;
    if (this.rotate > 360) {
      this.rotate = 0;
    }

    this.raf(this.draw);
  };
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default LineToCircleCollision;
