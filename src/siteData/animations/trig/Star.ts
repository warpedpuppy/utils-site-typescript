import { Polygon } from "../../../types/shapes";
import { GenericObject } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";
import { Star, StarObject } from "../utils/animation/Star";

class AnimationTemplate extends AnimationBaseClass {
  static t = "draw star";
  static l = "draw-star";
  title = "draw-star";
  stars: Star[] = [];
  star: Polygon = StarObject.keyFunction(5, 100, 200, 0, {
    rotate: true,
    rotateSpeed: 2000,
  });
  starQ: number = 30;
  animationObject = StarObject;
  storeWidthHeight: GenericObject = {};
  init() {
    this.storeWidthHeight = {
      height: this.canvasHeight,
      width: this.canvasWidth,
    };
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    if (
      this.storeWidthHeight.height !== this.canvasHeight ||
      this.storeWidthHeight.width !== this.canvasWidth
    ) {
      this.storeWidthHeight = {
        height: this.canvasHeight,
        width: this.canvasWidth,
      };
    }
    this.ctx.beginPath();
    this.star = StarObject.keyFunction(5, 70, 200, 0, {
      rotate: true,
      rotateSpeed: 2000,
    });
    this.star.vertices.forEach((star, i) => {
      if (i === 0) {
        this.ctx?.moveTo(this.halfWidth + star.x, this.halfHeight + star.y);
      } else {
        this.ctx?.lineTo(this.halfWidth + star.x, this.halfHeight + star.y);
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
