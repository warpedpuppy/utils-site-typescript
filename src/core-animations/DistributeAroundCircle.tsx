import { Point } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { distributeAroundCircle } from "@utilspalooza/core/DistributeAroundCircle";
import { DistributeAroundCircle as distributeFormula } from "../pages/createJSON/formulas/animation/DistributeAroundCircle";

function cosWave(startValue: number, differential: number, speed: number): number {
  const currentDate = new Date();
  return startValue + Math.cos(currentDate.getTime() * speed) * differential;
}

function drawDistributeAroundCircle(
  ctx: any,
  canvasWidth: any,
  canvasHeight: any,
  totalItems: number,
  distributeAroundCircleFn: (
    centerPoint: Point,
    radius: number,
    totalItems: number
  ) => Point[]
): void {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const halfWidth = canvasWidth / 2;
  const halfHeight = canvasHeight / 2;

  let radius = cosWave(100, 100, 0.001);

  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(halfWidth, 0);
  ctx.lineTo(halfWidth, canvasHeight);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(halfWidth, halfHeight, radius, 0, 2 * Math.PI);
  ctx.stroke();

  let points = distributeAroundCircleFn(
    { x: halfWidth, y: halfHeight },
    radius,
    totalItems
  );
  points.forEach((point: Point) => {
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI);

    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(halfWidth, halfHeight);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  });
}

export { drawDistributeAroundCircle };

export default class DistributePointsAroundACircle extends AnimationBaseClass {
  static t: string = "distribute around circle";
  static l: string = "distribute-around-circle";
  static f = distributeFormula;
  title: string = "distribute around circle";
  totalItems: number = 20;
  animationObject = distributeFormula;

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

  draw = () => {
    if (!this.canvas || !this.ctx) return;
    drawDistributeAroundCircle(
      this.ctx,
      this.canvasWidth,
      this.canvasHeight,
      this.totalItems,
      distributeAroundCircle
    );
    this.raf(this.draw);
  };

  pointerDownHandler(_e: PointerEvent) {}
  pointerUpHandler(_e: PointerEvent) {}
  pointerMoveHandler(_e: PointerEvent) {}
}
