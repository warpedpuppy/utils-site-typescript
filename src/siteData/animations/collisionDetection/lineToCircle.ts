import { GenericObject, Point, Line, Circle } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";

class LineToCircleCollision extends AnimationBaseClass {
  static t = "line to circle collision";
  static l = "line-to-circle-collision";
  title = "line to circle collision";
  line: Line = {
    startPoint: { x: 0, y: 0 },
    endPoint: { x: 0, y: 0 },
  };
  circle: Circle = {
    x: this.halfWidth,
    y: this.halfHeight,
    radius: 200,
    vx: 0,
    vy: 0,
    id: "circle",
  };
  init() {
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    if (this.keyFunction(this.line, this.circle)) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "transparent";
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
  keyFunction(line: Line, circle: Circle) {
    let inside1 = this.pointCircle(line.startPoint, circle);
    let inside2 = this.pointCircle(line.endPoint, circle);
    if (inside1 || inside2) return true;

    // get length of the line
    let distX = line.startPoint.x - line.endPoint.x;
    let distY = line.startPoint.y - line.endPoint.y;
    let len = Math.sqrt(distX * distX + distY * distY);

    // get dot product of the line and circle
    let dot =
      ((circle.x - line.startPoint.x) * (line.endPoint.x - line.startPoint.x) +
        (circle.y - line.startPoint.y) *
          (line.endPoint.y - line.startPoint.y)) /
      Math.pow(len, 2);

    // find the closest point on the line
    let closestX =
      line.startPoint.x + dot * (line.endPoint.x - line.startPoint.x);
    let closestY =
      line.startPoint.y + dot * (line.endPoint.y - line.startPoint.y);

    // is this point actually on the line segment?
    // if so keep going, but if not, return false
    let onSegment = this.linePoint(line, { x: closestX, y: closestY });
    if (!onSegment) return false;

    // optionally, draw a circle at the closest
    // point on the line
    // fill(255,0,0);
    // noStroke();
    // ellipse(closestX, closestY, 20, 20);

    // get distance to closest point
    distX = closestX - circle.x;
    distY = closestY - circle.y;
    let distance = Math.sqrt(distX * distX + distY * distY);

    if (distance <= circle.radius) {
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
    this.line.startPoint = { x, y };
    this.allowDraw = true;
  }
  pointerUpHandler(e: PointerEvent) {
    this.allowDraw = false;
  }
  pointerMoveHandler(e: PointerEvent) {
    if (this.allowDraw) {
      let x = e.pageX - this.left;
      let y = e.pageY - this.top;
      this.line.endPoint = { x, y };
    }
  }
}
export default LineToCircleCollision;
