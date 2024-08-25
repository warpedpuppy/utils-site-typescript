import { Point } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";
class MoveItemAroundCircle extends AnimationBaseClass {
  static t: string = "find points on a circle";
  static l: string = "find-points-on-a-circle";
  title = "find points on a circle";
  i: number = 0;
  keyFunction(
    circleCenter: Point,
    radius: number,
    percentageAroundCircle: number
  ) {
    let totalCircleRadians = Math.PI * 2;
    let percent = percentageAroundCircle / 100;
    const x = circleCenter.x + radius * Math.cos(totalCircleRadians * percent);
    const y = circleCenter.y + radius * Math.sin(totalCircleRadians * percent);
    return { x, y };
  }
  init() {
    this.draw();
  }
  draw = () => {
    if (!this.canvas || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas?.width, this.canvas?.height);
    this.ctx.strokeStyle = "green";
    this.ctx.lineWidth = 2;

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

    let point = this.keyFunction(
      { x: this.halfWidth, y: this.halfHeight },
      200,
      this.i
    );
    this.i += 0.5;
    if (this.i > 100) this.i = 0;
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI);
    this.ctx.stroke();

    this.ctx.strokeStyle = "rgba(0 0 0 / 0.25)";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(this.halfWidth, this.halfHeight);
    this.ctx.lineTo(point.x, point.y);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(point.x, point.y);
    this.ctx.lineTo(point.x, this.halfHeight);
    this.ctx.stroke();

    requestAnimationFrame(this.draw);
  };
}
export default MoveItemAroundCircle;
