import { Point } from "../../../types/shapes";
import AnimationBaseClass from "../AnimationBaseClass";

class getHalfwayPointofLine extends AnimationBaseClass {
  static t = "get halfway point in line";
  static l = "halfway-point-in-line";
  title = "get halfway point in line";
  keyFunction(start: Point, end: Point) {
    return {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    };
  }
  init() {
    this.startPoint = { x: this.halfWidth - 100, y: this.halfHeight + 100 };
    this.endPoint = { x: this.halfWidth + 100, y: this.halfHeight - 100 };
    this.draw();
  }
  draw = () => {
    if (!this.ctx || !this.canvas || !this.startPoint || !this.endPoint) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.strokeStyle = "green";
    this.ctx.lineWidth = 10;
    this.ctx.beginPath();
    this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
    this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
    this.ctx.stroke();

    let point: Point = this.keyFunction(this.startPoint, this.endPoint);

    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    this.ctx.stroke();
    if (this.textDiv) this.textDiv.innerHTML = `Click and drag to draw a line`;
    requestAnimationFrame(this.draw);
  };
  pointerDownHandler(e: PointerEvent) {
    this.startPoint = {
      x: Math.floor(e.pageX - this.left),
      y: Math.floor(e.pageY - this.top),
    };
    this.allowDraw = true;
  }
  pointerMoveHandler(e: PointerEvent) {
    if (this.allowDraw) {
      this.endPoint = {
        x: Math.floor(e.pageX - this.left),
        y: Math.floor(e.pageY - this.top),
      };
      this.draw();
    }
  }
  pointerUpHandler(e: PointerEvent) {
    this.allowDraw = false;
  }
}
export default getHalfwayPointofLine;
