import AnimationBaseClass from "../AnimationBaseClass";
import { PolygonPolygon } from "../../formulas/collision-detection/PolygonCollision";
import { StarObject } from "../../formulas/animation/Star";
import { SineCurve } from "../../formulas/animation/SineCurve";
import { Polygon, Point } from "../../../types/shapes";
class PolygonToPolygonCollision extends AnimationBaseClass {
  static t = "polygon to polygon collision";
  static l = "polygon-to-polygon-collision";
  static f = PolygonPolygon;
  title = "polygon to polygon collision";
  star1: Polygon = StarObject.keyFunction(5, 50, 25, 0, {
    rotate: true,
    rotateSpeed: 2000,
  });
  star2: Polygon = StarObject.keyFunction(9, 150, 25, 0, {
    rotate: true,
    rotateSpeed: 2000,
  });
  animationObject = PolygonPolygon;
  init() {
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

    this.star1 = StarObject.keyFunction(5, 50, 25, 0, {
      rotate: true,
      rotateSpeed: 500,
    });
    this.star2 = StarObject.keyFunction(9, 150, 25, 0, {
      rotate: true,
      rotateSpeed: 2000,
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

    const hit = PolygonPolygon.keyFunction({ vertices: vertices1 }, { vertices: vertices2 });

    // large center star
    this.ctx.fillStyle = hit ? "#22d3ee" : "#facc15";
    this.ctx.beginPath();
    vertices1.forEach((pt, i) => {
      if (i === 0) this.ctx?.moveTo(pt.x, pt.y);
      else this.ctx?.lineTo(pt.x, pt.y);
    });
    this.ctx.closePath();
    this.ctx.fill();

    // small moving star
    this.ctx.fillStyle = hit ? "#ef4444" : "#fb923c";
    this.ctx.beginPath();
    vertices2.forEach((pt, i) => {
      if (i === 0) this.ctx?.moveTo(pt.x, pt.y);
      else this.ctx?.lineTo(pt.x, pt.y);
    });
    this.ctx.closePath();
    this.ctx.fill();

    if (hit) {
      this.ctx.font = "bold 26px 'Courier New', monospace";
      this.ctx.textAlign = "center";
      this.ctx.fillStyle = "rgba(255, 0, 100, 0.55)";
      this.ctx.fillText("[ COLLISION DETECTED ]", this.halfWidth + 3, 43);
      this.ctx.fillStyle = "rgba(0, 255, 255, 0.55)";
      this.ctx.fillText("[ COLLISION DETECTED ]", this.halfWidth - 3, 37);
      this.ctx.fillStyle = "#e0f7ff";
      this.ctx.fillText("[ COLLISION DETECTED ]", this.halfWidth, 40);
      this.ctx.textAlign = "left";
    }

    this.raf(this.draw);
  };
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default PolygonToPolygonCollision;
