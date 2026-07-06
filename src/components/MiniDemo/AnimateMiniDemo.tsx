import { useEffect, useRef, useState } from "react";
import { ticker } from "@utilspalooza/core/Animate";
import type { AnimateDemoDef } from "./animateDemos";
import {
  AnimateControls,
  cycleSpan,
  DEFAULT_CONTROLS,
  fmt,
  TickerSnapshot,
} from "./animateMiniDemoModel";
import { paint } from "./drawAnimateMiniDemo";
import { summarize } from "./animateMiniDemoSummary";
import { prefersReducedMotion } from "../../motionPreference";
import { MotionToggle, useMotionGate } from "./useMotionGate";
import "./MiniDemo.scss";

interface AnimateMiniDemoProps {
  demo: AnimateDemoDef;
  height?: number;
}

export default function AnimateMiniDemo({
  demo,
  height = 210,
}: AnimateMiniDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [controls, setControls] = useState<AnimateControls>(DEFAULT_CONTROLS);
  // Reduced motion: no auto-sweep until the reader asks — the elapsedMs
  // slider scrubs the timeline by hand.
  const [auto, setAuto] = useState(() => !prefersReducedMotion());
  // The ticker demo has no sweep to gate, so it gets a real play/pause.
  const { playing: tickerOn, setPlaying: setTickerOn } = useMotionGate();
  const controlsRef = useRef(controls);
  const autoRef = useRef(auto);
  const [tickerFrame, setTickerFrame] = useState<TickerSnapshot>({
    frame: 0,
    elapsed: 0,
    delta: 16.7,
  });
  controlsRef.current = controls;
  autoRef.current = auto;

  useEffect(() => {
    controlsRef.current = DEFAULT_CONTROLS;
    setControls(DEFAULT_CONTROLS);
    setAuto(!prefersReducedMotion());
    setTickerFrame({ frame: 0, elapsed: 0, delta: 16.7 });
  }, [demo]);

  useEffect(() => {
    if (demo.kind !== "ticker" || !tickerOn) return;
    let active = true;
    const handle = ticker((frame) => {
      if (!active) return;
      setTickerFrame({
        frame: frame.frame,
        elapsed: frame.elapsed,
        delta: frame.delta,
      });
    });
    return () => {
      active = false;
      handle.cancel();
    };
  }, [demo.kind, tickerOn]);

  useEffect(() => {
    if (demo.kind === "ticker") return;
    let raf = 0;
    let previous = performance.now();

    const step = (now: number) => {
      const dt = now - previous;
      previous = now;
      if (autoRef.current) {
        const current = controlsRef.current;
        const span = cycleSpan(demo.kind, current);
        const nextElapsed = span <= 0 ? 0 : (current.elapsed + dt * 0.8) % span;
        const next = { ...current, elapsed: nextElapsed };
        controlsRef.current = next;
        setControls(next);
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [demo.kind]);

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
      return cssW;
    };

    let width = fit();
    const onResize = () => {
      width = fit();
      paint(ctx, demo, width, height, controlsRef.current, tickerFrame);
    };
    window.addEventListener("resize", onResize);

    paint(ctx, demo, width, height, controls, tickerFrame);

    return () => window.removeEventListener("resize", onResize);
  }, [controls, demo, height, tickerFrame]);

  const summary = summarize(demo, controls, tickerFrame);

  return (
    <div className="mini-demo mini-demo--animate">
      <div className="mini-demo__call">
        <code>{summary.call}</code>
      </div>
      <div className="mini-demo__geometry-readout">
        {summary.readouts.map((row) => (
          <div
            key={row.label}
            className={row.live ? "mini-demo__touching is-live" : undefined}
          >
            <span className="mini-demo__readout-label">{row.label}</span>
            <code>{row.value}</code>
          </div>
        ))}
      </div>
      <p className="mini-demo__hint">{demo.hint}</p>
      <canvas
        ref={canvasRef}
        className="mini-demo__canvas"
        style={{ height }}
        aria-label={`Interactive ${demo.fnName} animation demo`}
      />
      {demo.kind === "ticker" && (
        <MotionToggle playing={tickerOn} setPlaying={setTickerOn} />
      )}
      {demo.kind !== "ticker" && (
        <div className="mini-demo__controls">
          <RangeControl
            name="elapsedMs"
            min={0}
            max={cycleSpan(demo.kind, controls)}
            step={1}
            value={controls.elapsed}
            tag={auto ? "auto" : "manual"}
            onChange={(value) => updateControl("elapsed", value, true)}
          />
          {(demo.kind === "loop" ||
            demo.kind === "yoyo" ||
            demo.kind === "delay" ||
            demo.kind === "stagger" ||
            demo.kind === "tween-value" ||
            demo.kind === "tween-object") && (
            <RangeControl
              name="durationMs"
              min={200}
              max={1800}
              step={10}
              value={controls.duration}
              onChange={(value) => updateControl("duration", value)}
            />
          )}
          {demo.kind === "delay" && (
            <RangeControl
              name="delayMs"
              min={0}
              max={900}
              step={10}
              value={controls.delayMs}
              onChange={(value) => updateControl("delayMs", value)}
            />
          )}
          {demo.kind === "stagger" && (
            <>
              <RangeControl
                name="index"
                min={0}
                max={4}
                step={1}
                value={controls.index}
                onChange={(value) => updateControl("index", value)}
              />
              <RangeControl
                name="staggerMs"
                min={60}
                max={320}
                step={10}
                value={controls.staggerMs}
                onChange={(value) => updateControl("staggerMs", value)}
              />
            </>
          )}
          {demo.kind === "tween-value" && (
            <>
              <RangeControl
                name="from"
                min={-100}
                max={100}
                step={5}
                value={controls.from}
                onChange={(value) => updateControl("from", value)}
              />
              <RangeControl
                name="to"
                min={-100}
                max={140}
                step={5}
                value={controls.to}
                onChange={(value) => updateControl("to", value)}
              />
            </>
          )}
          {!auto && (
            <button type="button" className="mini-demo__resume" onClick={() => setAuto(true)}>
              ▶ resume auto-sweep
            </button>
          )}
        </div>
      )}
    </div>
  );

  function updateControl(key: keyof AnimateControls, value: number, stopAuto = false) {
    const next = { ...controlsRef.current, [key]: value };
    controlsRef.current = next;
    setControls(next);
    if (stopAuto && autoRef.current) setAuto(false);
  }
}

function RangeControl({
  name,
  min,
  max,
  step,
  value,
  tag,
  onChange,
}: {
  name: string;
  min: number;
  max: number;
  step: number;
  value: number;
  tag?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="mini-demo__control">
      <span className="mini-demo__control-name">
        {name}
        {tag && <span className="mini-demo__control-tag">{tag}</span>}
      </span>
      <input
        type="range"
        min={min}
        max={Math.max(min, max)}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="mini-demo__control-val">{fmt(value)}</span>
    </label>
  );
}
