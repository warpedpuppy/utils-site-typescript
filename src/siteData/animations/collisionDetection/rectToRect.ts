import AnimationBaseClass from "../AnimationBaseClass";
import { Rectangle } from "../utils/animation/Rectangle";
import { PolygonPolygon } from "../utils/collision-detection/PolygonCollision";
import { sineCurve } from "../utils/OmnibusUtils";
class RectToRect extends AnimationBaseClass {
  static t = "rectangle to rectangle collision";
  static l = "rectangle-to-rectangle-collision";
  title = "rectangle to rectangle collision";
  animationObject = PolygonPolygon;
  rect1: Rectangle = new Rectangle(50, 50, 0, this.ctx, false, "rect", {
    stroke: false,
    fill: true,
    spinSpeed: 3,
  });
  rect2: Rectangle = new Rectangle(50, 50, 0, this.ctx, false, "rect", {
    stroke: false,
    fill: true,
    spinSpeed: 1,
  });
  init() {
    if (!this.ctx) return;
    this.ctx.font = "bold 20px Arial";
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
    this.ctx.fillStyle = "transparent";
    if (
      PolygonPolygon.keyFunction(
        this.rect1.returnRectangle(),
        this.rect2.returnRectangle()
      )
    ) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "black";
    }
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();

    let { x, y } = this.makePointMove();
    this.rect1.draw(this.top, this.left, {
      x,
      y,
    });

    this.ctx.beginPath();
    this.rect2.draw(this.top, this.left, {
      x: this.halfWidth,
      y: this.halfHeight,
    });

    requestAnimationFrame(this.draw);
  };
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default RectToRect;
