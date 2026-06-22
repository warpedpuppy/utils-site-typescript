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
  const x = sineCurve.keyFunction(halfWidth, 200, 0.001);
  const y = sineCurve.keyFunction(halfHeight, 200, 0.001);

  const hit = pointCircle.keyFunction({ x, y }, circle);
  ctx.fillStyle = hit ? "red" : "rgba(255,255,255,0.85)";

  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "#f97316";
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();

  if (hit) {
    ctx.font = "bold 26px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 0, 100, 0.55)";
    ctx.fillText("[ COLLISION DETECTED ]", halfWidth + 3, 43);
    ctx.fillStyle = "rgba(0, 255, 255, 0.55)";
    ctx.fillText("[ COLLISION DETECTED ]", halfWidth - 3, 37);
    ctx.fillStyle = "#e0f7ff";
    ctx.fillText("[ COLLISION DETECTED ]", halfWidth, 40);
    ctx.textAlign = "left";
  }
}

// Export the function strings for CodePen pens
export const drawPointToCircleFunctionString = `// ─── sineCurve function ─────────────────────────────────────────────────────
function sineCurve(startingValue, differential, speed) {
  const currentDate = new Date();
  return (
    startingValue + Math.sin(currentDate.getTime() * speed) * differential
  );
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
  const x = sineCurve(halfWidth, 200, 0.001);
  const y = sineCurve(halfHeight, 200, 0.001);

  const hit = pointCircle({ x, y }, circle);
  ctx.fillStyle = hit ? "red" : "rgba(255,255,255,0.85)";

  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "#f97316";
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();

  if (hit) {
    ctx.font = "bold 26px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 0, 100, 0.55)";
    ctx.fillText("[ COLLISION DETECTED ]", halfWidth + 3, 43);
    ctx.fillStyle = "rgba(0, 255, 255, 0.55)";
    ctx.fillText("[ COLLISION DETECTED ]", halfWidth - 3, 37);
    ctx.fillStyle = "#e0f7ff";
    ctx.fillText("[ COLLISION DETECTED ]", halfWidth, 40);
    ctx.textAlign = "left";
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
    this.ctx.fillStyle = hit ? "red" : "rgba(255,255,255,0.85)";

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
    this.ctx.fillStyle = "#f97316"; /* bright dot so user can see the moving point */
    this.ctx.arc(x, y, this.circle1.radius, 0, 2 * Math.PI);
    this.ctx.fill();

    if (hit) {
      this.ctx.font = "bold 26px 'Courier New', monospace";
      this.ctx.textAlign = "center";
      this.ctx.fillStyle = "rgba(255, 0, 100, 0.55)";
      this.ctx.fillText("[ COLLISION DETECTED ]", this.halfWidth + 3, 43);
      this.ctx.fillStyle = "rgba(0, 255, 255, 0.55)";
      this.ctx.fillText("[ COLLISION DETECTED ]", this.halfWidth - 3, 37);
      this.ctx.fillStyle = "#e0f7ff";
      this.ctx.fillText("[ COLLISION DETECTED ]", this.halfWidth, 40);
      this.ctx.textAlign = "left";
    }

    this.raf(this.draw);
  };
  makePointMove() {
    let x = sineCurve.keyFunction(this.halfWidth, 200, 0.001);
    let y = sineCurve.keyFunction(this.halfHeight, 200, 0.001);
    return { x, y };
  }
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default PointToCircleCollision;
