import AnimationBaseClass from "../AnimationBaseClass";
import { PolygonPolygon } from "../utils/collision-detection/PolygonCollision";
import { Star, StarObject } from "../utils/animation/Star";
import { sineCurve } from "../utils/OmnibusUtils";
import { Polygon, Point } from "../../../types/shapes";
class PolygonToPolygonCollision extends AnimationBaseClass {
  static t = "polygon to polygon collision";
  static l = "polygon-to-polygon-ollision";
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
    let x = sineCurve(this.halfWidth, 200, 0.001);
    let y = sineCurve(this.halfHeight, 200, 0.001);
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

    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 3;

    let vertices1: Point[] = [];
    this.ctx.beginPath();
    this.star2.vertices.forEach((star, i) => {
      if (i === 0) {
        this.ctx?.moveTo(this.halfWidth + star.x, this.halfHeight + star.y);
      } else {
        this.ctx?.lineTo(this.halfWidth + star.x, this.halfHeight + star.y);
      }
      vertices1.push({
        x: this.halfWidth + star.x,
        y: this.halfHeight + star.y,
      });
    });
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.fill();

    let { x, y } = this.makePointMove();
    let vertices2: Point[] = [];
    this.ctx.beginPath();
    this.star1.vertices.forEach((star, i) => {
      if (i === 0) {
        this.ctx?.moveTo(x + star.x, y + star.y);
      } else {
        this.ctx?.lineTo(x + star.x, y + star.y);
      }
      vertices2.push({
        x: x + star.x,
        y: y + star.y,
      });
    });
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.fill();

    if (
      PolygonPolygon.keyFunction(
        { vertices: vertices1 },
        { vertices: vertices2 }
      )
    ) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "yellow";
    }

    requestAnimationFrame(this.draw);
  };
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default PolygonToPolygonCollision;
