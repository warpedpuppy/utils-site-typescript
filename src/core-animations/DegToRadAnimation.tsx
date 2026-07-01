import { CollisionDetectionObject } from "../types/types";
import AnimationBaseClass from "./AnimationBaseClass";
import { degToRad } from "../pages/createJSON/formulas/simpleEquations/DegToRad";

export function drawDegreesToRadians(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  degrees: number
): void {
  function degToRad(degree: number): number {
    return degree * (Math.PI / 180);
  }
  const radians = degToRad(degrees);
  const cx = width / 2, cy = height / 2;
  const r = Math.min(width, height) * 0.28;
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#818cf8';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(radians) * r, cy + Math.sin(radians) * r);
  ctx.stroke();
  ctx.fillStyle = '#d8e2ff';
  ctx.font = '16px monospace';
  ctx.fillText(degrees + ' degrees = ' + radians.toFixed(3) + ' radians', 18, 32);
}

class Deg2RadAnimation extends AnimationBaseClass {
  static t = "degrees to radians";
  static l = "degrees-to-radians";
  static f = degToRad;
  title = "degrees to radians";
  animationObject: CollisionDetectionObject = degToRad;
  angle = 0;
  init() {
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    drawDegreesToRadians(
      this.ctx,
      this.canvasWidth,
      this.canvasHeight,
      this.angle
    );
    this.angle = (this.angle + 1.2) % 360;
    this.raf(this.draw);
  };
  keyFunction() {}
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default Deg2RadAnimation;
