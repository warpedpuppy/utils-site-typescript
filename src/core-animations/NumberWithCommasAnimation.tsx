import { CollisionDetectionObject } from "../types/types";
import AnimationBaseClass from "./AnimationBaseClass";
import { numberWithCommas } from "../pages/createJSON/formulas/simpleEquations/NumberWIthCommas";

export function drawFormatNumberWithCommas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  ms: number
): void {
  function numberWithCommas(x: number): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  const raw = Math.floor(1000 + ms * 87);
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, width, height);
  ctx.textAlign = 'center';
  ctx.font = '22px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fillText(String(raw), width / 2, height / 2 - 28);
  ctx.font = 'bold 44px monospace';
  ctx.fillStyle = '#818cf8';
  ctx.fillText(numberWithCommas(raw), width / 2, height / 2 + 36);
}

class NumberWithCommasAnimation extends AnimationBaseClass {
  static t = "format number with commas";
  static l = "format-number-with-commas";
  static f = numberWithCommas;
  title = "format number with commas";
  animationObject: CollisionDetectionObject = numberWithCommas;
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
export default NumberWithCommasAnimation;
