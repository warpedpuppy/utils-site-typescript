import { GenericObject, Point, Line, Circle } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";

class LineToCircleCollision extends AnimationBaseClass {
  static t = "line to line collision";
  static l = "line-to-line-collision";
  title = "line to circle collision";
  line1: Line = {
    startPoint: { x: 0, y: 0 },
    endPoint: { x: 0, y: 0 },
  };
  line2: Line = {
    startPoint: { x: 0, y: 0 },
    endPoint: { x: 0, y: 0 },
  };
  init() {
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // if (this.keyFunction(this.line, this.circle)) {
    //   this.ctx.fillStyle = "red";
    // } else {
    //   this.ctx.fillStyle = "transparent";
    // }

    // this.ctx.beginPath();
    // this.ctx.arc(
    //   this.circle.x,
    //   this.circle.y,
    //   this.circle.radius,
    //   0,
    //   2 * Math.PI
    // );
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(this.line1.startPoint.x, this.line1.startPoint.y);
    this.ctx.lineTo(this.line1.endPoint.x, this.line1.endPoint.y);
    this.ctx.stroke();

    requestAnimationFrame(this.draw);
  };
  keyFunction(line1: Line, line2: Line) {
    // calculate the distance to intersection point
    let uA =
      ((line2.endPoint.x - line2.startPoint.x) *
        (line1.startPoint.y - line2.startPoint.y) -
        (line2.endPoint.y - line2.startPoint.y) *
          (line1.startPoint.x - line2.startPoint.x)) /
      ((line2.endPoint.y - line2.startPoint.y) *
        (line1.endPoint.x - line1.startPoint.x) -
        (line2.endPoint.x - line2.startPoint.x) *
          (line1.endPoint.y - line1.startPoint.y));
    let uB =
      ((line1.endPoint.x - line1.startPoint.x) *
        (line1.startPoint.y - line2.startPoint.y) -
        (line1.endPoint.y - line1.startPoint.y) *
          (line1.startPoint.x - line2.startPoint.x)) /
      ((line2.endPoint.y - line2.startPoint.y) *
        (line1.endPoint.x - line1.startPoint.x) -
        (line2.endPoint.x - line2.startPoint.x) *
          (line1.endPoint.y - line1.startPoint.y));

    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
      // optionally, draw a circle where the lines meet
      // let intersectionX =
      //   line1.startPoint.x + uA * (line1.endPoint.x - line1.startPoint.x);
      // let intersectionY =
      //   line1.startPoint.y + uA * (line1.endPoint.y - line1.startPoint.y);
      return true;
    }
    return false;
  }
  pointCircle(point: Point, circle: Circle) {
    let distX = point.x - circle.x;
    let distY = point.y - circle.y;
    let distance = Math.sqrt(distX * distX + distY * distY);
    return distance <= circle.radius;
  }
  lineLength(startPoint: Point, endPoint: Point) {
    let a = startPoint.x - endPoint.x;
    let b = startPoint.y - endPoint.y;
    return Math.sqrt(a * a + b * b);
  }
  linePoint(line: Line, point: Point) {
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
  pointerDownHandler(e: PointerEvent) {
    let x = e.pageX - this.left;
    let y = e.pageY - this.top;
    this.line1.startPoint = { x, y };
    this.line1.endPoint = { x, y };
    this.allowDraw = true;
  }
  pointerUpHandler(e: PointerEvent) {
    this.allowDraw = false;
  }
  pointerMoveHandler(e: PointerEvent) {
    if (this.allowDraw) {
      let x = e.pageX - this.left;
      let y = e.pageY - this.top;
      this.line1.endPoint = { x, y };
    }
  }
}
export default LineToCircleCollision;
