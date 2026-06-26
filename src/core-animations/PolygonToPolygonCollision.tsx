import AnimationBaseClass from "./AnimationBaseClass";
import { polygonPolygon } from "../pages/createJSON/formulas/collision-detection/PolygonCollision";
import { StarObject } from "../pages/createJSON/formulas/animation/Star";
import { sineCurve } from "../pages/createJSON/formulas/animation/SineCurve";
import { Polygon, Point } from "../types/shapes";
class PolygonToPolygonCollision extends AnimationBaseClass {
  static t = "polygon to polygon collision";
  static l = "polygon-to-polygon-collision";
  static f = polygonPolygon;
  title = "polygon to polygon collision";
  star1: Polygon = StarObject.keyFunction(5, 50, 25, 0, {
    rotate: true,
    rotateSpeed: 2000,
  });
  star2: Polygon = StarObject.keyFunction(9, 150, 25, 0, {
    rotate: true,
    rotateSpeed: 2000,
  });
  animationObject = polygonPolygon;
  init() {
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

    this.star1 = StarObject.keyFunction(5, 50, 25, 0, {
      rotate: true,
      rotateSpeed: 2000,
      time: performance.now(),
    });
    this.star2 = StarObject.keyFunction(9, 150, 25, 0, {
      rotate: true,
      rotateSpeed: 2800,
      time: performance.now(),
    });

    this.ctx.fillStyle = "#1e1b4b";
    this.ctx.rect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.fill();

    let vertices1: Point[] = [];
    this.star2.vertices.forEach((star) => {
      vertices1.push({ x: this.halfWidth + star.x, y: this.halfHeight + star.y });
    });

    let { x, y } = this.makePointMove();
    let vertices2: Point[] = [];
    this.star1.vertices.forEach((star) => {
      vertices2.push({ x: x + star.x, y: y + star.y });
    });

    const hit = polygonPolygon.keyFunction({ vertices: vertices1 }, { vertices: vertices2 });

    // large center star
    this.ctx.fillStyle = hit ? "hsl(330, 95%, " + (55 + 25 * Math.sin(performance.now() / 120)) + "%)" : "#818cf8";
    this.ctx.beginPath();
    vertices1.forEach((pt, i) => {
      if (i === 0) this.ctx?.moveTo(pt.x, pt.y);
      else this.ctx?.lineTo(pt.x, pt.y);
    });
    this.ctx.closePath();
    this.ctx.fill();

    // small moving star
    this.ctx.fillStyle = hit ? "hsl(330, 95%, " + (55 + 25 * Math.sin(performance.now() / 120)) + "%)" : "#ff9f1c";
    this.ctx.beginPath();
    vertices2.forEach((pt, i) => {
      if (i === 0) this.ctx?.moveTo(pt.x, pt.y);
      else this.ctx?.lineTo(pt.x, pt.y);
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
export default PolygonToPolygonCollision;
