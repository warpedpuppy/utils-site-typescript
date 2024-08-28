import { Polygon } from "../../../types/shapes";
import AnimationBaseClass from "../AnimationBaseClass";
import { RectangleObject } from "../utils/animation/Rectangle";
class AnimationTemplate extends AnimationBaseClass {
  static t = "draw rectangle (using trig, not rect())";
  static l = "draw-rectangle";
  title = "draw rectangle";
  animationObject = RectangleObject;
  rect: Polygon = RectangleObject.keyFunction(200, 300, 0);
  constructor() {
    super();
    this.rect = RectangleObject.keyFunction(200, 300, 0);
  }
  init() {
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.rect = RectangleObject.keyFunction(200, 300, 0, {
      rotate: true,
      rotateSpeed: 1000,
      clockwise: true,
    });
    this.ctx.beginPath();
    this.rect.vertices.forEach((corner, i) => {
      let { x, y } = corner;
      x += this.halfWidth;
      y += this.halfHeight;
      if (i === 0) {
        this.ctx?.moveTo(x, y);
      } else {
        this.ctx?.lineTo(x, y);
      }
    });
    this.ctx.closePath();
    this.ctx.stroke();
    requestAnimationFrame(this.draw);
  };
  keyFunction() {}
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default AnimationTemplate;
