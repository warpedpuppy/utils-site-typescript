import { CollisionDetectionObject } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";

class AnimationTemplate extends AnimationBaseClass {
  static t = "enter title";
  static l = "enter-title";
  static f = "";
  title = "enter title";
  animationObject: CollisionDetectionObject = {
    keyFunction: () => {},
    dependencies: [],
    functionString: ``,
  };
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
export default AnimationTemplate;
