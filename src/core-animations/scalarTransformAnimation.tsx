import AnimationBaseClass from "./AnimationBaseClass";
import {
  drawScalarMiniDemo,
} from "../components/MiniDemo/drawScalarMiniDemo";
import {
  SCALAR_DEMO_STEP,
  ScalarTransformDemo,
} from "../components/MiniDemo/scalarTransforms";
import { CollisionDetectionObject } from "../types/types";

/**
 * Build the /examples animation class for a scalar TRANSFORM demo (lerp, clamp,
 * wrap, …). Every one of these is identical except for its {@link ScalarTransformDemo}
 * config and its "Copy Code" formula, so they share this one factory instead of
 * six copy-pasted classes. The drawing is the SAME {@link drawScalarMiniDemo} the
 * /api docs host uses, and the input sweep + core call come from the shared demo
 * entry — so the two pages cannot drift. Like pingPong, these are docs-first: NO
 * CodePen pen (see CLAUDE.md, "Docs are friendly, visual, and ELI5").
 */
export function makeScalarTransformAnimation(
  demo: ScalarTransformDemo,
  formula: CollisionDetectionObject
): new (canvasCont?: string) => AnimationBaseClass {
  return class ScalarTransformAnimation extends AnimationBaseClass {
    static t = demo.title;
    static l = demo.slug;
    static f = formula;
    title = demo.title;
    animationObject = formula;

    t = 0;

    init() {
      if (this.textDiv) {
        this.textDiv.innerHTML = `<h3>${demo.eli5}</h3>`;
      }
      this.draw();
    }

    draw = () => {
      if (!this.ctx) return;
      this.t += SCALAR_DEMO_STEP;
      const { input, value } = demo.sample(this.t);
      drawScalarMiniDemo(this.ctx, {
        value,
        input,
        inputMin: demo.inputMin,
        inputMax: demo.inputMax,
        length: demo.length,
        width: this.canvasWidth,
        height: this.canvasHeight,
        label: demo.label,
      });
      this.raf(this.draw);
    };
  };
}
