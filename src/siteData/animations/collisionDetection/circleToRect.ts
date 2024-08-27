import { Circle } from "../../../types/shapes";
import AnimationBaseClass from "../AnimationBaseClass";
import Rectangle from "../utils/Rectangle";
import { PolygonCircle } from "../utils/collision-detection/PolygonCollision";
import { sineCurve } from "../utils/OmnibusUtils";

class CirceToRectCollision extends AnimationBaseClass {
  static t = "circle to rectangle collision";
  static l = "circle-to-rectangle-collision";
  title = "circle to rectangle collision";
  rect: Rectangle = new Rectangle(100, 100, 0, this.ctx, false, "rect", {
    stroke: false,
    fill: true,
    spinSpeed: 3,
  });
  circle: Circle = {
    x: this.halfWidth,
    y: this.halfHeight,
    radius: 100,
    vx: 0,
    vy: 0,
    id: "circle",
  };
  startDrag: boolean = false;
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

    this.circle.x = this.halfWidth;
    this.circle.y = this.halfHeight;

    if (PolygonCircle(this.rect.returnRectangle(), this.circle)) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "black";
    }

    this.ctx.beginPath();
    this.ctx.arc(
      this.circle.x,
      this.circle.y,
      this.circle.radius,
      0,
      2 * Math.PI
    );
    this.ctx.fill();

    let { x, y } = this.makePointMove();
    this.rect.draw(this.top, this.left, {
      x,
      y,
    });

    requestAnimationFrame(this.draw);
  };

  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default CirceToRectCollision;
