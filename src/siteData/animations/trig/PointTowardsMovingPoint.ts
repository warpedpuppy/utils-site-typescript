import { Nullable, Point } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";
class PointTowardsMovingPoint extends AnimationBaseClass {
  static t = "point one object towards a moving object";
  static l = "point-one-object-towards-a-moving-object";
  title = "point one object towards a moving object";
  img = new Image();
  i = 0;
  keyFunction(originPoint: Point, destinationPoint: Point) {
    return Math.atan2(
      destinationPoint.y - originPoint.y,
      destinationPoint.x - originPoint.x
    );
  }
  init() {
    if (!this.canvas || !this.ctx) return;
    this.img.addEventListener("load", () => {
      if (!this.ctx) return;
      this.ctx.drawImage(this.img, 0, 0);
      this.draw();
    });
    this.img.src = "/bmps/arrow.png";
  }
  pointsAroundCircle(
    circleCenter: Point,
    i: number,
    radius: number,
    numElements: number
  ) {
    const x =
      circleCenter.x + radius * Math.cos(2 * Math.PI * (i / numElements));
    const y =
      circleCenter.y + radius * Math.sin(2 * Math.PI * (i / numElements));
    return { x, y };
  }
  draw = () => {
    if (!this.canvas || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas?.width, this.canvas?.height);

    this.ctx.beginPath();
    this.ctx.moveTo(0, this.halfHeight);
    this.ctx.lineTo(this.canvasWidth, this.halfHeight);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.halfWidth, 0);
    this.ctx.lineTo(this.halfWidth, this.canvasHeight);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(this.halfWidth, this.halfHeight, 200, 0, 2 * Math.PI);
    this.ctx.stroke();

    this.ctx.strokeStyle = "grey";
    this.ctx.lineWidth = 2;

    let point = this.pointsAroundCircle(
      { x: this.halfWidth, y: this.halfHeight },
      this.i,
      200,
      360
    );

    this.i += 0.5;
    if (this.i > 360) this.i = 0;
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI);
    this.ctx.stroke();

    let angle = this.keyFunction(
      {
        x: this.halfWidth,
        y: this.halfHeight,
      },
      point
    );

    this.ctx.translate(this.halfWidth, this.halfHeight);
    this.ctx.rotate(angle);
    this.ctx.translate(-this.halfWidth, -this.halfHeight);

    this.ctx.drawImage(this.img, this.halfWidth - 50, this.halfHeight - 25);
    this.ctx.resetTransform();

    requestAnimationFrame(this.draw);
  };
}
export default PointTowardsMovingPoint;
