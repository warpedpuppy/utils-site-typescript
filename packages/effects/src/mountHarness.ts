// Shared harness for every mount* effect: canvas resolution, DPR-aware sizing,
// the rAF loop, pointer/resize wiring, seeded RNG, and the cached draw-asset
// makers (glow/beam sprites). Each effect file (Glitter/PrettyRing/Sparklies/
// Klimt) contains ONLY its own geometry + palette and leans on this file for
// everything else. Nothing here is effect-specific.

export interface EffectHandle {
  pause: () => void;
  resume: () => void;
  resize: () => void;
  destroy: () => void;
}

export interface BaseEffectOptions {
  background?: string;
  density?: number;
  dpr?: number;
  interactive?: boolean;
  seed?: number;
  speed?: number;
}

export type RGBTuple = [number, number, number];
export type Target = string | HTMLElement | HTMLCanvasElement;
export type Frame = (ctx: CanvasRenderingContext2D, width: number, height: number, delta: number) => void;

export interface Runtime {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
  pointer: { x: number; y: number; active: boolean };
  random: () => number;
}

export const TAU = Math.PI * 2;
const DEFAULT_DPR = 2;

/** Shared jewel palette (Sparklies + Klimt both draw from it). */
export const jewelPalette: RGBTuple[] = [
  [255, 117, 117],
  [255, 183, 117],
  [255, 241, 117],
  [195, 255, 118],
  [123, 255, 184],
  [125, 232, 255],
  [121, 159, 255],
  [255, 147, 247],
];

export function createLoop(runtime: Runtime, frame: Frame, onResize?: () => void): EffectHandle {
  let active = true;
  let paused = false;
  let rafId = 0;
  let previous = performance.now();

  const tick = (time: number) => {
    if (!active) return;
    const delta = Math.min(50, time - previous || 16.667);
    previous = time;
    if (!paused) frame(runtime.ctx, runtime.width, runtime.height, delta);
    rafId = requestAnimationFrame(tick);
  };

  const resize = () => {
    resizeRuntime(runtime);
    onResize?.();
  };

  const cleanup = attachRuntimeListeners(runtime, resize);
  resize();
  rafId = requestAnimationFrame(tick);

  return {
    pause() {
      paused = true;
    },
    resume() {
      paused = false;
      previous = performance.now();
    },
    resize,
    destroy() {
      active = false;
      cancelAnimationFrame(rafId);
      cleanup();
      if (runtime.canvas.dataset.utilspaloozaCreated === 'true') runtime.canvas.remove();
    },
  };
}

export function createRuntime(target: Target, options: BaseEffectOptions): Runtime {
  const canvas = resolveCanvas(target);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('@utilspalooza/effects requires a 2D canvas context.');
  const runtime: Runtime = {
    canvas,
    ctx,
    width: 0,
    height: 0,
    dpr: options.dpr ?? Math.min(globalThis.devicePixelRatio || 1, DEFAULT_DPR),
    pointer: { x: 0, y: 0, active: false },
    random: seededRandom(options.seed),
  };
  resizeRuntime(runtime);
  return runtime;
}

function resolveCanvas(target: Target): HTMLCanvasElement {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) throw new Error(`@utilspalooza/effects could not find target: ${String(target)}`);
  if (el instanceof HTMLCanvasElement) return el;
  const canvas = document.createElement('canvas');
  canvas.dataset.utilspaloozaCreated = 'true';
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  el.appendChild(canvas);
  return canvas;
}

function resizeRuntime(runtime: Runtime): void {
  const parent = runtime.canvas.parentElement;
  const rect = runtime.canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width || parent?.clientWidth || 640));
  const height = Math.max(1, Math.floor(rect.height || parent?.clientHeight || 360));
  runtime.width = width;
  runtime.height = height;
  runtime.canvas.width = Math.floor(width * runtime.dpr);
  runtime.canvas.height = Math.floor(height * runtime.dpr);
  runtime.canvas.style.width = `${width}px`;
  runtime.canvas.style.height = `${height}px`;
  runtime.ctx.setTransform(runtime.dpr, 0, 0, runtime.dpr, 0, 0);
}

function attachRuntimeListeners(runtime: Runtime, resize: () => void): () => void {
  const pointerMove = (event: PointerEvent) => {
    const rect = runtime.canvas.getBoundingClientRect();
    runtime.pointer.x = event.clientX - rect.left;
    runtime.pointer.y = event.clientY - rect.top;
    runtime.pointer.active = true;
  };
  const pointerLeave = () => {
    runtime.pointer.active = false;
  };
  runtime.canvas.addEventListener('pointermove', pointerMove);
  runtime.canvas.addEventListener('pointerleave', pointerLeave);
  window.addEventListener('resize', resize);
  const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : undefined;
  if (observer && runtime.canvas.parentElement) observer.observe(runtime.canvas.parentElement);
  return () => {
    runtime.canvas.removeEventListener('pointermove', pointerMove);
    runtime.canvas.removeEventListener('pointerleave', pointerLeave);
    window.removeEventListener('resize', resize);
    observer?.disconnect();
  };
}

export function makeGlow(diameter: number, [r, g, b]: RGBTuple): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = diameter;
  const x = c.getContext('2d');
  if (!x) return c;
  const rad = diameter / 2;
  const grad = x.createRadialGradient(rad, rad, 0, rad, rad, rad);
  grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
  grad.addColorStop(0.35, `rgba(${r},${g},${b},0.75)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  x.fillStyle = grad;
  x.fillRect(0, 0, diameter, diameter);
  return c;
}

export function makeCrispGlow(diameter: number, [r, g, b]: RGBTuple): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = diameter;
  const x = c.getContext('2d');
  if (!x) return c;
  const rad = diameter / 2;
  const grad = x.createRadialGradient(rad, rad, 0, rad, rad, rad);
  grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
  grad.addColorStop(0.2, `rgba(${r},${g},${b},0.98)`);
  grad.addColorStop(0.52, `rgba(${r},${g},${b},0.42)`);
  grad.addColorStop(0.82, `rgba(${r},${g},${b},0.08)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  x.fillStyle = grad;
  x.fillRect(0, 0, diameter, diameter);
  return c;
}

export function makeBeam(w: number, h: number, [r, g, b]: RGBTuple): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const x = c.getContext('2d');
  if (!x) return c;
  const grad = x.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
  grad.addColorStop(0.45, `rgba(${r},${g},${b},0.55)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  x.fillStyle = grad;
  x.fillRect(0, 0, w, h);
  return c;
}

export function seededRandom(seed?: number): () => number {
  if (seed === undefined) return Math.random;
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function rgb([r, g, b]: RGBTuple): string {
  return `rgb(${r},${g},${b})`;
}

export function fadeFill(background: string, alpha: number): string {
  if (background.startsWith('#')) {
    const hex = background.slice(1);
    const full = hex.length === 3 ? hex.split('').map((x) => x + x).join('') : hex;
    const n = Number.parseInt(full, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
  }
  return background;
}
