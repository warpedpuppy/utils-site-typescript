// The single reusable ambient vignette host for the /api comic surfaces:
// newsstand chapter covers and issue mastheads both mount this, keyed by
// concept id (zero duplicated scenes). Decorative only — aria-hidden, never a
// CodePen source. Reduced motion renders one expressive still and never loops;
// callers wrap it in LazyMount so off-screen covers are fully unmounted and
// their rAF loops cancelled.
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../../motionPreference";
import { CONCEPT_SCENES } from "./drawConceptScenes";
import "./AmbientConceptCanvas.scss";

// The t (seconds) a reduced-motion still is painted at. Chosen so every scene
// shows its idea mid-action (collision burst firing, ball mid-bounce) rather
// than a dead t=0 frame.
const STILL_TIME = 0.9;

export default function AmbientConceptCanvas({ conceptId }: { conceptId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = CONCEPT_SCENES[conceptId];
    if (!canvas || !scene) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const paint = (t: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scene(ctx, w, h, t);
    };

    if (prefersReducedMotion()) {
      // One still frame; repaint on resize so the composition stays correct.
      const repaint = () => paint(STILL_TIME);
      const raf = requestAnimationFrame(repaint);
      window.addEventListener("resize", repaint);
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", repaint);
      };
    }

    let frame = 0;
    const start = performance.now();
    const loop = (now: number) => {
      paint((now - start) / 1000);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [conceptId]);

  // Unknown concept id → no scene; render nothing rather than a dead canvas.
  if (!CONCEPT_SCENES[conceptId]) return null;

  return <canvas ref={canvasRef} className="ambient-concept-canvas" aria-hidden="true" />;
}
