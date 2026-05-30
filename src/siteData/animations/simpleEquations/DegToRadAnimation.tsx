import { CollisionDetectionObject } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";
import { Deg2Rad } from "../../formulas/simpleEquations/DegToRad";
class Deg2RadAnimation extends AnimationBaseClass {
  static t = "degrees to radians";
  static l = "degrees-to-radians";
  static f = Deg2Rad;
  title = "degrees to radians";
  animationObject: CollisionDetectionObject = Deg2Rad;
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
export default Deg2RadAnimation;
