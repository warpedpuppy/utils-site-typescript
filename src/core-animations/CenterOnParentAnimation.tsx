import { CollisionDetectionObject } from "../types/types";
import AnimationBaseClass from "./AnimationBaseClass";
import { centerOnParent } from "../pages/createJSON/formulas/simpleEquations/CenterOnParent";

class CenterOnParentAnimation extends AnimationBaseClass {
  static t = "center on parent";
  static l = "center-on-parent";
  static f = centerOnParent;
  title = "center on parent";
  animationObject: CollisionDetectionObject = centerOnParent;
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
export default CenterOnParentAnimation;
