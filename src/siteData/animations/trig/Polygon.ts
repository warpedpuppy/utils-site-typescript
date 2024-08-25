// import { GenericObject, Point } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";
import Rectangle from "../utils/RectangleWithConstructionDetails";
class AnimationTemplate extends AnimationBaseClass {
  static t = "draw rectangle";
  static l = "draw-rectangle";
  title = "draw rectangle";
  rect: Rectangle;
  constructor() {
    super();
    this.rect = new Rectangle(200, 300, 0, this.ctx, false, "rect");
  }
  init() {
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.rect.draw(this.top, this.left, {
      x: this.halfWidth,
      y: this.halfHeight,
    });
    requestAnimationFrame(this.draw);
  };
  keyFunction() {}
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default AnimationTemplate;
