import { useEffect, useRef } from "react";
import { drawScalarMiniDemo } from "./drawScalarMiniDemo";
import { SCALAR_DEMO_STEP } from "./scalarTransforms";
import "./MiniDemo.scss";

export interface MiniDemoProps {
  /**
   * Generator mode (e.g. pingPong): a scalar core function `(t, length) => value`
   * whose single output drives both panes. Provide this OR `sample`, not both.
   */
  fn?: (t: number, length: number) => number;
  /**
   * Transform mode (e.g. lerp, clamp, wrap): time → the input fed to a core
   * function plus that function's output, so the demo can show input → output.
   */
  sample?: (t: number) => { input: number; value: number };
  /** Domain peak: the output dot reads `value / length`. */
  length: number;
  /** Title drawn on the canvas, e.g. `pingPong(t, 100)`. */
  label?: string;
  /** Lower bound of the input pane (transform mode only). */
  inputMin?: number;
  /** Upper bound of the input pane (transform mode only). */
  inputMax?: number;
  /** Frames-worth of `t` advanced per frame, scaled by length. Default 1. */
  speed?: number;
  /** Fixed canvas height in CSS pixels. Width fills the container. */
  height?: number;
}

/**
 * The docs-altitude mini-demo: a self-contained React/canvas host that advances
 * `t`, computes `value = fn(t, length)` from the live core function, and renders
 * it through the shared {@link drawScalarMiniDemo}. No math lives here.
 *
 * Used inside the /api Function Reference; the same drawing also backs the
 * /examples PingPong animation, so the two pages can never visually drift.
 */
export default function MiniDemo({
  fn,
  sample,
  length,
  label,
  inputMin,
  inputMax,
  speed = 1,
  height = 168,
}: MiniDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    // Transform mode sweeps an input on its own normalized clock; generator mode
    // (pingPong) advances `t` in domain units so its period is length-independent.
    const step = (sample ? SCALAR_DEMO_STEP : length / 160) * speed;

    // Keep the backing store in sync with the displayed (CSS) size for crisp
    // lines on HiDPI without distorting the drawing coordinates.
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const cssW = canvas.clientWidth || 480;
      canvas.width = cssW * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: cssW, h: height };
    };

    let size = fit();
    const onResize = () => {
      size = fit();
    };
    window.addEventListener("resize", onResize);

    const loop = () => {
      t += step;
      if (sample) {
        const { input, value } = sample(t);
        drawScalarMiniDemo(ctx, {
          value,
          input,
          inputMin,
          inputMax,
          length,
          width: size.w,
          height: size.h,
          label,
        });
      } else if (fn) {
        drawScalarMiniDemo(ctx, {
          value: fn(t, length),
          length,
          width: size.w,
          height: size.h,
          label,
        });
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [fn, sample, length, label, inputMin, inputMax, speed, height]);

  return (
    <div className="mini-demo">
      <canvas
        ref={canvasRef}
        className="mini-demo__canvas"
        style={{ height }}
        aria-label={label ? `Animated demo of ${label}` : "Animated demo"}
      />
    </div>
  );
}
