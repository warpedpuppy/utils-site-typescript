import AnimationBaseClass from "./AnimationBaseClass";
import { pingPong as pingPongFunction } from "@utilspalooza/core/PingPong";
import { pingPong as pingPongFormula } from "../pages/createJSON/formulas/animation/PingPong";
import { drawScalarMiniDemo } from "../components/MiniDemo/drawScalarMiniDemo";

/**
 * Examples-page demo for the scalar `pingPong` primitive. It shares its drawing
 * with the /api docs mini-demo via {@link drawScalarMiniDemo}, so the two pages
 * cannot drift. Scalars like this are docs-first: there is intentionally NO
 * CodePen pen (see CLAUDE.md, "Docs are friendly, visual, and ELI5").
 */
class PingPongAnimation extends AnimationBaseClass {
  static t = "ping pong";
  static l = "ping-pong";
  static f = pingPongFormula;
  title = "ping pong";
  animationObject = pingPongFormula;

  length = 100;
  t = 0;

  init() {
    if (this.textDiv) {
      this.textDiv.innerHTML =
        "<h3>pingPong bounces one number back and forth between 0 and a peak — a triangle wave. " +
        "The bar on the left is that number; the dot on the right is something using it. " +
        "Watch them slide out and back, forever, with no jump.</h3>";
    }
    this.draw();
  }

  draw = () => {
    if (!this.ctx) return;
    this.t += this.length / 160;
    const value = pingPongFunction(this.t, this.length);
    drawScalarMiniDemo(this.ctx, {
      value,
      length: this.length,
      width: this.canvasWidth,
      height: this.canvasHeight,
      label: `pingPong(t, ${this.length})`,
    });
    this.raf(this.draw);
  };
}

export default PingPongAnimation;
