import { CollisionDetectionObject } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";
import { CenterOnParent } from "../../formulas/simpleEquations/CenterOnParent";

class CenterOnParentAnimation extends AnimationBaseClass {
  static t = "center on parent";
  static l = "center-on-parent";
  static f = CenterOnParent;
  title = "center on parent";
  animationObject: CollisionDetectionObject = CenterOnParent;
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
export default CenterOnParentAnimation;
