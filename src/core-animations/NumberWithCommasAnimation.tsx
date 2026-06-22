import { CollisionDetectionObject } from "../types/types";
import AnimationBaseClass from "./AnimationBaseClass";
import { numberWithCommas } from "../pages/createJSON/formulas/simpleEquations/NumberWIthCommas";
class NumberWithCommasAnimation extends AnimationBaseClass {
  static t = "format number with commas";
  static l = "format-number-with-commas";
  static f = numberWithCommas;
  title = "format number with commas";
  animationObject: CollisionDetectionObject = numberWithCommas;
  init() {
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    // this.raf(this.draw);
  };
  keyFunction() {}
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default NumberWithCommasAnimation;
