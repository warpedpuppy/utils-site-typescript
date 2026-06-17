import { Polygon } from "../types/shapes";
import { GenericObject } from "../types/types";
import AnimationBaseClass from "./AnimationBaseClass";
import { DrawStar } from "../core-functions/Star";
import { StarObject as starFormula } from "../pages/createJSON/formulas/animation/Star";

function drawStar(ctx: any, star: any, halfWidth: any, halfHeight: any): void {
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  star.vertices.forEach((vertex: any, i: number) => {
    if (i === 0) {
      ctx.moveTo(halfWidth + vertex.x, halfHeight + vertex.y);
    } else {
      ctx.lineTo(halfWidth + vertex.x, halfHeight + vertex.y);
    }
  });
  ctx.closePath();
  ctx.stroke();
}

export { drawStar };

export default class StarAnimation extends AnimationBaseClass {
  static t = "draw star";
  static l = "draw-star";
  static f = starFormula;
  title = "draw star";
  star: Polygon = { vertices: [], draw: () => {}, drag: false };
  animationObject = starFormula;
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

    this.star = DrawStar(5, 70, 200, 0, {
      rotate: true,
      rotateSpeed: 2000,
      clockwise: true,
    }) as any;

    drawStar(this.ctx, this.star, this.halfWidth, this.halfHeight);
    this.raf(this.draw);
  };

  keyFunction() {}
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
