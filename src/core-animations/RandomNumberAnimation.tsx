import { CollisionDetectionObject } from "../types/types";
import AnimationBaseClass from "./AnimationBaseClass";
import { randomNumberBetween } from "../pages/createJSON/formulas/simpleEquations/RandomNumberBetween";
class RandomNumberAnimation extends AnimationBaseClass {
  static t = "random number between";
  static l = "random-number-between";
  static f = randomNumberBetween;
  title = "random number between";
  animationObject: CollisionDetectionObject = randomNumberBetween;
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
export default RandomNumberAnimation;
