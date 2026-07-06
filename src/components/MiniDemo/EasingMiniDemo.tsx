import { useEffect, useRef } from "react";
import { drawEasingMiniDemo } from "./drawEasingMiniDemo";
import { MotionToggle, useMotionGate } from "./useMotionGate";
import "./MiniDemo.scss";

export interface EasingMiniDemoProps {
  /** The live core easing function, e.g. easeOutBounce. */
  ease: (t: number) => number;
  /** Caption, e.g. "easeOutBounce(t)". */
  label?: string;
  /** Fixed canvas height in CSS px. Default 200. */
  height?: number;
}

/**
 * Docs-altitude easing mini-demo: runs a rAF loop that sweeps progress 0→1,
 * plots the static easing curve with a riding dot, and shows a two-marker
 * motion track so the reader sees lag/rush/overshoot vs constant-speed input.
 * No math lives here — the easing function is passed in from @utilspalooza/core.
 */
export default function EasingMiniDemo({ ease, label, height = 200 }: EasingMiniDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { playing, playingRef, setPlaying } = useMotionGate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Precompute the static curve once per ease function.
    const curve: Array<readonly [number, number]> = [];
    for (let i = 0; i <= 120; i++) {
      const t = i / 120;
      curve.push([t, ease(t)] as const);
    }

    let raf = 0;
    let progress = 0;
    let holdFrames = 0;
    let holding = false;
    // Full sweep in ~2.2 s at 60 fps.
    const step = 1 / (60 * 2.2);

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
      // Motion gate: progress only advances while playing; the frame still
      // draws so the canvas stays correct across resizes.
      if (playingRef.current) {
        if (holding) {
          holdFrames--;
          if (holdFrames <= 0) {
            holding = false;
            progress = 0;
          }
        } else {
          progress += step;
          if (progress >= 1) {
            progress = 1;
            holding = true;
            holdFrames = 30;
          }
        }
      }

      drawEasingMiniDemo(ctx, {
        eased: ease(progress),
        progress,
        curve,
        width: size.w,
        height: size.h,
        label,
      });
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [ease, label, height, playingRef]);

  return (
    <div className="mini-demo">
      <canvas
        ref={canvasRef}
        className="mini-demo__canvas"
        style={{ height }}
        aria-label={label ? `Animated easing demo of ${label}` : "Animated easing demo"}
      />
      <MotionToggle playing={playing} setPlaying={setPlaying} />
    </div>
  );
}
