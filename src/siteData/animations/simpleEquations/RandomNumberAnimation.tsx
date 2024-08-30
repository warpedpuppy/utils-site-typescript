import { CollisionDetectionObject } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";
import { RandomNumberBetween } from "../../formulas/simpleEquations/RandomNumberBetween";
class RandomNumberAnimation extends AnimationBaseClass {
  static t = "random number between";
  static l = "random-number-between";
  static f = RandomNumberBetween;
  title = "random number between";
  animationObject: CollisionDetectionObject = RandomNumberBetween;
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
export default RandomNumberAnimation;
