import { Point } from "../../../types/shapes";
import { Nullable } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";

class DistanceBetweenTwoPoints extends AnimationBaseClass {
  static t = "get distance between two points";
  static l = "distance-between-points";
  title = "get distance between two points";
  startPoint: Nullable<Point> = null;
  endPoint: Nullable<Point> = null;
  allowDraw: boolean = false;
  keyFunction(startPoint: Point, endPoint: Point) {
    let a = startPoint.x - endPoint.x;
    let b = startPoint.y - endPoint.y;
    return Math.sqrt(a * a + b * b);
  }
  init() {
    this.startPoint = { x: this.halfWidth - 100, y: this.halfHeight + 100 };
    this.endPoint = { x: this.halfWidth + 100, y: this.halfHeight - 100 };
    this.draw();
  }
  draw = () => {
    if (!this.canvas || !this.ctx || !this.startPoint || !this.endPoint) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = "bold 18px sans serif";
    this.ctx.beginPath();
    this.ctx.strokeStyle = "green";
    this.ctx.lineWidth = 3;
    this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
    this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
    this.ctx.stroke();
    this.ctx.fillText(
      `{x: ${this.startPoint.x}, y: ${this.startPoint.y}}`,
      this.startPoint.x,
      this.startPoint.y
    );
    this.ctx.fillText(
      `{x: ${this.endPoint.x}, y: ${this.endPoint.y}}`,
      this.endPoint.x,
      this.endPoint.y
    );

    this.ctx.strokeStyle = "grey";
    this.ctx.lineWidth = 0.25;
    this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
    this.ctx.lineTo(this.endPoint.x, this.startPoint.y);
    this.ctx.stroke();

    this.ctx.moveTo(this.endPoint.x, this.startPoint.y);
    this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
    this.ctx.stroke();

    let radius = this.keyFunction(this.startPoint, this.endPoint);
    if (this.textDiv)
      this.textDiv.innerHTML = `<h3>Click and drag on the screen to draw line.</h3>
      <h4>the green line is ${Math.floor(radius)} pixels long.</h4>`;
    this.ctx.beginPath();
    this.ctx.arc(this.startPoint.x, this.startPoint.y, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
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
export default DistanceBetweenTwoPoints;
