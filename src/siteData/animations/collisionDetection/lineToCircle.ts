import { Line, Circle } from "../../../types/shapes";
import AnimationBaseClass from "../AnimationBaseClass";
import { LineCircle } from "../../formulas/collision-detection/LineCollision";
import { SineCurve } from "../../formulas/animation/SineCurve";
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

    if (LineCircle.keyFunction(this.line, this.circle)) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "transparent";
    }
    this.circle.x = this.halfWidth;
    this.circle.y = this.halfHeight;
    this.ctx.beginPath();
    this.ctx.arc(
      this.circle.x,
      this.circle.y,
      this.circle.radius,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
    this.ctx.stroke();

    let { x, y } = this.makePointMove();
    let x1 = x + this.lineLength * Math.cos(2 * Math.PI * (this.rotate / 360));
    let y1 = y + this.lineLength * Math.sin(2 * Math.PI * (this.rotate / 360));
    let x2 = x - this.lineLength * Math.cos(2 * Math.PI * (this.rotate / 360));
    let y2 = y - this.lineLength * Math.sin(2 * Math.PI * (this.rotate / 360));
    this.line.startPoint = { x: x1, y: y1 };
    this.line.endPoint = { x: x2, y: y2 };

    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);

    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();

    this.rotate++;
    if (this.rotate > 360) {
      this.rotate = 0;
    }
    requestAnimationFrame(this.draw);
  };
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default LineToCircleCollision;
