import { GenericObject, Point, Line, Circle } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";

class LineToPointCollision extends AnimationBaseClass {
  static t = "line to point collision";
  static l = "line-to-point-collision";
  title = "line to point collision";
  line: Line = {
    startPoint: { x: 0, y: 0 },
    endPoint: { x: this.canvasWidth, y: this.canvasHeight },
  };
  circle: Circle = {
    x: this.halfWidth,
    y: this.halfHeight,
    radius: 5,
    vx: 0,
    vy: 0,
    id: "circle",
  };
  mousePoint: Point = {
    x: 0,
    y: 0,
  };
  init() {
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    if (this.keyFunction(this.line, this.mousePoint)) {
      this.ctx.fillStyle = "red";
      this.ctx.strokeStyle = "red";
    } else {
      this.ctx.fillStyle = "black";
      this.ctx.strokeStyle = "black";
    }

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

    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(this.line.startPoint.x, this.line.startPoint.y);
    this.ctx.lineTo(this.line.endPoint.x, this.line.endPoint.y);
    this.ctx.stroke();

    requestAnimationFrame(this.draw);
  };
  keyFunction(line: Line, point: Point) {
    // get distance from the point to the two ends of the line
    let d1 = this.lineLength(point, line.startPoint);
    let d2 = this.lineLength(point, line.endPoint);

    // get the length of the line
    let lineLen = this.lineLength(line.startPoint, line.endPoint);

    // since floats are so minutely accurate, add
    // a little buffer zone that will give collision
    let buffer = 0.1; // higher # = less accurate

    // if the two distances are equal to the line's
    // length, the point is on the line!
    // note we use the buffer here to give a range,
    // rather than one #
    if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
      return true;
    }
    return false;
  }
  lineLength(startPoint: Point, endPoint: Point) {
    let a = startPoint.x - endPoint.x;
    let b = startPoint.y - endPoint.y;
    return Math.sqrt(a * a + b * b);
  }
  pointerDownHandler(e: PointerEvent) {
    // let x = e.pageX - this.left;
    // let y = e.pageY - this.top;
    // this.line.startPoint = { x, y };
    // this.line.endPoint = { x, y };
    // this.allowDraw = true;
  }
  pointerUpHandler(e: PointerEvent) {
    // this.allowDraw = false;
  }
  pointerMoveHandler(e: PointerEvent) {
    // if (this.allowDraw) {
    let x = e.pageX - this.left;
    let y = e.pageY - this.top;
    this.circle.x = this.mousePoint.x = x;
    this.circle.y = this.mousePoint.y = y;

    // }
  }
}
export default LineToPointCollision;
