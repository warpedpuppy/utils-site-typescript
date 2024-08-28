import { Circle } from "../../../types/shapes";
import AnimationBaseClass from "../AnimationBaseClass";
import { SineCurve } from "../utils/animation/SineCurve";
import { PolygonPoint } from "../utils/collision-detection/PolygonCollision";
import { Rectangle } from "../utils/animation/Rectangle";
class PointToRectangle extends AnimationBaseClass {
  static t = "point to polygon collision";
  static l = "point-to-rectangle-collision";
  title = "point to rectangle (or any polygon) collision";
  animationObject = PolygonPoint;
  rect: Rectangle = new Rectangle(200, 300, 0, this.ctx, false, "rect", {
    stroke: false,
    fill: true,
  });
  circle1: Circle = {
    x: this.canvasWidth * 0.33,
    y: this.halfHeight,
    radius: 5,
  };
  startDrag: boolean = false;
  init() {
    if (!this.ctx) return;
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
    this.ctx.fillStyle = "transparent";

    let { x, y } = this.makePointMove();
    this.circle1.x = x;
    this.circle1.y = y;

    if (
      PolygonPoint.keyFunction(this.rect.returnRectangle(), {
        x: this.circle1.x,
        y: this.circle1.y,
      })
    ) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "black";
    }

    this.rect.draw(this.top, this.left, {
      x: this.halfWidth,
      y: this.halfHeight,
    });

    this.ctx.fillStyle = "black";
    this.ctx.beginPath();
    this.ctx.arc(
      this.circle1.x,
      this.circle1.y,
      this.circle1.radius,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
    requestAnimationFrame(this.draw);
  };
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default PointToRectangle;
