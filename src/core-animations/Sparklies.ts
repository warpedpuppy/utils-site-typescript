import { mountSparklies, sparklyBeamPoint, type EffectHandle } from "@utilspalooza/effects";
import Template from "./animationTemplate";
import { CollisionDetectionObject } from "../types/types";

const SparkliesFormula: CollisionDetectionObject = {
  keyFunction: sparklyBeamPoint,
  dependencies: [],
  functionString: `// Rotate a beam's local (0, distance) offset into canvas space.
function sparklyBeamPoint(originX, originY, distance, rotation) {
  return {
    x: originX - distance * Math.sin(rotation),
    y: originY + distance * Math.cos(rotation),
  };
}`,
};

class Sparklies extends Template {
  static t = "Sparklies";
  static l = "sparklies";
  static f = SparkliesFormula;
  title = "Sparklies";

  animationObject = SparkliesFormula;
  effect: EffectHandle | null = null;

  init() {
    if (this.textDiv) this.textDiv.innerHTML = ELI5;
    if (!this.canvas) return;
    this.effect = mountSparklies(this.canvas, {
      background: "#020309",
      density: 1,
      fireworkCount: 34,
      beamsPerFirework: 18,
      seed: 19,
      trail: 0.28,
    });
    this.gateEffect(this.effect);
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

const ELI5 = `Sparklies — little fireworks made from tiny moving glow dots.

Each beam starts at a center point and travels outward along a rotated local
axis. The reusable function turns "distance along this beam" into canvas x/y.
The polished effect adds soft trails, seeded colors, and a simple lifecycle:
expand, twinkle, fade, restart somewhere else.`;

export default Sparklies;
