import { CollisionDetectionObject } from "../types/types";
import AnimationBaseClass from "./AnimationBaseClass";
import { randomNumberBetween } from "../pages/createJSON/formulas/simpleEquations/RandomNumberBetween";

export function drawRandomNumberBetween(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  samples: number[]
): void {
  ctx.fillStyle = 'rgba(10,10,15,0.22)';
  ctx.fillRect(0, 0, width, height);
  samples.forEach((x, i) => {
    const y = height - 24 - i * 3;
    ctx.fillStyle = 'hsla(' + (210 + i) + ', 85%, 65%, 0.75)';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = '#d8e2ff';
  ctx.font = '14px monospace';
  ctx.fillText('randomNumberBetween(20, width - 20)', 18, 30);
}

class RandomNumberAnimation extends AnimationBaseClass {
  static t = "random number between";
  static l = "random-number-between";
  static f = randomNumberBetween;
  title = "random number between";
  animationObject: CollisionDetectionObject = randomNumberBetween;
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
export default RandomNumberAnimation;
