import { CollisionDetectionObject } from "../types/types";
import AnimationBaseClass from "./AnimationBaseClass";
import { radToDeg } from "../pages/createJSON/formulas/simpleEquations/RadToDeg";

export function drawRadiansToDegrees(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  radians: number
): void {
  function radToDeg(rad: number): number {
    return (rad * 180) / Math.PI;
  }
  const degrees = radToDeg(radians);
  const cx = width / 2, cy = height / 2;
  const radius = Math.min(width, height) * 0.28;
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#a78bfa';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(radians) * radius, cy + Math.sin(radians) * radius);
  ctx.stroke();
  ctx.fillStyle = '#d8e2ff';
  ctx.font = '16px monospace';
  ctx.fillText(radians.toFixed(3) + ' radians = ' + degrees.toFixed(1) + ' degrees', 18, 32);
}

class Rad2DegAnimation extends AnimationBaseClass {
  static t = "radians to degrees";
  static l = "radians-to-degrees";
  static f = radToDeg;
  title = "radians to degrees";
  animationObject: CollisionDetectionObject = radToDeg;
  radians = 0;
  init() {
    this.draw();
  }
  draw = () => {
    if (!this.ctx) return;
    drawRadiansToDegrees(
      this.ctx,
      this.canvasWidth,
      this.canvasHeight,
      this.radians
    );
    this.radians = (this.radians + 0.025) % (Math.PI * 2);
    this.raf(this.draw);
  };
  keyFunction() {}
  pointerDownHandler(e: PointerEvent) {}
  pointerUpHandler(e: PointerEvent) {}
  pointerMoveHandler(e: PointerEvent) {}
}
export default Rad2DegAnimation;
