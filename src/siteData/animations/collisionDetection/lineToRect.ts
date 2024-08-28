import { Line } from "../../../types/shapes";
import AnimationBaseClass from "../AnimationBaseClass";
import { Rectangle } from "../utils/animation/Rectangle";
import { SineCurve } from "../utils/animation/SineCurve";
import { LinePolygon } from "../utils/collision-detection/LineCollision";

class LineToRectangleCollision extends AnimationBaseClass {
  static t = "line to rectangle collision";
  static l = "line-to-rectangle-collision";
  title = "line to rectangle collision";
  animationObject = LinePolygon;
  line: Line = {
    startPoint: { x: 0, y: 0 },
    endPoint: { x: 0, y: 0 },
  };
  rect: Rectangle = new Rectangle(100, 100, 0, this.ctx, false, "rect", {
    stroke: false,
    fill: true,
    spinSpeed: 3,
  });
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
    this.ctx.strokeStyle = "black";

    if (LinePolygon.keyFunction(this.rect.returnRectangle(), this.line)) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "black";
    }

    this.rect.draw(this.top, this.left, {
      x: this.halfWidth,
      y: this.halfHeight,
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

    this.ctx.beginPath();
    this.ctx.moveTo(this.line.startPoint.x, this.line.startPoint.y);
    this.ctx.lineTo(this.line.endPoint.x, this.line.endPoint.y);
    this.ctx.stroke();

    requestAnimationFrame(this.draw);
  };
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default LineToRectangleCollision;
