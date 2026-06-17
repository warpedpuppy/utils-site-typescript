import { Line } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { RectangleObject } from "../pages/createJSON/formulas/animation/Rectangle";
import { SineCurve } from "../pages/createJSON/formulas/animation/SineCurve";
import { LinePolygon } from "../pages/createJSON/formulas/collision-detection/LineCollision";
import { Point } from "../types/shapes";

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
    let x = SineCurve.keyFunction(this.halfWidth, 200, 0.001);
    let y = SineCurve.keyFunction(this.halfHeight, 200, 0.001);
    return { x, y };
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "rgba(255,255,255,0.85)";

    const hit = LinePolygon.keyFunction(this.rect, this.line);
    this.ctx.fillStyle = hit ? "red" : "rgba(255,255,255,0.85)";

    this.rect = RectangleObject.keyFunction(100, 100, 0, false);
    this.ctx.beginPath();
    this.rect.vertices.forEach((rect: Point, i: number) => {
      rect.x += this.halfWidth;
      rect.y += this.halfHeight;
      if (i === 0) {
        this.ctx?.moveTo(rect.x, rect.y);
      } else {
        this.ctx?.lineTo(rect.x, rect.y);
      }
    });
    this.ctx.closePath();
    this.ctx.fill();

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

    this.ctx.beginPath();
    this.ctx.moveTo(this.line.startPoint.x, this.line.startPoint.y);
    this.ctx.lineTo(this.line.endPoint.x, this.line.endPoint.y);
    this.ctx.stroke();

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
export default LineToRectangleCollision;
