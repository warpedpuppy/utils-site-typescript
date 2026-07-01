import { CollisionDetectionObject } from "../types/types";
import AnimationBaseClass from "./AnimationBaseClass";
import { randomNumberBetween } from "../pages/createJSON/formulas/simpleEquations/RandomNumberBetween";

export function drawRandomNumberBetween(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  samples: number[],
  min: number,
  max: number
): void {
  const lineY = Math.round(height * 0.62);
  const left = 32;
  const right = width - 32;
  const usableWidth = Math.max(1, right - left);
  const latest = samples[0] ?? min;

  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, width, height);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#d8e2ff';
  ctx.font = '14px monospace';
  ctx.fillText(`randomNumberBetween(${min}, ${max})`, 18, 28);

  ctx.font = '12px monospace';
  ctx.fillStyle = 'rgba(216,226,255,0.72)';
  ctx.fillText('returns a decimal anywhere in this range', 18, 48);

  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(left, lineY);
  ctx.lineTo(right, lineY);
  ctx.stroke();

  ctx.fillStyle = '#d8e2ff';
  ctx.font = '13px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(String(min), left, lineY + 26);
  ctx.fillText(String(max), right, lineY + 26);

  samples.slice(1).forEach((sample, i) => {
    const x = left + ((sample - min) / (max - min)) * usableWidth;
    const alpha = Math.max(0.12, 0.55 - i * 0.07);
    const y = lineY - 26 - Math.min(i, 5) * 10;
    ctx.fillStyle = `rgba(129, 140, 248, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  const latestX = left + ((latest - min) / (max - min)) * usableWidth;
  ctx.strokeStyle = '#818cf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(latestX, lineY - 34);
  ctx.lineTo(latestX, lineY + 6);
  ctx.stroke();

  ctx.fillStyle = '#818cf8';
  ctx.beginPath();
  ctx.arc(latestX, lineY, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(latest.toFixed(2), width / 2, lineY - 64);
}

function sampleRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

class RandomNumberAnimation extends AnimationBaseClass {
  static t = "random number between";
  static l = "random-number-between";
  static f = randomNumberBetween;
  title = "random number between";
  animationObject: CollisionDetectionObject = randomNumberBetween;
  min = 10;
  max = 90;
  samples = [50, 40, 62, 31, 78, 55];
  frame = 0;
  init() {
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    this.frame += 1;
    if (this.frame % 20 === 0) {
      this.samples = [
        sampleRandomNumber(this.min, this.max),
        ...this.samples.slice(0, 5),
      ];
    }
    drawRandomNumberBetween(
      this.ctx,
      this.canvasWidth,
      this.canvasHeight,
      this.samples,
      this.min,
      this.max
    );
    this.raf(this.draw);
  };
  keyFunction() {}
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default RandomNumberAnimation;
