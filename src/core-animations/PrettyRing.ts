import { cosWave, mountPrettyRing, type EffectHandle } from "@utilspalooza/effects";
import Template from "./animationTemplate";
import { CollisionDetectionObject } from "../types/types";

const PrettyRingFormula: CollisionDetectionObject = {
  keyFunction: cosWave,
  dependencies: [],
  functionString: `// A frame-driven cosine oscillator.
function cosWave(start, diff, speed, clock) {
  return start + Math.cos(clock * speed) * diff;
}`,
};

class PrettyRing extends Template {
  static t = "Pretty Ring";
  static l = "pretty-ring";
  static f = PrettyRingFormula;
  title = "Pretty Ring";

  animationObject = PrettyRingFormula;
  effect: EffectHandle | null = null;

  init() {
    if (this.textDiv) this.textDiv.innerHTML = ELI5;
    if (!this.canvas) return;
    this.effect = mountPrettyRing(this.canvas, {
      background: "#02050b",
      count: 760,
      density: 1,
      interactive: true,
      layers: 3,
      seed: 11,
      speed: 1,
      wobble: 46,
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

const ELI5 = `Pretty Ring — layered glow dots arranged around a circle.

The ring starts with radial placement: angle to x/y through cosine and sine.
Then each point wobbles with a cosine oscillator. The improved npm effect adds
multiple layers, responsive radius sizing, seeded randomness, additive blending,
and a pointer pulse, but the visible behavior still comes from circle placement
plus tiny oscillations.`;

export default PrettyRing;
