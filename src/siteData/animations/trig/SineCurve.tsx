import { Nullable, Point } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";
class SineCurve extends AnimationBaseClass {
  static t: string = "sine curve";
  static l: string = "sine-curve";
  title = "sine curve";
  // canvas: Nullable<HTMLCanvasElement> = document.createElement("canvas");
  // textDiv: Nullable<HTMLElement> = document.getElementById(
  //   "primary-canvas--content--text"
  // );
  // canvasWidth: number = 0;
  // canvasHeight: number = 0;
  // halfHeight: number = 0;
  // halfWidth: number = 0;
  // cont: HTMLDivElement = undefined!;
  // ctx = this.canvas?.getContext("2d");
  // startPoint: Nullable<Point> = null;
  // endPoint: Nullable<Point> = null;
  // top: number = 0;
  // left: number = 0;
  // text: string[] = [];
  interval: any = 0;
  // circleQ = 0;
  // points: any = [];
  // allowDraw: boolean = false;
  i: number = 0;
  startValue = 0;
  differential = 200;
  speed = 0.005;
  keyFunction(startingValue: number, differential: number, speed: number) {
    const currentDate = new Date();
    return (
      startingValue + Math.sin(currentDate.getTime() * speed) * differential
    );
  }
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

    let val = this.keyFunction(this.startValue, this.differential, this.speed);
    this.ctx.beginPath();
    this.ctx.arc(this.halfWidth, this.halfHeight + val, 20, 0, 2 * Math.PI);
    this.ctx.stroke();

    requestAnimationFrame(this.draw);
  };
}
export default SineCurve;
