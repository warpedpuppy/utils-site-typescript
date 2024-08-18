import { GenericObject, Point } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";

class AnimationTemplate extends AnimationBaseClass {
  static t = "enter title";
  static l = "enter-title";
  title = "enter title";
  init() {
    this.draw();
  }
  draw() {}
  keyFunction() {}
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default AnimationTemplate;
