import { Point, Line, Circle } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { linePoint } from "../pages/createJSON/formulas/collision-detection/LineCollision";
import { sineCurve } from "../pages/createJSON/formulas/animation/SineCurve";
export function drawLineToPoint(
  ctx: CanvasRenderingContext2D,
  line: Line,
  point: Point,
  radius: number,
  hit: boolean,
  canvasWidth: number,
  time: number = performance.now()
) {
  const pulseLightness = 55 + 25 * Math.sin(time / 120);
  const hitColor = `hsl(330, 95%, ${pulseLightness}%)`;

  ctx.strokeStyle = hit ? hitColor : "#ff9f1c";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(line.startPoint.x, line.startPoint.y);
  ctx.lineTo(line.endPoint.x, line.endPoint.y);
  ctx.stroke();

  ctx.fillStyle = hit ? hitColor : "#818cf8";
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
  ctx.fill();

  if (!hit) return;

  ctx.save();
  ctx.font = "600 16px ui-monospace, 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(129, 140, 248, 0.9)";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "#cdd3ff";
  ctx.fillText("collision detected", canvasWidth / 2, 40);
  ctx.restore();
}

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

    drawLineToPoint(
      this.ctx,
      this.line,
      this.point,
      this.circle.radius,
      hit,
      this.canvasWidth
    );

    this.raf(this.draw);
  };
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default LineToPointCollision;
