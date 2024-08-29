import { Line } from "../../../types/shapes";
import AnimationBaseClass from "../AnimationBaseClass";
import { LineLine } from "../../formulas/collision-detection/LineCollision";
import { SineCurve } from "../../formulas/animation/SineCurve";

class LineToLineCollision extends AnimationBaseClass {
  static t = "line to line collision";
  static l = "line-to-line-collision";
  title = "line to line collision";
  animationObject = LineLine;
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
    let x = SineCurve.keyFunction(this.halfWidth, 200, 0.001);
    let y = SineCurve.keyFunction(this.halfHeight, 200, 0.001);
    return { x, y };
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    if (LineLine.keyFunction(this.line1, this.line2).hit) {
      this.ctx.strokeStyle = "red";
    } else {
      this.ctx.strokeStyle = "black";
    }

    this.ctx.lineWidth = 3;

    let { x, y } = this.makePointMove();
    let x1 = x + this.lineLength * Math.cos(2 * Math.PI * (this.rotate1 / 360));
    let y1 = y + this.lineLength * Math.sin(2 * Math.PI * (this.rotate1 / 360));
    let x2 = x - this.lineLength * Math.cos(2 * Math.PI * (this.rotate1 / 360));
    let y2 = y - this.lineLength * Math.sin(2 * Math.PI * (this.rotate1 / 360));
    this.rotate1++;
    if (this.rotate1 > 360) {
      this.rotate1 = 0;
    }

    this.line1.startPoint = { x: x1, y: y1 };
    this.line1.endPoint = { x: x2, y: y2 };

    this.ctx.beginPath();
    this.ctx.moveTo(this.line1.startPoint.x, this.line1.startPoint.y);
    this.ctx.lineTo(this.line1.endPoint.x, this.line1.endPoint.y);
    this.ctx.stroke();

    this.line2.startPoint = { x: this.halfWidth - 100, y: this.halfHeight };
    this.line2.endPoint = { x: this.halfWidth + 100, y: this.halfHeight };

    this.ctx.beginPath();
    this.ctx.moveTo(this.line2.startPoint.x, this.line2.startPoint.y);
    this.ctx.lineTo(this.line2.endPoint.x, this.line2.endPoint.y);
    this.ctx.stroke();

    requestAnimationFrame(this.draw);
  };
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default LineToLineCollision;
