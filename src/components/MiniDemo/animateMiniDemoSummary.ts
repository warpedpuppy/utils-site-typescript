// Builds the printed call line and the readout rows shown above the Animate
// mini-demo canvas. Every value comes from calling the real @utilspalooza/core
// function with the current controls, so the text matches the picture exactly.
import { delay, loop, stagger, tweenFrame, tweenObject, tweenValue, yoyo } from "@utilspalooza/core/Animate";
import type { AnimateDemoDef } from "./animateDemos";
import { AnimateControls, clamp01, fmt, OBJECT_SPEC, TickerSnapshot } from "./animateMiniDemoModel";

export interface AnimateReadout {
  label: string;
  value: string;
  live?: boolean;
}

export interface AnimateSummary {
  call: string;
  readouts: AnimateReadout[];
}

export function summarize(
  demo: AnimateDemoDef,
  controls: AnimateControls,
  tickerFrame: TickerSnapshot,
): AnimateSummary {
  if (demo.kind === "ticker") {
    return {
      call: `ticker(({ elapsed, delta, frame }) => draw(elapsed))`,
      readouts: [
        { label: "frame", value: String(tickerFrame.frame) },
        { label: "elapsed", value: `${fmt(tickerFrame.elapsed)} ms` },
        { label: "delta", value: `${fmt(tickerFrame.delta)} ms`, live: true },
      ],
    };
  }

  if (demo.kind === "tween-value") {
    const value = tweenValue(controls.from, controls.to, controls.elapsed, controls.duration);
    return {
      call: `tweenValue(${fmt(controls.from)}, ${fmt(controls.to)}, ${fmt(controls.elapsed)}, ${fmt(controls.duration)}) = ${fmt(value)}`,
      readouts: [
        { label: "from", value: fmt(controls.from) },
        { label: "to", value: fmt(controls.to) },
        { label: "t", value: fmt(clamp01(controls.duration <= 0 ? 1 : controls.elapsed / controls.duration)) },
        { label: "value", value: fmt(value), live: true },
      ],
    };
  }

  if (demo.kind === "tween-object") {
    const sampler = demo.fnName === "tweenFrame" ? tweenFrame : tweenObject;
    const value = sampler(OBJECT_SPEC, controls.elapsed, controls.duration);
    return {
      call: `${demo.fnName}({ x, y, alpha }, ${fmt(controls.elapsed)}, ${fmt(controls.duration)})`,
      readouts: [
        { label: "x", value: fmt(value.x) },
        { label: "y", value: fmt(value.y) },
        { label: "alpha", value: fmt(value.alpha), live: true },
      ],
    };
  }

  if (demo.kind === "loop") {
    const value = loop(controls.elapsed, controls.duration);
    return {
      call: `loop(${fmt(controls.elapsed)}, ${fmt(controls.duration)}) = ${fmt(value)}`,
      readouts: [
        { label: "elapsed", value: `${fmt(controls.elapsed)} ms` },
        { label: "duration", value: `${fmt(controls.duration)} ms` },
        { label: "progress", value: fmt(value), live: true },
      ],
    };
  }

  if (demo.kind === "yoyo") {
    const value = yoyo(controls.elapsed, controls.duration);
    return {
      call: `yoyo(${fmt(controls.elapsed)}, ${fmt(controls.duration)}) = ${fmt(value)}`,
      readouts: [
        { label: "elapsed", value: `${fmt(controls.elapsed)} ms` },
        { label: "duration", value: `${fmt(controls.duration)} ms` },
        { label: "progress", value: fmt(value), live: true },
      ],
    };
  }

  if (demo.kind === "delay") {
    const value = delay(controls.elapsed, controls.delayMs, controls.duration);
    return {
      call: `delay(${fmt(controls.elapsed)}, ${fmt(controls.delayMs)}, ${fmt(controls.duration)}) = ${fmt(value)}`,
      readouts: [
        { label: "delay", value: `${fmt(controls.delayMs)} ms` },
        { label: "duration", value: `${fmt(controls.duration)} ms` },
        { label: "progress", value: fmt(value), live: true },
      ],
    };
  }

  const itemValue = stagger(
    controls.index,
    controls.elapsed,
    controls.duration,
    controls.staggerMs,
  );
  return {
    call: `stagger(${fmt(controls.index)}, ${fmt(controls.elapsed)}, ${fmt(controls.duration)}, ${fmt(controls.staggerMs)}) = ${fmt(itemValue)}`,
    readouts: [
      { label: "index", value: fmt(controls.index) },
      { label: "stagger", value: `${fmt(controls.staggerMs)} ms` },
      { label: "item progress", value: fmt(itemValue), live: true },
    ],
  };
}
