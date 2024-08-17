import { Point } from "../../../types/types";
import Template from "../animationTemplate";

class getHalfwayPointofLine extends Template {
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
    console.log(this.ctx);
    this.draw();
  }
  draw = () => {
    if (!this.ctx || !this.canvas || !this.startPoint || !this.endPoint) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = "bold 18px Arial";
    this.ctx.fillText("click and drag to form a line", 10, 50);

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
      console.log(this.endPoint);
      this.draw();
    }
  }
  pointerUpHandler(e: PointerEvent) {
    this.allowDraw = false;
  }
}
export default getHalfwayPointofLine;
