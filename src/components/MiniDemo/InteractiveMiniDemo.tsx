import { useEffect, useRef, useState } from "react";
import { pingPong } from "@utilspalooza/core/PingPong";
import { drawScalarMiniDemo } from "./drawScalarMiniDemo";
import type { InteractiveScalarDemo } from "./interactiveDemos";
import "./MiniDemo.scss";

export interface InteractiveMiniDemoProps {
  demo: InteractiveScalarDemo;
  /** Fixed canvas height in CSS px. Default 168. */
  height?: number;
}

/**
 * Interactive docs-altitude scalar demo: the live function call is printed on
 * top with the current argument values substituted in, the two-pane canvas shows
 * input → output, and a slider per argument lets the reader drive it. The input
 * arg auto-sweeps until grabbed (then it scrubs). No math here — the value comes
 * from the live @utilspalooza/core call described by {@link InteractiveScalarDemo}.
 */
export default function InteractiveMiniDemo({ demo, height = 168 }: InteractiveMiniDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // `args` state drives the controlled sliders and readouts on initial render and
  // after user interaction. During auto-sweep, only argsRef is updated per-frame;
  // the swept arg's DOM nodes are updated imperatively so we don't re-render at 60fps.
  const [args, setArgs] = useState<number[]>(() => demo.args.map((a) => a.value));
  const [auto, setAuto] = useState(true);
  const argsRef = useRef(args);
  const autoRef = useRef(auto);
  argsRef.current = args;
  autoRef.current = auto;

  // Refs for imperative per-frame updates of the swept arg — avoids a setState
  // (and full re-render) on every rAF tick during auto-sweep.
  const sweptSliderRef = useRef<HTMLInputElement | null>(null);
  const sweptReadoutRef = useRef<HTMLSpanElement | null>(null);
  const sweptCallArgRef = useRef<HTMLSpanElement | null>(null);
  const resultRef = useRef<HTMLSpanElement | null>(null);

  // Reset when the demo identity changes (e.g. navigating between functions).
  useEffect(() => {
    const fresh = demo.args.map((a) => a.value);
    argsRef.current = fresh;
    setArgs(fresh);
    setAuto(true);
  }, [demo]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const cssW = canvas.clientWidth || 480;
      canvas.width = cssW * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: cssW, h: height };
    };
    let size = fit();
    const onResize = () => { size = fit(); };
    window.addEventListener("resize", onResize);

    const inputArg = demo.args[demo.inputIndex];
    let raf = 0;
    let t = 0;

    const loop = () => {
      const next = argsRef.current.slice();

      if (autoRef.current) {
        t += 1 / 160;
        const f = pingPong(t, 1);
        const swept = inputArg.min + f * (inputArg.max - inputArg.min);
        const snapped = Math.round(swept / inputArg.step) * inputArg.step;
        next[demo.inputIndex] = snapped;
        argsRef.current = next;
        // Imperative DOM updates — no setState, no re-render.
        const fmtSwept = fmt(snapped);
        if (sweptSliderRef.current) sweptSliderRef.current.value = String(snapped);
        if (sweptReadoutRef.current) sweptReadoutRef.current.textContent = fmtSwept;
        if (sweptCallArgRef.current) sweptCallArgRef.current.textContent = fmtSwept;
      }

      const raw = demo.call(next);
      // Guard against Infinity/NaN so bad arg combos never crash the drawing.
      const value = isFinite(raw) ? raw : 0;
      if (resultRef.current) resultRef.current.textContent = fmt(value);

      const inR = demo.inputRange(next);
      const outR = demo.outputRange(next);
      drawScalarMiniDemo(ctx, {
        value,
        input: next[demo.inputIndex],
        inputMin: inR.min,
        inputMax: inR.max,
        outputMin: outR.min,
        outputMax: outR.max,
        length: outR.max,
        width: size.w,
        height: size.h,
      });
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [demo, height]);

  const onSlide = (i: number, raw: number) => {
    // Read from argsRef (not stale state) so the current swept position is preserved.
    const next = argsRef.current.slice();
    next[i] = raw;
    argsRef.current = next;
    setArgs([...next]);
    if (i === demo.inputIndex && autoRef.current) setAuto(false);
  };

  const safeResult = isFinite(demo.call(args)) ? demo.call(args) : 0;

  return (
    <div className="mini-demo mini-demo--interactive">
      {/* Live call, with the swept input arg highlighted. */}
      <div className="mini-demo__call">
        <code>
          {demo.fnName}(
          {demo.args.map((a, i) => (
            <span key={a.name}>
              <span
                ref={i === demo.inputIndex ? sweptCallArgRef : undefined}
                className={i === demo.inputIndex ? "mini-demo__arg mini-demo__arg--input" : "mini-demo__arg"}
              >
                {fmt(args[i])}
              </span>
              {i < demo.args.length - 1 ? ", " : ""}
            </span>
          ))}
          ) = <span ref={resultRef} className="mini-demo__result">{fmt(safeResult)}</span>
        </code>
      </div>

      <canvas ref={canvasRef} className="mini-demo__canvas" style={{ height }} aria-label={`Interactive ${demo.fnName} demo`} />

      <div className="mini-demo__controls">
        {demo.args.map((a, i) => (
          <label key={a.name} className="mini-demo__control">
            <span className="mini-demo__control-name">
              {a.name}
              {i === demo.inputIndex && <span className="mini-demo__control-tag">{auto ? "auto" : "manual"}</span>}
            </span>
            <input
              ref={i === demo.inputIndex ? sweptSliderRef : undefined}
              type="range"
              min={a.min}
              max={a.max}
              step={a.step}
              value={args[i]}
              onChange={(e) => onSlide(i, Number(e.target.value))}
            />
            <span
              ref={i === demo.inputIndex ? sweptReadoutRef : undefined}
              className="mini-demo__control-val"
            >
              {fmt(args[i])}
            </span>
          </label>
        ))}
        {!auto && (
          <button type="button" className="mini-demo__resume" onClick={() => setAuto(true)}>
            ▶ resume auto-sweep
          </button>
        )}
      </div>
    </div>
  );
}

/** Trim trailing ".0" so the readout reads like hand-written numbers. */
function fmt(n: number): string {
  const r = Math.round(n * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}
