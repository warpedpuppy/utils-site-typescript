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
  ballRadius: number = 10;
  ballQ: number = 20;
  balls: Circle[] = [];
  spring = 0.05;
  friction = -0.9;
  speedLimit = 5;
  init() {
    if (this.textDiv) this.textDiv.innerHTML = `<h2>${this.title}</h2>`;

    for (let i = 0; i < this.ballQ; i++) {
      let radius = Math.random() * 50 + 10;
      let x = Math.random() * (this.canvasWidth - 2 * radius) + radius;
      let y = Math.random() * (this.canvasHeight - 2 * radius) + radius;
      this.balls[i] = { x, y, radius, id: `${i}`, vx: 1, vy: 1 };
    }

    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.balls.forEach((ball1) => {
      if (!this.ctx) return;
      ball1.x += ball1.vx;
      ball1.y += ball1.vy;
      this.ctx.beginPath();
      this.ctx.arc(ball1.x, ball1.y, ball1.radius, 0, 2 * Math.PI);
      this.ctx.stroke();
      this.balls.forEach((ball2) => {
        if (ball1 !== ball2) {
          let dx = ball2.x - ball1.x;
          let dy = ball2.y - ball1.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          let minDist = ball2.radius + ball1.radius;
          if (distance < minDist) {
            let angle = Math.atan2(dy, dx);
            let targetX = ball1.x + Math.cos(angle) * minDist;
            let targetY = ball1.y + Math.sin(angle) * minDist;
            let ax = (targetX - ball2.x) * this.spring;
            let ay = (targetY - ball2.y) * this.spring;
            ball1.vx -= ax;
            ball1.vy -= ay;
            ball2.vx += ax;
            ball2.vy += ay;
          }
        }
      });

      if (ball1.y > this.canvasHeight - ball1.radius) {
        ball1.y = this.canvasHeight - ball1.radius;
        ball1.vy *= -1;
      }

      if (ball1.y < ball1.radius) {
        ball1.y = ball1.radius;
        ball1.vy *= -1;
      }

      if (ball1.x > this.canvasWidth - ball1.radius) {
        ball1.x = this.canvasWidth - ball1.radius;
        ball1.vx *= -1;
      }
      if (ball1.x < ball1.radius) {
        ball1.x = ball1.radius;
        ball1.vx *= -1;
      }
      if (ball1.vx > this.speedLimit) ball1.vx = this.speedLimit;
      if (ball1.vy > this.speedLimit) ball1.vy = this.speedLimit;
    });
    requestAnimationFrame(this.draw);
  };
  getATan2(originPoint: Point, destinationPoint: Point) {
    return (
      (Math.atan2(
        destinationPoint.y - originPoint.y,
        destinationPoint.x - originPoint.x
      ) *
        180) /
      Math.PI
    );
  }
  circleCircle(circle1: Circle, circle2: Circle) {
    let distX = circle1.x - circle2.x;
    let distY = circle1.y - circle2.y;
    let distance = Math.sqrt(distX * distX + distY * distY);

    return distance <= circle1.radius + circle2.radius;
  }
  collide(b: Circle) {
    const a = this;
    const x = a.x - b.x;
    const y = a.y - b.y;
    const d = x * x + y * y;

    const u1 = (a.vx * x + a.vy * y) / d; // From this to b
    const u2 = (x * a.vy - y * a.vx) / d; // Adjust self along tangent
    const u3 = (b.vx * x + b.vy * y) / d; // From b to this
    const u4 = (x * b.vy - y * b.vx) / d; // Adjust b  along tangent

    // set new velocities
    b.vx = x * u1 - y * u4;
    b.vy = y * u1 + x * u4;
    a.vx = x * u3 - y * u2;
    a.vy = y * u3 + x * u2;
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
