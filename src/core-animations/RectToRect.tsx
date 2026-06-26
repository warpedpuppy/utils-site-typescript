import AnimationBaseClass from "./AnimationBaseClass";
import { RectangleObject } from "../pages/createJSON/formulas/animation/Rectangle";
import { polygonPolygon } from "../pages/createJSON/formulas/collision-detection/PolygonCollision";
import { sineCurve } from "../pages/createJSON/formulas/animation/SineCurve";
import { Point } from "../types/shapes";
class RectToRect extends AnimationBaseClass {
  static t = "rectangle to rectangle collision";
  static l = "rectangle-to-rectangle-collision";
  static f = polygonPolygon;
  title = "rectangle to rectangle collision";
  animationObject = polygonPolygon;
  rect1 = RectangleObject.keyFunction(50, 50, 0);
  rect2 = RectangleObject.keyFunction(50, 50, 0);
  init() {
    if (!this.ctx) return;
    this.ctx.font = "bold 20px Arial";
    this.draw();
  }
  makePointMove() {
    let x = sineCurve.keyFunction(this.halfWidth, 200, 0.001, performance.now());
    let y = sineCurve.keyFunction(this.halfHeight, 200, 0.001, performance.now());
    return { x, y };
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    let { x, y } = this.makePointMove();
    this.rect1 = RectangleObject.keyFunction(100, 100, 0, {
      rotate: true,
      rotateSpeed: 2000,
      time: performance.now(),
    });
    this.rect2 = RectangleObject.keyFunction(100, 100, 0, {
      rotate: true,
      rotateSpeed: 2000,
      time: performance.now(),
    });

    // Move both rectangles to their on-screen positions BEFORE testing the
    // collision — otherwise both are still origin-centered (on top of each
    // other) at test time, so the hit reads true every frame.
    this.rect1.vertices.forEach((v: Point) => {
      v.x += x;
      v.y += y;
    });
    this.rect2.vertices.forEach((v: Point) => {
      v.x += this.halfWidth;
      v.y += this.halfHeight;
    });

    const hit = polygonPolygon.keyFunction(this.rect1, this.rect2);

    this.ctx.fillStyle = hit ? "hsl(330, 95%, " + (55 + 25 * Math.sin(performance.now() / 120)) + "%)" : "#ff9f1c";
    this.ctx.beginPath();
    this.rect1.vertices.forEach((rect: Point, i: number) => {
      if (i === 0) {
        this.ctx?.moveTo(rect.x, rect.y);
      } else {
        this.ctx?.lineTo(rect.x, rect.y);
      }
    });
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.fillStyle = hit ? "hsl(330, 95%, " + (55 + 25 * Math.sin(performance.now() / 120)) + "%)" : "#818cf8";
    this.ctx.beginPath();
    this.rect2.vertices.forEach((rect: Point, i: number) => {
      if (i === 0) {
        this.ctx?.moveTo(rect.x, rect.y);
      } else {
        this.ctx?.lineTo(rect.x, rect.y);
      }
    });
    this.ctx.closePath();
    this.ctx.fill();

    if (hit) {
      this.ctx.save();
      this.ctx.font = "600 16px ui-monospace, 'Courier New', monospace";
      this.ctx.textAlign = "center";
      this.ctx.shadowColor = "rgba(129, 140, 248, 0.9)";
      this.ctx.shadowBlur = 14;
      this.ctx.fillStyle = "#cdd3ff";
      this.ctx.fillText("collision detected", this.halfWidth, 40);
      this.ctx.restore();
    }

    this.raf(this.draw);
  };
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default RectToRect;
