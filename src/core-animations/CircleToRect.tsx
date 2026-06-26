import { Circle, Point } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { RectangleObject } from "../pages/createJSON/formulas/animation/Rectangle";
import { polygonCircle } from "../pages/createJSON/formulas/collision-detection/PolygonCollision";
import { sineCurve } from "../pages/createJSON/formulas/animation/SineCurve";

class CirceToRectAnimation extends AnimationBaseClass {
  static t = "circle to rectangle collision";
  static l = "circle-to-rectangle-collision";
  static f = polygonCircle;
  title = "circle to rectangle collision";
  animationObject = polygonCircle;
  rect = RectangleObject.keyFunction(100, 100, 0, false);
  circle: Circle = {
    x: this.halfWidth,
    y: this.halfHeight,
    radius: 100,
  };
  startDrag: boolean = false;
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

    this.circle.x = this.halfWidth;
    this.circle.y = this.halfHeight;

    let { x, y } = this.makePointMove();
    this.rect = RectangleObject.keyFunction(100, 100, 0, {
      rotate: true,
      rotateSpeed: 2000,
      time: performance.now(),
    });
    // Translate the rectangle to its on-screen position BEFORE testing the
    // collision — otherwise the hit-test runs on the origin-centered rect while
    // the circle sits at canvas center, so they never register as touching.
    this.rect.vertices.forEach((v: Point) => {
      v.x += x;
      v.y += y;
    });

    const hit = polygonCircle.keyFunction(this.rect, this.circle);

    this.ctx.fillStyle = hit ? "hsl(330, 95%, " + (55 + 25 * Math.sin(performance.now() / 120)) + "%)" : "#818cf8";
    this.ctx.beginPath();
    this.ctx.arc(this.circle.x, this.circle.y, this.circle.radius, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.fillStyle = hit ? "hsl(330, 95%, " + (55 + 25 * Math.sin(performance.now() / 120)) + "%)" : "#ff9f1c";
    this.ctx.beginPath();
    this.rect.vertices.forEach((rect: Point, i: number) => {
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
export default CirceToRectAnimation;
