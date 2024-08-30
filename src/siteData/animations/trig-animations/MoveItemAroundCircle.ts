import AnimationBaseClass from "../AnimationBaseClass";
import { FindPointAroundCircle } from "../../formulas/animation/FindPointAroundCircle";
class MoveItemAroundCircle extends AnimationBaseClass {
  static t: string = "find points on a circle";
  static l: string = "find-points-on-a-circle";
  static f = FindPointAroundCircle;
  title = "find points on a circle";
  animationObject = FindPointAroundCircle;
  i: number = 0;

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

    let point = FindPointAroundCircle.keyFunction(
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
