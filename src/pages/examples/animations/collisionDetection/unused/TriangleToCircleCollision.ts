import { Triangle, Point, Circle, Rectangle } from "../../../../../types/shapes";
import AnimationBaseClass from "../../../../../core-animations/AnimationBaseClass";

class TriangleToCirclCollision extends AnimationBaseClass {
  static t = "triangle to circle collision";
  static l = "triangle-to-circle-collision";
  title = "triangle to circle collision";
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
  triangleCircleCollision(circle: Circle, triangle: Triangle) {
    const { point1, point2, point3 } = triangle;
    // first edge
    const c1x = circle.x - point1.x;
    const c1y = circle.y - point1.x;
    const e1x = point2.x - point1.x;
    const e1y = point2.y - point1.y;

    let k = c1x * e1x + c1y * e1y;

    if (k > 0) {
      var len = Math.sqrt(e1x * e1x + e1y * e1y);
      k /= len;

      if (k < len) {
        if (Math.sqrt(c1x * c1x + c1y * c1y - k * k) <= circle.radius)
          return true;
      }
    }

    // Second edge
    const c2x = circle.x - point2.x;
    const c2y = circle.y - point2.y;
    const e2x = point3.x - point2.x;
    const e2y = point3.y - point2.y;

    k = c2x * e2x + c2y * e2y;

    if (k > 0) {
      len = Math.sqrt(e2x * e2x + e2y * e2y);
      k /= len;

      if (k < len) {
        if (Math.sqrt(c2x * c2x + c2y * c2y - k * k) <= circle.radius)
          return true;
      }
    }

    // Third edge
    const c3x = circle.x - point3.x;
    const c3y = circle.y - point3.y;
    const e3x = point1.x - point3.x;
    const e3y = point1.y - point3.y;

    k = c3x * e3x + c3y * e3y;

    if (k > 0) {
      len = Math.sqrt(e3x * e3x + e3y * e3y);
      k /= len;

      if (k < len) {
        if (Math.sqrt(c3x * c3x + c3y * c3y - k * k) <= circle.radius)
          return true;
      }
    }

    // We're done, no intersection
    return false;
  }
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
export default TriangleToCirclCollision;
