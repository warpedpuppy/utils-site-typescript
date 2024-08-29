import { Point } from "../../../types/shapes";
import { Nullable } from "../../../types/types";
import { LineLength } from "../../formulas/animation/LineLength";
import AnimationBaseClass from "../AnimationBaseClass";

class DistanceBetweenTwoPoints extends AnimationBaseClass {
  static t = "get line length";
  static l = "line-length";
  title = "get line length";
  startPoint: Nullable<Point> = null;
  animationObject = LineLength;
  endPoint: Nullable<Point> = null;
  allowDraw: boolean = false;
  init() {
    if (this.textDiv)
      this.textDiv.innerHTML = `<h3>Click and drag on the screen to draw line.</h3>`;
    this.startPoint = { x: this.halfWidth - 100, y: this.halfHeight + 100 };
    this.endPoint = { x: this.halfWidth + 100, y: this.halfHeight - 100 };
    this.draw();
  }
  draw = () => {
    if (!this.canvas || !this.ctx || !this.startPoint || !this.endPoint) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = "bold 12px Verdana";
    this.ctx.beginPath();
    this.ctx.strokeStyle = "green";
    this.ctx.lineWidth = 3;

    // ADJACENT
    this.ctx.strokeStyle = "blue";
    this.ctx.lineWidth = 0.25;
    this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
    this.ctx.lineTo(this.endPoint.x, this.startPoint.y);
    let adjacent = LineLength.keyFunction({
      startPoint: { x: this.startPoint.x, y: this.startPoint.y },
      endPoint: { x: this.endPoint.x, y: this.startPoint.y },
    });
    if (this.endPoint.x < this.startPoint.x) adjacent *= -1;
    this.ctx.fillText(
      `${Math.abs(adjacent)} pixels`,
      this.startPoint.x + adjacent / 2,
      this.startPoint.y
    );
    this.ctx.stroke();

    // OPPOSITE
    this.ctx.moveTo(this.endPoint.x, this.startPoint.y);
    this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
    let opposite = LineLength.keyFunction({
      startPoint: { x: this.endPoint.x, y: this.startPoint.y },
      endPoint: { x: this.endPoint.x, y: this.endPoint.y },
    });
    if (this.endPoint.y > this.startPoint.y) opposite *= -1;
    let textY = this.startPoint.y - opposite * 0.75;
    this.ctx.translate(this.endPoint.x, textY);
    this.ctx.rotate(Math.PI / 2);
    this.ctx.translate(-this.endPoint.x, -textY);
    this.ctx.fillText(`${Math.abs(opposite)} pixels`, this.endPoint.x, textY);
    this.ctx.stroke();
    this.ctx.resetTransform();

    // HYPOTENUSE
    let hypotenuse = Math.floor(
      LineLength.keyFunction({
        startPoint: this.startPoint,
        endPoint: this.endPoint,
      })
    );
    this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
    this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
    this.ctx.stroke();
    textY = this.startPoint.y;
    this.ctx.translate(this.startPoint.x, textY);
    let angle = this.getHypAngle(this.startPoint, this.endPoint);
    this.ctx.rotate(angle);
    this.ctx.translate(-this.startPoint.x, -textY);

    this.ctx.fillText(
      `${Math.abs(hypotenuse)} pixels`,
      this.startPoint.x + hypotenuse * 0.25,
      textY
    );
    this.ctx.stroke();
    this.ctx.resetTransform();

    this.ctx.beginPath();
    this.ctx.arc(
      this.startPoint.x,
      this.startPoint.y,
      hypotenuse,
      0,
      2 * Math.PI
    );
    this.ctx.stroke();
    requestAnimationFrame(this.draw);
  };
  getHypAngle(originPoint: Point, destinationPoint: Point) {
    return Math.atan2(
      destinationPoint.y - originPoint.y,
      destinationPoint.x - originPoint.x
    );
  }
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
