import { CollisionDetectionObject } from "../types/types";
import AnimationBaseClass from "./AnimationBaseClass";
import { centerOnParent } from "../pages/createJSON/formulas/simpleEquations/CenterOnParent";

export function drawCenterOnParent(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number
): void {
  function centerOnParent(
    item: { width: number; height: number },
    parent: { width: number; height: number }
  ): { x: number; y: number } {
    return { x: (parent.width - item.width) / 2, y: (parent.height - item.height) / 2 };
  }
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, width, height);
  const parent = { x: width * 0.14, y: height * 0.16, width: width * 0.72, height: height * 0.68 };
  const child = { width: 110 + Math.sin(time) * 45, height: 80 + Math.cos(time * 0.8) * 32 };
  const pos = centerOnParent(child, parent);
  ctx.strokeStyle = 'rgba(129, 140, 248, 0.55)';
  ctx.lineWidth = 3;
  ctx.strokeRect(parent.x, parent.y, parent.width, parent.height);
  ctx.fillStyle = '#818cf8';
  ctx.fillRect(parent.x + pos.x, parent.y + pos.y, child.width, child.height);
  ctx.fillStyle = '#d8e2ff';
  ctx.font = '14px monospace';
  ctx.fillText('centerOnParent(child, parent) => { x: ' + pos.x.toFixed(1) + ', y: ' + pos.y.toFixed(1) + ' }', 18, 30);
}

class CenterOnParentAnimation extends AnimationBaseClass {
  static t = "center on parent";
  static l = "center-on-parent";
  static f = centerOnParent;
  title = "center on parent";
  animationObject: CollisionDetectionObject = centerOnParent;
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
export default CenterOnParentAnimation;
