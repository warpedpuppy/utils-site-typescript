import { GenericObject, Point, Circle, Rectangle } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";

class CirceToRectCollision extends AnimationBaseClass {
  static t = "circle to rectangle collision";
  static l = "circle-to-rectangle-collision";
  title = "circle to rectangle collision";
  rect1: Rectangle = {
    x: this.canvasWidth * 0.66,
    y: this.halfHeight,
    width: 100,
    height: 100,
    vx: 0,
    vy: 0,
    id: "rect1",
  };
  circle1: Circle = {
    x: this.canvasWidth * 0.33,
    y: this.halfHeight + 50,
    radius: 50,
    vx: 0,
    vy: 0,
    id: "circle1",
  };
  startDrag: boolean = false;
  init() {
    if (!this.ctx) return;
    this.ctx.font = "bold 20px Arial";
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.fillStyle = "transparent";
    this.ctx.strokeStyle = "black";
    if (this.keyFunction(this.circle1, this.rect1)) {
      this.ctx.fillStyle = "red";
    } else {
      this.ctx.fillStyle = "black";
    }
    this.ctx.lineWidth = 3;

    this.ctx.beginPath();
    this.ctx.rect(
      this.rect1.x,
      this.rect1.y,
      this.rect1.width,
      this.rect1.height
    );
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(
      this.circle1.x,
      this.circle1.y,
      this.circle1.radius,
      0,
      2 * Math.PI
    );

    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.beginPath();

    requestAnimationFrame(this.draw);
  };
  keyFunction(circle: Circle, rectangle: Rectangle) {
    // temporary variables to set edges for testing
    let testX = circle.x;
    let testY = circle.y;

    // which edge is closest?
    if (circle.x < rectangle.x) testX = rectangle.x; // test left edge
    else if (circle.x > rectangle.x + rectangle.width)
      testX = rectangle.x + rectangle.width; // right edge
    if (circle.y < rectangle.y) testY = rectangle.y; // top edge
    else if (circle.y > rectangle.y + rectangle.height)
      testY = rectangle.y + rectangle.height; // bottom edge

    // get distance from closest edges
    let distX = circle.x - testX;
    let distY = circle.y - testY;
    let distance = Math.sqrt(distX * distX + distY * distY);

    // if the distance is less than the radius, collision!
    if (distance <= circle.radius) {
      return true;
    }
    return false;
  }
  pointCircle(point: Point, circle: Circle) {
    let distX = point.x - circle.x;
    let distY = point.y - circle.y;
    let distance = Math.sqrt(distX * distX + distY * distY);
    return distance <= circle.radius;
  }
  pointerDownHandler(e: PointerEvent) {
    if (
      this.pointCircle(
        { x: e.pageX - this.left, y: e.pageY - this.top },
        this.circle1
      )
    ) {
      this.startDrag = true;
    }
  }
  pointerUpHandler(e: PointerEvent) {
    this.startDrag = false;
  }
  pointerMoveHandler(e: PointerEvent) {
    if (this.startDrag) {
      this.circle1.x = e.pageX - this.left;
      this.circle1.y = e.pageY - this.top;
    }
  }
}
export default CirceToRectCollision;
