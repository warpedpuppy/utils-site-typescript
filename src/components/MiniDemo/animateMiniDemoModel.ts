// Shared types, defaults, and tiny pure helpers for the Animate mini-demo.
// Imported by the component (AnimateMiniDemo.tsx), the drawing functions
// (drawAnimateMiniDemo.ts), and the call/readout summary (animateMiniDemoSummary.ts)
// so none of them re-declares the control shape or the number formatter.
import type { AnimateDemoDef } from "./animateDemos";

export interface AnimateControls {
  elapsed: number;
  duration: number;
  from: number;
  to: number;
  delayMs: number;
  staggerMs: number;
  index: number;
}

export interface TickerSnapshot {
  frame: number;
  elapsed: number;
  delta: number;
}

export const DEFAULT_CONTROLS: AnimateControls = {
  elapsed: 420,
  duration: 1000,
  from: 0,
  to: 100,
  delayMs: 280,
  staggerMs: 160,
  index: 2,
};

export const OBJECT_SPEC = {
  x: { from: 36, to: 244 },
  y: { from: 28, to: 96 },
  alpha: { from: 0.2, to: 1 },
};

// The length of one auto-sweep cycle, per demo kind — drives both the sweep
// wrap in the component and the "elapsed" track scale in the drawings.
export function cycleSpan(kind: AnimateDemoDef["kind"], controls: AnimateControls): number {
  if (kind === "delay") return controls.delayMs + controls.duration + 260;
  if (kind === "stagger") return controls.duration + controls.staggerMs * 5 + 160;
  if (kind === "yoyo") return controls.duration * 2;
  return controls.duration;
}

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function fmt(n: number): string {
  const r = Math.round(n * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}
