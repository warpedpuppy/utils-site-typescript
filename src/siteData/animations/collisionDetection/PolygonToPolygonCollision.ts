import AnimationBaseClass from "../AnimationBaseClass";
import { PolygonPolygon } from "../utils/collision-detection/PolygonCollision";
import Star from "../utils/Star";
import { sineCurve } from "../utils/OmnibusUtils";
class PolygonToPolygonCollision extends AnimationBaseClass {
  static t = "polygon to polygon collision";
  static l = "polygon-to-polygon-ollision";
  title = "polygon to polygon collision";
  star1: Star = new Star(5, 50, 25, 0, this.ctx, true, "star1");
  star2: Star = new Star(9, 150, 25, 0, this.ctx, true, "star2");
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

    if (
      PolygonPolygon.keyFunction(this.star1.getStar(), this.star2.getStar())
    ) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "yellow";
    }

    this.star2.draw(this.top, this.left, {
      x: this.halfWidth,
      y: this.halfHeight,
    });
    this.ctx.fill();

    let star1CenterPoint = this.makePointMove();
    this.star1.draw(this.top, this.left, star1CenterPoint);
    this.ctx.fill();

    requestAnimationFrame(this.draw);
  };
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default PolygonToPolygonCollision;
