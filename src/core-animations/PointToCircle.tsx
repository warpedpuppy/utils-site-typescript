import { Circle } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { sineCurve } from "../pages/createJSON/formulas/animation/SineCurve";
import { pointCircle } from "../pages/createJSON/formulas/collision-detection/PointCollision";

export function drawPointToCircle(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  time: number
): void {
  const halfWidth = canvasWidth / 2;
  const halfHeight = canvasHeight / 2;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const circle = { x: halfWidth, y: halfHeight, radius: 100 };
  const x = sineCurve.keyFunction(halfWidth, 200, 0.001, performance.now());
  const y = sineCurve.keyFunction(halfHeight, 200, 0.001, performance.now());

  const hit = pointCircle.keyFunction({ x, y }, circle);
  ctx.fillStyle = hit ? "hsl(330, 95%, " + (55 + 25 * Math.sin(performance.now() / 120)) + "%)" : "#ff9f1c";

  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = hit ? "hsl(330, 95%, " + (55 + 25 * Math.sin(performance.now() / 120)) + "%)" : "#818cf8";
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();

  if (hit) {
    ctx.save();
    ctx.font = "600 16px ui-monospace, 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(129, 140, 248, 0.9)";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#cdd3ff";
    ctx.fillText("collision detected", halfWidth, 40);
    ctx.restore();
  }
}

// Export the function strings for CodePen pens
export const drawPointToCircleFunctionString = `// ─── sineCurve function ─────────────────────────────────────────────────────
function sineCurve(startingValue, differential, speed, time) {
  return startingValue + Math.sin(time * speed) * differential;
}

// ─── pointCircle collision detection ────────────────────────────────────────
function pointCircle(point, circle) {
  let distX = point.x - circle.x;
  let distY = point.y - circle.y;
  let distance = Math.sqrt(distX * distX + distY * distY);
  return distance <= circle.radius;
}

// ─── drawPointToCircle canonical animation ──────────────────────────────────
function drawPointToCircle(ctx, canvasWidth, canvasHeight, time) {
  const halfWidth = canvasWidth / 2;
  const halfHeight = canvasHeight / 2;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const circle = { x: halfWidth, y: halfHeight, radius: 100 };
  const x = sineCurve(halfWidth, 200, 0.001, time);
  const y = sineCurve(halfHeight, 200, 0.001, time);

  const hit = pointCircle({ x, y }, circle);
  ctx.fillStyle = hit ? "hsl(330, 95%, " + (55 + 25 * Math.sin(performance.now() / 120)) + "%)" : "#ff9f1c";

  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = hit ? "hsl(330, 95%, " + (55 + 25 * Math.sin(performance.now() / 120)) + "%)" : "#818cf8";
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();

  if (hit) {
    ctx.save();
    ctx.font = "600 16px ui-monospace, 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(129, 140, 248, 0.9)";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#cdd3ff";
    ctx.fillText("collision detected", halfWidth, 40);
    ctx.restore();
  }
}`;

class PointToCircleCollision extends AnimationBaseClass {
  static t = "point to circle collision";
  static l = "point-to-circle-collision";
  static f = pointCircle;
  title = "point to circle collision";
  animationObject = pointCircle;
  circle1: Circle = {
    x: this.canvasWidth * 0.33,
    y: this.halfHeight,
    radius: 5,
  };
  circle2: Circle = {
    x: this.canvasWidth * 0.5,
    y: this.halfHeight,
    radius: 100,
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

    this.circle2.x = this.halfWidth;
    this.circle2.y = this.halfHeight;
    let { x, y } = this.makePointMove();

    const hit = pointCircle.keyFunction({ x, y }, this.circle2);
    this.ctx.fillStyle = hit ? "hsl(330, 95%, " + (55 + 25 * Math.sin(performance.now() / 120)) + "%)" : "#ff9f1c";

    this.ctx.beginPath();
    this.ctx.arc(
      this.circle2.x,
      this.circle2.y,
      this.circle2.radius,
      0,
      2 * Math.PI
    );
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.fillStyle = hit ? "hsl(330, 95%, " + (55 + 25 * Math.sin(performance.now() / 120)) + "%)" : "#818cf8"; /* indigo dot at rest, pink pulse on collision */
    this.ctx.arc(x, y, this.circle1.radius, 0, 2 * Math.PI);
    this.ctx.fill();

    if (hit) {
      this.ctx.save();
      this.ctx.font = "600 16px ui-monospace, 'Courier New', monospace";
      this.ctx.textAlign = "center";
      this.ctx.shadowColor = "rgba(129, 140, 248, 0.9)";
      this.ctx.shadowBlur = 14;
      this.ctx.fillStyle = "#cdd3ff";
      this.ctx.fillText("collision detected", this.halfWidth, 40);
      this.ctx.restore();
    }

    this.raf(this.draw);
  };
  makePointMove() {
    let x = sineCurve.keyFunction(this.halfWidth, 200, 0.001, performance.now());
    let y = sineCurve.keyFunction(this.halfHeight, 200, 0.001, performance.now());
    return { x, y };
  }
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default PointToCircleCollision;
