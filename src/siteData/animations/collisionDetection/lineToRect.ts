import { Rectangle, Point, Line, Circle } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";

class LineToRectangleCollision extends AnimationBaseClass {
  static t = "line to rectangle collision";
  static l = "line-to-rectangle-collision";
  title = "line to rectangle collision";
  line: Line = {
    startPoint: { x: 0, y: 0 },
    endPoint: { x: 0, y: 0 },
  };
  rect: Rectangle = {
    x: this.halfWidth - 100,
    y: this.halfHeight - 100,
    width: 200,
    height: 200,
    vx: 0,
    vy: 0,
    id: "rect",
  };
  init() {
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    if (this.keyFunction(this.line, this.rect)) {
      this.ctx.strokeStyle = "red";
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.strokeStyle = "black";
      this.ctx.fillStyle = "black";
    }

    this.ctx.lineWidth = 3;

    this.ctx.beginPath();
    this.ctx.moveTo(this.line.startPoint.x, this.line.startPoint.y);
    this.ctx.lineTo(this.line.endPoint.x, this.line.endPoint.y);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    this.ctx.stroke();
    this.ctx.fill();

    requestAnimationFrame(this.draw);
  };
  keyFunction(line: Line, rectangle: Rectangle) {
    // check if the line has hit any of the rectangle's sides
    // uses the Line/Line function below
    let { x, y, width, height } = rectangle;
    let leftSide: Line = {
      startPoint: { x, y },
      endPoint: { x, y: y + height },
    };
    let rightSide: Line = {
      startPoint: { x: x + width, y },
      endPoint: { x: x + width, y: y + height },
    };
    let topSide: Line = {
      startPoint: { x, y },
      endPoint: { x: x + width, y },
    };
    let bottomSide: Line = {
      startPoint: { x, y: y + height },
      endPoint: { x: x + width, y: y + height },
    };

    let left = this.lineToLine(line, leftSide).hit;
    let right = this.lineToLine(line, rightSide).hit;
    let top = this.lineToLine(line, topSide).hit;
    let bottom = this.lineToLine(line, bottomSide).hit;

    // if ANY of the above are true, the line
    // has hit the rectangle
    if (left || right || top || bottom) {
      return true;
    }
    return false;
  }
  lineToLine(line1: Line, line2: Line) {
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
      let intersectionX =
        line1.startPoint.x + uA * (line1.endPoint.x - line1.startPoint.x);
      let intersectionY =
        line1.startPoint.y + uA * (line1.endPoint.y - line1.startPoint.y);
      return {
        hit: true,
        intersectionX,
        intersectionY,
      };
    }
    return { hit: false };
  }
  pointerDownHandler(e: PointerEvent) {
    let x = e.pageX - this.left;
    let y = e.pageY - this.top;
    this.line.startPoint = { x, y };
    this.line.endPoint = { x, y };
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
export default LineToRectangleCollision;
