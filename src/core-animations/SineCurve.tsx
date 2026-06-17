import AnimationBaseClass from "./AnimationBaseClass";
import { SineCurve } from "../core-functions/SineCurve";
import { SineCurve as sineCurveFormula } from "../pages/createJSON/formulas/animation/SineCurve";

function drawSineCurve(
  ctx: any,
  canvasWidth: any,
  canvasHeight: any,
  startValue: number,
  differential: number,
  speed: number
): void {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.strokeStyle = "green";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(0, canvasHeight / 2);
  ctx.lineTo(canvasWidth, canvasHeight / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(canvasWidth / 2, 0);
  ctx.lineTo(canvasWidth / 2, canvasHeight);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(canvasWidth / 2, canvasHeight / 2, 200, 0, 2 * Math.PI);
  ctx.stroke();

  let val = SineCurve(startValue, differential, speed);
  ctx.beginPath();
  ctx.arc(canvasWidth / 2, canvasHeight / 2 + val, 20, 0, 2 * Math.PI);
  ctx.stroke();
}

export { drawSineCurve };

export default class SineCurveAnimation extends AnimationBaseClass {
  static t: string = "sine curve";
  static l: string = "sine-curve";
  static f = sineCurveFormula;
  animationObject = sineCurveFormula;
  title = "sine curve";
  interval: any = 0;
  i: number = 0;
  startValue = 0;
  differential = 200;
  speed = 0.005;

  init() {
    this.draw();
  }

  changeHandler(value: any, type: string) {
    if (type === "starting") {
      this.startValue = value;
    } else if (type === "differential") {
      this.differential = value;
    } else if (type === "speed") {
      this.speed = value;
    }
  }

  extraHTML = () => {
    let startingOptions = [];
    let differentialOptions = [];
    let speedOptions = [];
    for (let i = 0; i <= 200; i += 5) {
      startingOptions.push(
        <option value={i} key={`extra-html-options-${i}`}>
          {i}
        </option>
      );
      differentialOptions.push(
        <option value={i} key={`extra-html-options-${i}`}>
          {i}
        </option>
      );
    }
    for (let i = 0.0005; i <= 0.05; i += 0.005) {
      speedOptions.push(
        <option value={i} key={`extra-html-options-${i}`}>
          {i}
        </option>
      );
    }
    return (
      <div className="extra-html-container">
        <div className="extra-html">
          <label>change starting value: </label>
          <select
            onChange={(e) =>
              this.changeHandler(e.currentTarget.value, "startValue")
            }
            defaultValue={this.startValue}
          >
            {startingOptions}
          </select>
        </div>
        <div className="extra-html">
          <label>change differential: </label>
          <select
            onChange={(e) =>
              this.changeHandler(e.currentTarget.value, "differential")
            }
            defaultValue={this.differential}
          >
            {differentialOptions}
          </select>
        </div>
        <div className="extra-html">
          <label>change speed: </label>
          <select
            onChange={(e) => this.changeHandler(e.currentTarget.value, "speed")}
            defaultValue={this.speed}
          >
            {speedOptions}
          </select>
        </div>
      </div>
    );
  };

  draw = () => {
    if (!this.canvas || !this.ctx) return;
    drawSineCurve(
      this.ctx,
      this.canvasWidth,
      this.canvasHeight,
      this.startValue,
      this.differential,
      this.speed
    );
    this.raf(this.draw);
  };

  pointerDownHandler(_e: PointerEvent) {}
  pointerUpHandler(_e: PointerEvent) {}
  pointerMoveHandler(_e: PointerEvent) {}
}
