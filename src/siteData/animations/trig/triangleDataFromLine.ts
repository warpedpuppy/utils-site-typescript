import { Point, Nullable } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";
class TriangleDataFromLine extends AnimationBaseClass {
  static t = "get triangle data from line";
  static l = "get-triangle-data-from-line";
  title = "get triangle data from line";
  allowDraw: boolean = false;
  keyFunction(startPoint: Point, endPoint: Point) {
    let hypotenuse = distanceBetweenPoints(startPoint, endPoint);
    let adjacent = distanceBetweenPoints(startPoint, {
      x: endPoint.x,
      y: startPoint.y,
    });
    let opposite = distanceBetweenPoints(
      {
        x: endPoint.x,
        y: startPoint.y,
      },
      endPoint
    );

    let oh = opposite / hypotenuse;
    let angle1 = Math.asin(oh); // could have used acos or atan -- we have the data
    let angleInDegrees = Math.floor(angle1 * (180 / Math.PI));
    let remainingAngle = 180 - angleInDegrees - 90;

    return { angleInDegrees, remainingAngle, hypotenuse, adjacent, opposite };

    function distanceBetweenPoints(startPoint: Point, endPoint: Point) {
      let a = startPoint.x - endPoint.x;
      let b = startPoint.y - endPoint.y;
      return Math.sqrt(a * a + b * b);
    }
  }
  init() {
    this.draw();
  }
  draw = () => {
    if (
      !this.canvas ||
      !this.ctx ||
      !this.startPoint ||
      !this.endPoint ||
      !this.textDiv
    )
      return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.beginPath();
    this.ctx.strokeStyle = "green";
    this.ctx.lineWidth = 3;
    this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
    this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
    this.ctx.stroke();
    this.ctx.fillText("A", this.startPoint.x, this.startPoint.y);

    this.ctx.strokeStyle = "grey";
    this.ctx.lineWidth = 0.25;
    this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
    this.ctx.lineTo(this.endPoint.x, this.startPoint.y);
    this.ctx.stroke();
    this.ctx.fillText("C", this.endPoint.x, this.startPoint.y);

    this.ctx.moveTo(this.endPoint.x, this.startPoint.y);
    this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
    this.ctx.stroke();
    this.ctx.fillText("B", this.endPoint.x, this.endPoint.y);

    let radius = this.distanceBetweenPoints(this.startPoint, this.endPoint);

    let { angleInDegrees, remainingAngle, hypotenuse, opposite, adjacent } =
      this.keyFunction(this.startPoint, this.endPoint);

    this.textDiv.innerHTML = `
        <h3>click and drag to draw line and get data.</h3>
        <h5>the hypotenuse  is ${Math.floor(hypotenuse)} pixels long.</h5>
        <h5>the adjacent  is ${Math.floor(adjacent)} pixels long.</h5>
        <h5>the opposite  is ${Math.floor(opposite)} pixels long.</h5>
        <h5>angle "A" is ${Math.floor(angleInDegrees)} degrees.</h5>
        <h5>angle "B" is ${Math.floor(remainingAngle)} degrees.</h5>
        <h5>angle "C" is 90 degrees.</h3>
        `;

    this.ctx.beginPath();
    this.ctx.arc(this.startPoint.x, this.startPoint.y, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  };
  distanceBetweenPoints(startPoint: Point, endPoint: Point) {
    let a = startPoint.x - endPoint.x;
    let b = startPoint.y - endPoint.y;
    return Math.sqrt(a * a + b * b);
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
export default TriangleDataFromLine;
