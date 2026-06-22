import { Polygon } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { createRect as Rectangle } from "@utilspalooza/core/Rectangle";
import { RectangleObject as rectangleFormula } from "../pages/createJSON/formulas/animation/Rectangle";

function drawPolygon(ctx: any, rect: any, halfWidth: any, halfHeight: any): void {
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  rect.vertices.forEach((corner: any, i: number) => {
    let { x, y } = corner;
    x += halfWidth;
    y += halfHeight;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.closePath();
  ctx.stroke();
}

export { drawPolygon };

export default class PolygonAnimation extends AnimationBaseClass {
  static t = "draw rectangle (using trig, not rect())";
  static l = "draw-rectangle";
  static f = rectangleFormula;
  title = "draw rectangle";
  animationObject = rectangleFormula;
  rect: Polygon = { vertices: [], draw: () => {}, drag: false };

  constructor() {
    super();
    this.rect = { vertices: [], draw: () => {}, drag: false };
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

    this.rect = Rectangle(200, 300, 0, {
      rotate: true,
      rotateSpeed: 1000,
      clockwise: true,
    }) as any;

    drawPolygon(this.ctx, this.rect, this.halfWidth, this.halfHeight);
    this.raf(this.draw);
  };

  keyFunction() {}
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
