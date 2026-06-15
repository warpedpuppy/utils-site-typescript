import { CollisionDetectionObject } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";
import { Rad2Deg } from "../../formulas/simpleEquations/RadToDeg";
class Rad2DegAnimation extends AnimationBaseClass {
  static t = "radians to degrees";
  static l = "radians-to-degrees";
  static f = Rad2Deg;
  title = "radians to degrees";
  animationObject: CollisionDetectionObject = Rad2Deg;
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
export default Rad2DegAnimation;
