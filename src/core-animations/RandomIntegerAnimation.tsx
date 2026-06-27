import { CollisionDetectionObject } from "../types/types";
import AnimationBaseClass from "./AnimationBaseClass";
import { randomIntegerBetween } from "../pages/createJSON/formulas/simpleEquations/RandomIntegerBetween";

export function drawRandomIntegerBetween(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  values: number[]
): void {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, width, height);
  const size = Math.min(58, width / 10);
  const startX = (width - size * 7) / 2;
  values.forEach((v, i) => {
    const x = startX + (i % 7) * size;
    const y = height / 2 - size * 2 + Math.floor(i / 7) * size;
    ctx.fillStyle = '#818cf8';
    ctx.fillRect(x + 5, y + 5, size - 10, size - 10);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(String(v), x + size / 2, y + size / 2 + 7);
  });
}

class RandomIntegerAnimation extends AnimationBaseClass {
  static t = "random integer between";
  static l = "random-integer-between";
  static f = randomIntegerBetween;
  title = "random integer between";
  animationObject: CollisionDetectionObject = randomIntegerBetween;
  init() {
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    // this.raf(this.draw);
  };
  keyFunction() {}
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default RandomIntegerAnimation;
