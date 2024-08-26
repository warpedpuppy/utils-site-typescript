import { GenericObject, Point } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";
import Star from "../utils/Star";

class AnimationTemplate extends AnimationBaseClass {
  static t = "draw star";
  static l = "draw-star";
  title = "draw-star";
  stars: Star[] = [];
  starQ: number = 30;
  storeWidthHeight: GenericObject = {};
  constructor() {
    super();
    this.build();
  }
  build() {
    this.stars = [];
    this.starQ = (this.canvasHeight * this.canvasWidth) / 30000;
    for (let i = 0; i < this.starQ; i++) {
      let points = Math.floor(Math.random() * 5) + 5;
      let outerRadius = Math.floor(Math.random() * 100) + 50;
      let innerRadius = Math.floor(Math.random() * 40) + 10;
      this.stars.push(
        new Star(points, outerRadius, innerRadius, 0, this.ctx, true, "star", {
          x: Math.random() * this.canvasWidth,
          y: Math.random() * this.canvasHeight,
        })
      );
    }
  }
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
      this.build();
      this.storeWidthHeight = {
        height: this.canvasHeight,
        width: this.canvasWidth,
      };
    }
    for (let i = 0; i < this.starQ; i++) {
      let star = this.stars[i];
      star.draw(this.top, this.left);
    }
    requestAnimationFrame(this.draw);
  };
  keyFunction() {}
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default AnimationTemplate;
