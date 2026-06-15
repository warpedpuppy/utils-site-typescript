import { Point } from "../../../types/shapes";
import AnimationBaseClass from "../AnimationBaseClass";
import { DistributeAroundCircle } from "../../formulas/animation/DistributeAroundCircle";

class DistributePointsAroundACircle extends AnimationBaseClass {
  static t: string = "distribute around circle";
  static l: string = "distribute-around-circle";
  static f = DistributeAroundCircle;
  title: string = "distribute around circle";
  totalItems: number = 20;
  animationObject = DistributeAroundCircle;
  init() {
    this.draw();
  }
  extraHTML = () => {
    let options = [];
    for (let i = 5; i <= 100; i += 5) {
      options.push(
        <option value={i} key={`extra-html-options-${i}`}>
          {i}
        </option>
      );
    }
    return (
      <div className="extra-html">
        <label>change item quantity: </label>
        <select
          onChange={(e) => this.totalItemsChangeHandler(e.currentTarget.value)}
          defaultValue={this.totalItems}
        >
          {options}
        </select>
      </div>
    );
  };
  totalItemsChangeHandler = (num: string) => {
    this.totalItems = Number(num);
  };
  resizeHandler = () => {
    if (!this.canvas) return;
    if (this.cont) {
      this.canvas.width = this.canvasWidth = this.cont.clientWidth;
      this.canvas.height = this.canvasHeight = this.cont.clientHeight;
      this.halfHeight = this.canvasHeight / 2;
      this.halfWidth = this.canvasWidth / 2;
    }
  };
  cosWave(startValue: number, differential: number, speed: number) {
    const currentDate = new Date();
    return startValue + Math.cos(currentDate.getTime() * speed) * differential;
  }
  draw = () => {
    if (!this.canvas || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas?.height);

    let radius = this.cosWave(100, 100, 0.001);

    this.ctx.strokeStyle = "rgba(255,255,255,0.3)";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(this.halfWidth, 0);
    this.ctx.lineTo(this.halfWidth, this.canvasHeight);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(this.halfWidth, this.halfHeight, radius, 0, 2 * Math.PI);
    this.ctx.stroke();

    let points = DistributeAroundCircle.keyFunction(
      { x: this.halfWidth, y: this.halfHeight },
      radius,
      this.totalItems
    );
    points.forEach((point: Point) => {
      if (!this.ctx) return;
      this.ctx.strokeStyle = "rgba(255,255,255,0.3)";
      this.ctx.lineWidth = 2;

      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI);

      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(this.halfWidth, this.halfHeight);
      this.ctx.lineTo(point.x, point.y);
      this.ctx.stroke();
    });
    this.raf(this.draw);
  };
}
export default DistributePointsAroundACircle;
