import AnimationBaseClass from "./AnimationBaseClass";
import { circleToCircle } from "@utilspalooza/core/CircleToCircle";
import { circleCircle } from "../pages/createJSON/formulas/collision-detection/CircleCollision";

interface FieldBall {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  hue: number;
  hit: number;
}

export function drawCircleField(
  ctx: CanvasRenderingContext2D,
  balls: FieldBall[],
  width: number,
  height: number,
  detect: (x1: number, y1: number, r1: number, x2: number, y2: number, r2: number) => boolean
): void {
  ctx.fillStyle = "#0a0a12";
  ctx.fillRect(0, 0, width, height);

  for (const b of balls) {
    b.x += b.vx;
    b.y += b.vy;
    if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx); }
    if (b.x + b.r > width) { b.x = width - b.r; b.vx = -Math.abs(b.vx); }
    if (b.y - b.r < 0) { b.y = b.r; b.vy = Math.abs(b.vy); }
    if (b.y + b.r > height) { b.y = height - b.r; b.vy = -Math.abs(b.vy); }
    if (b.hit > 0) b.hit--;
  }

  // O(n²) circleToCircle check — every pair, every frame
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const a = balls[i], b = balls[j];
      if (!detect(a.x, a.y, a.r, b.x, b.y, b.r)) continue;

      const dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
      const nx = dx / dist, ny = dy / dist;

      // Push apart
      const overlap = (a.r + b.r) - dist;
      a.x -= nx * overlap * 0.5;
      a.y -= ny * overlap * 0.5;
      b.x += nx * overlap * 0.5;
      b.y += ny * overlap * 0.5;

      // Exchange velocity along collision normal (equal mass elastic)
      const dot = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
      if (dot > 0) {
        a.vx -= dot * nx;
        a.vy -= dot * ny;
        b.vx += dot * nx;
        b.vy += dot * ny;
      }

      a.hit = 8;
      b.hit = 8;
    }
  }

  for (const b of balls) {
    const lit = b.hit > 0 ? 80 : 48;
    const grd = ctx.createRadialGradient(
      b.x - b.r * 0.32, b.y - b.r * 0.32, 0,
      b.x, b.y, b.r
    );
    grd.addColorStop(0, `hsl(${b.hue},80%,${lit + 18}%)`);
    grd.addColorStop(1, `hsl(${b.hue},80%,${lit - 18}%)`);
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
  }
}

class CircleFieldAnimation extends AnimationBaseClass {
  static t = "circle field (collision at scale)";
  static l = "circle-field";
  static f = circleCircle;
  title = "circle field (collision at scale)";
  animationObject = circleCircle;

  balls: FieldBall[] = [];

  init() {
    if (this.textDiv) {
      this.textDiv.innerHTML =
        "<h3>Every pair is checked each frame via <em>circleToCircle</em> — the classic O(n²) approach. When two circles touch (distance ≤ r₁ + r₂), they flash and exchange velocity. This is what your game loop actually runs.</h3>";
    }
    this.spawnBalls();
    this.draw();
  }

  spawnBalls() {
    const count = Math.max(14, Math.floor((this.canvasWidth * this.canvasHeight) / 10000));
    this.balls = Array.from({ length: count }, (_, i) => ({
      x: 30 + Math.random() * (this.canvasWidth - 60),
      y: 30 + Math.random() * (this.canvasHeight - 60),
      r: 14 + Math.random() * 22,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      hue: (i / count) * 360,
      hit: 0,
    }));
  }

  draw = () => {
    if (!this.ctx) return;
    drawCircleField(this.ctx, this.balls, this.canvasWidth, this.canvasHeight, circleToCircle);
    this.raf(this.draw);
  };

  resizeHandler = () => {
    if (!this.canvas || !this.cont) return;
    this.canvas.width = this.canvasWidth = this.cont.clientWidth;
    this.canvas.height = this.canvasHeight = this.cont.clientHeight;
    this.halfWidth = this.canvasWidth / 2;
    this.halfHeight = this.canvasHeight / 2;
    this.spawnBalls();
  };

  pointerDownHandler(_e: PointerEvent) {}
  pointerUpHandler(_e: PointerEvent) {}
  pointerMoveHandler(_e: PointerEvent) {}
}

export default CircleFieldAnimation;
