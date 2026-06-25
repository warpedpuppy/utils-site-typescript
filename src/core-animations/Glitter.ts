import { cosWave, mountGlitter, type EffectHandle } from "@utilspalooza/effects";
import Template from "./animationTemplate";
import { CollisionDetectionObject } from "../types/types";

const GlitterFormula: CollisionDetectionObject = {
  keyFunction: cosWave,
  dependencies: [],
  functionString: `// Each dot and beam breathes around a resting value.
function cosWave(start, diff, speed, clock) {
  return start + Math.cos(clock * speed) * diff;
}`,
};

class Glitter extends Template {
  static t = "Glitter";
  static l = "glitter";
  static f = GlitterFormula;
  title = "Glitter";

  animationObject = GlitterFormula;
  effect: EffectHandle | null = null;

  init() {
    if (this.textDiv) this.textDiv.innerHTML = ELI5;
    if (!this.canvas) return;
    this.effect = mountGlitter(this.canvas, {
      background: "#170425",
      density: 1,
      interactive: true,
      seed: 23,
      speed: 1,
      color: [255, 238, 92],
    });
  }

  resizeHandler = () => {
    if (!this.canvas || !this.ctx || !this.cont) return;
    this.canvas.style.width = `${this.cont.clientWidth}px`;
    this.canvas.style.height = `${this.cont.clientHeight}px`;
    this.canvasWidth = this.cont.clientWidth;
    this.canvasHeight = this.cont.clientHeight;
    this.halfHeight = this.canvasHeight / 2;
    this.halfWidth = this.canvasWidth / 2;
    const { top, left } = this.canvas.getBoundingClientRect();
    this.top = top;
    this.left = left;
    this.effect?.resize();
  };

  stop() {
    this.effect?.destroy();
    this.effect = null;
    super.stop();
  }
}

const ELI5 = `Glitter — a haze of drifting light over a slow pinwheel of beams.

This demo is now backed by the reusable @utilspalooza/effects package. The math
is still small: a radial-gradient dot is baked once, then many copies drift with
cosine waves. Each dot gets a slightly different speed and amplitude, so the
field shimmers instead of pulsing as one. Pointer movement adds a subtle parallax
offset, which makes the background feel alive without changing the underlying
formula.`;

export default Glitter;
