import { CollisionDetectionObject } from "../types/types";
import AnimationBaseClass from "./AnimationBaseClass";
import { degToRad } from "../pages/createJSON/formulas/simpleEquations/DegToRad";
class Deg2RadAnimation extends AnimationBaseClass {
  static t = "degrees to radians";
  static l = "degrees-to-radians";
  static f = degToRad;
  title = "degrees to radians";
  animationObject: CollisionDetectionObject = degToRad;
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
