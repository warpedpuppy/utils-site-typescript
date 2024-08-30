import { CollisionDetectionObject } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";
import { NumberWithCommas } from "../../formulas/simpleEquations/NumberWIthCommas";
class NumberWithCommasAnimation extends AnimationBaseClass {
  static t = "format number with commas";
  static l = "format-number-with-commas";
  static f = NumberWithCommas.functionString;
  title = "format number with commas";
  animationObject: CollisionDetectionObject = NumberWithCommas;
  init() {
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    // requestAnimationFrame(this.draw);
  };
  keyFunction() {}
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default NumberWithCommasAnimation;
