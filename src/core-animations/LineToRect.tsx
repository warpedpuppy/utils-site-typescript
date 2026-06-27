import { Line, Polygon } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { RectangleObject } from "../pages/createJSON/formulas/animation/Rectangle";
import { sineCurve } from "../pages/createJSON/formulas/animation/SineCurve";
import { LinePolygon } from "../pages/createJSON/formulas/collision-detection/LineCollision";
import { Point } from "../types/shapes";

export function drawLineToRectangle(
  ctx: CanvasRenderingContext2D,
  polygon: Polygon,
  line: Line,
  hit: boolean,
  canvasWidth: number,
  time: number = performance.now()
) {
  const pulseLightness = 55 + 25 * Math.sin(time / 120);
  const hitColor = `hsl(330, 95%, ${pulseLightness}%)`;

  ctx.fillStyle = hit ? hitColor : "#ff9f1c";
  ctx.beginPath();
  polygon.vertices.forEach((vertex, i) => {
    if (i === 0) ctx.moveTo(vertex.x, vertex.y);
    else ctx.lineTo(vertex.x, vertex.y);
  });
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = hit ? hitColor : "#818cf8";
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
  ctx.fillText("collision detected", canvasWidth / 2, 40);
  ctx.restore();
}

class LineToRectangleCollision extends AnimationBaseClass {
  static t = "line to rectangle collision";
  static l = "line-to-rectangle-collision";
  static f = LinePolygon;
  title = "line to rectangle collision";
  animationObject = LinePolygon;
  line: Line = {
    startPoint: { x: 0, y: 0 },
    endPoint: { x: 0, y: 0 },
  };
  rect = RectangleObject.keyFunction(100, 100, 0);
  rotate1: number = 0;
  lineLength: number = 100;
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

    this.rect = RectangleObject.keyFunction(100, 100, 0, {
      rotate: true,
      rotateSpeed: 2000,
      time: performance.now(),
    });
    this.rect.vertices.forEach((rect: Point) => {
      rect.x += this.halfWidth;
      rect.y += this.halfHeight;
    });

    let { x, y } = this.makePointMove();
    let x1 = x + this.lineLength * Math.cos(2 * Math.PI * (this.rotate1 / 360));
    let y1 = y + this.lineLength * Math.sin(2 * Math.PI * (this.rotate1 / 360));
    let x2 = x - this.lineLength * Math.cos(2 * Math.PI * (this.rotate1 / 360));
    let y2 = y - this.lineLength * Math.sin(2 * Math.PI * (this.rotate1 / 360));
    this.rotate1++;
    if (this.rotate1 > 360) {
      this.rotate1 = 0;
    }

    this.line.startPoint = { x: x1, y: y1 };
    this.line.endPoint = { x: x2, y: y2 };
    const hit = LinePolygon.keyFunction(this.rect, this.line);
    drawLineToRectangle(
      this.ctx,
      this.rect,
      this.line,
      hit,
      this.canvasWidth
    );

    this.raf(this.draw);
  };
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default LineToRectangleCollision;
