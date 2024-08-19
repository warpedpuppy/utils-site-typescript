import { GenericObject, Point, Circle } from "../../../types/types";
import AnimationBaseClass from "../AnimationBaseClass";

class BallsBouncingAgainstEachOther extends AnimationBaseClass {
  static t = "balls bouncing against each other";
  static l = "balls-bouncing-against-each-other";
  title = "balls bouncing against each other";
  vx: number = 4;
  vy: number = 1;
  x: number = 1;
  y: number = 1;
  gravity: number = 0.4;
  ballRadius: number = 10;
  ballQ: number = 50;
  balls: Circle[] = [];
  init() {
    if (this.textDiv) this.textDiv.innerHTML = `<h2>${this.title}</h2>`;
    for (let i = 0; i < this.ballQ; i++) {
      let radius = Math.random() * 50 + 10;
      let x = Math.random() * (this.canvasWidth - 2 * radius) + radius;
      let y = Math.random() * (this.canvasHeight - 2 * radius) + radius;

      this.balls.push({ x, y, radius, vx: 1, vy: 1 });
    }
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.balls.forEach((ball1: Circle) => {
      if (!this.ctx) return;
      this.ctx.beginPath();
      // let { x, y, radius } = ball1;
      ball1.x += ball1.vx;
      ball1.y += ball1.vy;
      this.ctx.arc(ball1.x, ball1.y, ball1.radius, 0, 2 * Math.PI);
      this.ctx?.stroke();
      this.balls.forEach((ball2) => {
        if (this.circleCircle(ball1, ball2)) {
          ball1.vx *= -1;
          ball1.vy *= -1;
          ball2.vx *= -1;
          ball2.vy *= -1;
        }
      });
      if (
        ball1.y >= this.canvasHeight - ball1.radius ||
        ball1.y < ball1.radius
      ) {
        ball1.vy *= -1;
      }
      if (
        ball1.x >= this.canvasWidth - ball1.radius ||
        ball1.x < ball1.radius
      ) {
        ball1.vx *= -1;
      }
    });
    // this.vy += this.gravity;
    // this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    // this.ctx.beginPath();
    // let { x, y } = this.keyFunction({ x: this.x, y: this.y });
    // this.x = x;
    // this.y = y;
    // this.ctx.arc(this.x, this.y, this.ballRadius, 0, 2 * Math.PI);
    // this.ctx.fill();
    requestAnimationFrame(this.draw);
  };
  circleCircle(circle1: Circle, circle2: Circle) {
    let distX = circle1.x - circle2.x;
    let distY = circle1.y - circle2.y;
    let distance = Math.sqrt(distX * distX + distY * distY);

    if (distance <= circle1.radius + circle2.radius) return true;
    return false;
  }
  keyFunction(currentPosition: Point) {
    currentPosition.x += this.vx;
    currentPosition.y += this.vy;
    if (currentPosition.y >= this.canvasHeight - this.ballRadius) {
      this.vy *= -1;
    }
    if (currentPosition.x >= this.canvasWidth) {
      this.vy = 1;
      currentPosition.x = 1;
      currentPosition.y = 1;
    }
    return currentPosition;
  }
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default BallsBouncingAgainstEachOther;
