import { Circle, Point } from "../../../types/shapes";
import AnimationBaseClass from "../AnimationBaseClass";
import { RectangleObject } from "../../formulas/animation/Rectangle";
import { PolygonCircle } from "../../formulas/collision-detection/PolygonCollision";
import { SineCurve } from "../../formulas/animation/SineCurve";

class CirceToRectAnimation extends AnimationBaseClass {
  static t = "circle to rectangle collision";
  static l = "circle-to-rectangle-collision";
  static f = PolygonCircle;
  title = "circle to rectangle collision";
  animationObject = PolygonCircle;
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
    let x = SineCurve.keyFunction(this.halfWidth, 200, 0.001);
    let y = SineCurve.keyFunction(this.halfHeight, 200, 0.001);
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
      rotateSpeed: 1000,
    });

    const hit = PolygonCircle.keyFunction(this.rect, this.circle);

    this.ctx.fillStyle = hit ? "#22d3ee" : "rgba(255,255,255,0.85)";
    this.ctx.beginPath();
    this.ctx.arc(this.circle.x, this.circle.y, this.circle.radius, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.fillStyle = hit ? "#ef4444" : "rgba(255,255,255,0.85)";
    this.ctx.beginPath();
    this.rect.vertices.forEach((rect: Point, i: number) => {
      rect.x += x;
      rect.y += y;
      if (i === 0) {
        this.ctx?.moveTo(rect.x, rect.y);
      } else {
        this.ctx?.lineTo(rect.x, rect.y);
      }
    });
    this.ctx.closePath();
    this.ctx.fill();

    if (hit) {
      this.ctx.font = "bold 26px 'Courier New', monospace";
      this.ctx.textAlign = "center";
      // chromatic glitch layers
      this.ctx.shadowBlur = 0;
      this.ctx.fillStyle = "rgba(255, 0, 100, 0.55)";
      this.ctx.fillText("[ COLLISION DETECTED ]", this.halfWidth + 3, 43);
      this.ctx.fillStyle = "rgba(0, 255, 255, 0.55)";
      this.ctx.fillText("[ COLLISION DETECTED ]", this.halfWidth - 3, 37);
      // neon core
      this.ctx.shadowColor = "#00ffff";
      this.ctx.shadowBlur = 30;
      this.ctx.fillStyle = "#e0f7ff";
      this.ctx.fillText("[ COLLISION DETECTED ]", this.halfWidth, 40);
      this.ctx.shadowBlur = 0;
      this.ctx.textAlign = "left";
    }

    this.raf(this.draw);
  };

  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default CirceToRectAnimation;
