import { Point } from "../../../types/shapes";
import AnimationBaseClass from "../AnimationBaseClass";
import { GetPointOnLine } from "../../formulas/usefulLittleThings/GetPointOnLine";
import { ReactNode } from "react";
class GetPointOnLineAnimation extends AnimationBaseClass {
  static t = "get a point on a line";
  static l = "get-a-point-on-a-line";
  title = "get a point on a line";
  animationObject = GetPointOnLine;
  perc: number = 0.5;
  init() {
    this.startPoint = { x: this.halfWidth - 100, y: this.halfHeight + 100 };
    this.endPoint = { x: this.halfWidth + 100, y: this.halfHeight - 100 };
    this.draw();
  }
  extraHTML = () => {
    let options: ReactNode[] = [];
    let vals = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    vals.forEach((val) => {
      options.push(
        <option value={val} key={`extra-html-options-${val}`}>
          {val}
        </option>
      );
    });

    return (
      <div className="extra-html">
        <label>change percentage on line: </label>
        <select
          onChange={(e) => this.perChangeHandler(e.currentTarget.value)}
          defaultValue={this.perc}
        >
          {options}
        </select>
      </div>
    );
  };
  perChangeHandler = (value: string) => {
    this.perc = +value;
  };
  draw = () => {
    if (!this.ctx || !this.canvas || !this.startPoint || !this.endPoint) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.strokeStyle = "rgba(0 0 0 /0.5)";
    this.ctx.lineWidth = 10;
    this.ctx.beginPath();
    this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
    this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
    this.ctx.stroke();

    this.ctx.strokeStyle = "red";
    let point: Point = GetPointOnLine.keyFunction(
      this.startPoint,
      this.endPoint,
      this.perc
    );

    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    this.ctx.stroke();
    if (this.textDiv) this.textDiv.innerHTML = `Click and drag to draw a line`;
    requestAnimationFrame(this.draw);
  };
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
export default GetPointOnLineAnimation;
