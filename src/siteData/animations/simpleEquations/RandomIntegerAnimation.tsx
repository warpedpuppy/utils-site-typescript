import { CollisionDetectionObject } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";
import { RandomIntegerBetween } from "../../formulas/simpleEquations/RandomIntegerBetween";
class RandomIntegerAnimation extends AnimationBaseClass {
  static t = "random integer between";
  static l = "random-integer-between";
  static f = RandomIntegerBetween;
  title = "random integer between";
  animationObject: CollisionDetectionObject = RandomIntegerBetween;
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
export default RandomIntegerAnimation;
