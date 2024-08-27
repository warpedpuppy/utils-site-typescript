import { GenericObject } from "../../../types/types";
import { Point, Circle } from "../../../types/shapes";
import AnimationBaseClass from "../AnimationBaseClass";

class CircleToCirclePlus extends AnimationBaseClass {
  static t = "circle to circle collision plus extra data";
  static l = "circle-to-circle-collision-plus-extra-data";
  title = "circle to circle collision plus extra data";
  circle1: Circle = {
    x: this.canvasWidth * 0.33,
    y: this.halfHeight,
    radius: 100,
    vx: 0,
    vy: 0,
    id: "circle1",
  };
  circle2: Circle = {
    x: this.canvasWidth * 0.66,
    y: this.halfHeight,
    radius: 100,
    vx: 0,
    vy: 0,
    id: "circle2",
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
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(
      this.circle2.x,
      this.circle2.y,
      this.circle2.radius,
      0,
      2 * Math.PI
    );
    this.ctx.fillText("circle 2", this.circle2.x - 35, this.circle2.y);
    this.ctx.stroke();
    this.ctx.beginPath();

    this.ctx.beginPath();
    this.ctx.arc(
      this.circle1.x,
      this.circle1.y,
      this.circle1.radius,
      0,
      2 * Math.PI
    );
    this.ctx.fillText(
      "click and drag",
      this.circle1.x - 65,
      this.circle1.y - 15
    );
    this.ctx.fillText(
      "over circle 2",
      this.circle1.x - 55,
      this.circle1.y + 15
    );
    this.ctx.stroke();
    this.ctx.beginPath();
    let { hit, overlap, xOverlap, yOverlap, targetX, targetY, testX, testY } =
      this.keyFunction(this.circle1, this.circle2);
    if (hit) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = "green";
      this.ctx.arc(targetX + this.left, targetY + this.top, 10, 0, 2 * Math.PI);
      this.ctx.stroke();

      // this.ctx.beginPath();
      // this.ctx.strokeStyle = "blue";
      // this.ctx.arc(
      //   this.circle2.x + xOverlap,
      //   this.circle1.y + yOverlap,
      //   10,
      //   0,
      //   2 * Math.PI
      // );
      // this.ctx.stroke();

      // this.ctx.beginPath();
      // this.ctx.strokeStyle = "orange";
      // this.ctx.arc(testX, testY, 10, 0, 2 * Math.PI);
      // this.ctx.stroke();

      let dx = this.circle2.x - this.circle1.x;
      let dy = this.circle2.y - this.circle1.y;
      let angle = Math.atan2(dy, dx);

      this.ctx.beginPath();
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 0.55;
      this.ctx.moveTo(this.circle1.x, this.circle1.y);
      let x = this.circle1.x + Math.cos(angle) * 100;
      let y = this.circle1.y + Math.sin(angle) * 100;
      this.ctx.lineTo(x, y);
      this.ctx.stroke();

      this.ctx.moveTo(this.circle1.x, this.circle1.y);
      this.ctx.lineTo(this.circle1.x, this.circle2.y);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.strokeStyle = "black";
      this.ctx.moveTo(this.circle2.x, this.circle2.y);
      x = this.circle2.x - Math.cos(angle) * 100;
      y = this.circle2.y - Math.sin(angle) * 100;
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }
    requestAnimationFrame(this.draw);
  };
  keyFunction(circle1: Circle, circle2: Circle) {
    let distX = circle2.x - circle1.x;
    let distY = circle2.y - circle1.y;
    let distance = Math.sqrt(distX * distX + distY * distY);
    let minDist = circle2.radius + circle1.radius;
    let overlap = distance - minDist;
    let angle = Math.atan2(distY, distX);
    let targetX = circle1.x + Math.cos(angle) * minDist;
    let testX = circle1.x + Math.cos(angle);
    let testY = circle1.y + Math.sin(angle);
    let targetY = circle1.y + Math.sin(angle) * minDist;
    let xOverlap = targetX - circle2.x;
    let yOverlap = targetY - circle2.y;

    return {
      hit: distance <= minDist,
      overlap,
      xOverlap,
      yOverlap,
      targetX,
      targetY,
      testX,
      testY,
    };
  }
  pointCircle(mousePoint: Point, circle: Circle) {
    let distX = mousePoint.x - circle.x;
    let distY = mousePoint.y - circle.y;
    let distance = Math.sqrt(distX * distX + distY * distY);
    if (distance <= circle.radius) {
      return true;
    }
    return false;
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
export default CircleToCirclePlus;
