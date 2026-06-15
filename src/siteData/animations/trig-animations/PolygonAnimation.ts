import { Polygon } from "../../../types/shapes";
import AnimationBaseClass from "../AnimationBaseClass";
import { RectangleObject } from "../../formulas/animation/Rectangle";
class PolygonAnimation extends AnimationBaseClass {
  static t = "draw rectangle (using trig, not rect())";
  static l = "draw-rectangle";
  static f = RectangleObject;
  title = "draw rectangle";
  animationObject = RectangleObject;
  rect: Polygon = RectangleObject.keyFunction(200, 300, 0);
  constructor() {
    super();
    this.rect = RectangleObject.keyFunction(200, 300, 0);
  }
  init() {
    this.draw();
    if (this.textDiv)
      this.textDiv.innerHTML = `
        <p>By avoiding the rect() function, you can more easily perform collision detection.</p>`;
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.rect = RectangleObject.keyFunction(200, 300, 0, {
      rotate: true,
      rotateSpeed: 1000,
      clockwise: true,
    });
    this.ctx.strokeStyle = "rgba(255,255,255,0.85)";
    this.ctx.lineWidth = 2;
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
    this.raf(this.draw);
  };
  keyFunction() {}
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default PolygonAnimation;
