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

export interface GlitterOptions extends BaseEffectOptions {
  dotCount?: number;
  beamCount?: number;
  color?: RGBTuple;
}

export interface PrettyRingOptions extends BaseEffectOptions {
  count?: number;
  radius?: number;
  palettes?: RGBTuple[];
  layers?: number;
  wobble?: number;
}

export interface SparkliesOptions extends BaseEffectOptions {
  fireworkCount?: number;
  beamsPerFirework?: number;
  palettes?: RGBTuple[];
  trail?: number;
}

export interface KlimtOptions extends BaseEffectOptions {
  ribbonCount?: number;
  tileCount?: number;
  palettes?: RGBTuple[];
  brickWidth?: number;
  brickHeight?: number;
  trail?: number;
}

type RGBTuple = [number, number, number];
type Target = string | HTMLElement | HTMLCanvasElement;
type Frame = (ctx: CanvasRenderingContext2D, width: number, height: number, delta: number) => void;

interface Runtime {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
  pointer: { x: number; y: number; active: boolean };
  random: () => number;
}

const TAU = Math.PI * 2;
const DEFAULT_DPR = 2;

const jewelPalette: RGBTuple[] = [
  [255, 117, 117],
  [255, 183, 117],
  [255, 241, 117],
  [195, 255, 118],
  [123, 255, 184],
  [125, 232, 255],
  [121, 159, 255],
  [255, 147, 247],
];

const ringPalette: RGBTuple[] = [
  [68, 105, 150],
  [45, 66, 100],
  [24, 32, 51],
  [11, 40, 38],
  [31, 52, 35],
  [11, 72, 42],
  [136, 129, 54],
  [99, 80, 33],
  [92, 42, 29],
];

export function cosWave(start: number, diff: number, speed: number, clock: number): number {
  return start + Math.cos(clock * speed) * diff;
}

export function sparklyBeamPoint(
  originX: number,
  originY: number,
  distance: number,
  rotation: number,
): { x: number; y: number } {
  return {
    x: originX - distance * Math.sin(rotation),
    y: originY + distance * Math.cos(rotation),
  };
}

export function nextKlimtBrickPoint(
  previousX: number,
  previousY: number,
  previousRotation: number,
  brickHeight: number,
): { x: number; y: number } {
  return {
    x: previousX + brickHeight * Math.sin(previousRotation),
    y: previousY - brickHeight * Math.cos(previousRotation),
  };
}

export function mountGlitter(target: Target, options: GlitterOptions = {}): EffectHandle {
  const runtime = createRuntime(target, options);
  const color = options.color ?? [255, 238, 92];
  const density = options.density ?? 1;
  const dotCount = Math.max(20, Math.floor((options.dotCount ?? 850) * density));
  const beamCount = Math.max(12, Math.floor((options.beamCount ?? 220) * density));
  const glow = makeGlow(18, color);
  const beam = makeBeam(420, 12, color);
  let dots: Array<{
    sx: number;
    sy: number;
    dx: number;
    dy: number;
    alpha: number;
    speed: number;
    scale: number;
    phaseX: number;
    phaseY: number;
  }> = [];
  let beams: Array<{
    rotation: number;
    value: number;
    diff: number;
    speed: number;
    alpha: number;
    phase: number;
  }> = [];
  let clock = 0;
  let rotation = 0;
  let parallaxX = 0;
  let parallaxY = 0;

  const rebuild = () => {
    const spread = Math.max(runtime.width, runtime.height) * 0.8;
    dots = Array.from({ length: dotCount }, () => {
      const sx = signed(runtime.random()) * runtime.random() * spread;
      const sy = signed(runtime.random()) * runtime.random() * spread;
      return {
        sx,
        sy,
        dx: Math.abs(sx * (0.45 + runtime.random() * 0.4)),
        dy: Math.abs(sy * (0.45 + runtime.random() * 0.4)),
        alpha: 0.08 + runtime.random() * 0.28,
        speed: 0.00025 + runtime.random() * 0.0012,
        scale: 0.2 + runtime.random() * 1.4,
        phaseX: runtime.random() * TAU,
        phaseY: runtime.random() * TAU,
      };
    });
    beams = Array.from({ length: beamCount }, (_, i) => ({
      rotation: (i / beamCount) * TAU,
      value: 0.25 + runtime.random() * 0.8,
      diff: 0.35 + runtime.random() * 1.15,
      speed: 0.0002 + runtime.random() * 0.0009,
      alpha: 0.025 + runtime.random() * 0.035,
      phase: runtime.random() * TAU,
    }));
  };

  rebuild();

  return createLoop(runtime, (ctx, width, height, delta) => {
    clock += delta * (options.speed ?? 1);
    rotation += 0.00022 * delta * (options.speed ?? 1);
    ctx.fillStyle = options.background ?? '#170425';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';

    const targetParallaxX =
      options.interactive && runtime.pointer.active
        ? (runtime.pointer.x - width / 2) * 0.016
        : 0;
    const targetParallaxY =
      options.interactive && runtime.pointer.active
        ? (runtime.pointer.y - height / 2) * 0.016
        : 0;
    const easing = 1 - Math.pow(0.985, delta / 16.6667);
    parallaxX += (targetParallaxX - parallaxX) * easing;
    parallaxY += (targetParallaxY - parallaxY) * easing;

    ctx.save();
    ctx.translate(width / 2 + parallaxX, height / 2 + parallaxY);
    for (const dot of dots) {
      const x = dot.sx + Math.cos(clock * dot.speed + dot.phaseX) * dot.dx;
      const y = dot.sy + Math.cos(clock * dot.speed * 0.85 + dot.phaseY) * dot.dy;
      const size = 18 * dot.scale;
      ctx.globalAlpha = dot.alpha;
      ctx.drawImage(glow, x - size / 2, y - size / 2, size, size);
    }

    ctx.rotate(rotation);
    for (const line of beams) {
      const sx = Math.max(
        0.05,
        line.value + Math.cos(clock * line.speed + line.phase) * line.diff
      );
      ctx.save();
      ctx.rotate(line.rotation);
      ctx.globalAlpha = line.alpha;
      ctx.drawImage(beam, 0, -2, 420 * sx, 4);
      ctx.restore();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }, rebuild);
}

export function mountPrettyRing(target: Target, options: PrettyRingOptions = {}): EffectHandle {
  const runtime = createRuntime(target, options);
  const palette = options.palettes ?? ringPalette;
  const density = options.density ?? 1;
  const layers = Math.max(1, Math.floor(options.layers ?? 3));
  const count = Math.max(80, Math.floor((options.count ?? 720) * density));
  const wobble = options.wobble ?? 42;
  const glows = palette.map((color) => makeGlow(12, color));
  let dots: Array<{
    angle: number;
    layer: number;
    variance: number;
    speed: number;
    scale: number;
    glow: HTMLCanvasElement;
  }> = [];
  let clock = 0;
  let rotation = 0;

  const rebuild = () => {
    dots = Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * TAU,
      layer: i % layers,
      variance: 6 + runtime.random() * wobble,
      speed: 0.00015 + runtime.random() * 0.0017,
      scale: 0.55 + runtime.random() * 0.55,
      glow: glows[i % glows.length],
    }));
  };

  rebuild();

  return createLoop(runtime, (ctx, width, height, delta) => {
    clock += delta * (options.speed ?? 1);
    rotation += 0.00014 * delta * (options.speed ?? 1);
    ctx.fillStyle = options.background ?? '#02050b';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';

    const baseRadius = options.radius ?? Math.min(width, height) * 0.26;
    const pointerPulse = options.interactive && runtime.pointer.active
      ? Math.hypot(runtime.pointer.x - width / 2, runtime.pointer.y - height / 2) * 0.025
      : 0;

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(rotation);
    ctx.globalAlpha = Math.min(1, clock / 800);
    for (const dot of dots) {
      const layerOffset = (dot.layer - (layers - 1) / 2) * 28;
      const radius = baseRadius + layerOffset + pointerPulse;
      const x0 = Math.cos(dot.angle) * radius;
      const y0 = Math.sin(dot.angle) * radius;
      const x = dot.layer % 2 === 0 ? cosWave(x0, dot.variance, dot.speed, clock) : x0;
      const y = dot.layer % 2 === 1 ? cosWave(y0, dot.variance, dot.speed, clock) : y0;
      const size = 10 + 4 * dot.scale;
      ctx.drawImage(dot.glow, x - size / 2, y - size / 2, size, size);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }, rebuild);
}

export function mountSparklies(target: Target, options: SparkliesOptions = {}): EffectHandle {
  const runtime = createRuntime(target, options);
  const palette = options.palettes ?? jewelPalette;
  const density = options.density ?? 1;
  const fireworkCount = Math.max(3, Math.floor((options.fireworkCount ?? 32) * density));
  const beamsPerFirework = Math.max(4, Math.floor((options.beamsPerFirework ?? 18) * density));
  const glows = palette.map((color) => makeGlow(16, color));
  let fireworks: Firework[] = [];

  const makeFirework = (): Firework => {
    const frames = 900 + runtime.random() * 3600;
    return {
      x: 80 + runtime.random() * Math.max(1, runtime.width - 160),
      y: 80 + runtime.random() * Math.max(1, runtime.height - 160),
      age: runtime.random() * frames,
      twinkleStart: frames * 0.25,
      fadeStart: frames * 0.62,
      end: frames,
      beams: Array.from({ length: beamsPerFirework }, () => ({
        glow: glows[Math.floor(runtime.random() * glows.length)],
        size: 1.5 + runtime.random() * 3.5,
        rotation: runtime.random() * TAU,
        speed: 0.025 + runtime.random() * 0.12,
        dist: 0,
        alpha: 1,
      })),
    };
  };

  const rebuild = () => {
    fireworks = Array.from({ length: fireworkCount }, makeFirework);
  };

  const restart = (firework: Firework) => {
    const fresh = makeFirework();
    Object.assign(firework, fresh, { age: 0 });
  };

  rebuild();

  return createLoop(runtime, (ctx, width, height, delta) => {
    ctx.fillStyle = fadeFill(options.background ?? '#020309', options.trail ?? 0.34);
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';

    for (const firework of fireworks) {
      firework.age += delta * (options.speed ?? 1);
      const twinkling = firework.age >= firework.twinkleStart && firework.age < firework.fadeStart;
      for (const beam of firework.beams) {
        beam.dist += beam.speed * delta;
        const fade = firework.age > firework.fadeStart ? 1 - (firework.age - firework.fadeStart) / (firework.end - firework.fadeStart) : 1;
        const twinkle = twinkling ? 0.25 + runtime.random() * 0.9 : 1;
        const p = sparklyBeamPoint(firework.x, firework.y, beam.dist, beam.rotation);
        ctx.globalAlpha = Math.max(0, Math.min(1, fade * twinkle));
        ctx.drawImage(beam.glow, p.x - beam.size / 2, p.y - beam.size / 2, beam.size, beam.size);
      }
      if (firework.age >= firework.end) restart(firework);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }, rebuild);
}

export function mountKlimt(target: Target, options: KlimtOptions = {}): EffectHandle {
  const runtime = createRuntime(target, options);
  const palette = options.palettes ?? [[255, 240, 245], [230, 230, 250], ...jewelPalette];
  const ribbonCount = Math.max(1, Math.floor(options.ribbonCount ?? 6));
  const tileCount = Math.max(20, Math.floor(options.tileCount ?? 130));
  const brickWidth = options.brickWidth ?? 30;
  const brickHeight = options.brickHeight ?? 15;
  let ribbons: Ribbon[] = [];

  const makeRibbon = (index: number): Ribbon => {
    const seed = ribbonSeed(index, ribbonCount, runtime.width, runtime.height);
    return {
      x: seed.x,
      y: seed.y,
      rotation: (runtime.random() * 2 - 1) * Math.PI,
      curve: [-45, 45, 135, -135][Math.floor(runtime.random() * 4)],
      curveCounter: 0,
      curveLimit: 36 + Math.floor(runtime.random() * 70),
      interval: 1 + Math.floor(runtime.random() * 3),
      tick: 0,
      bricks: Array.from({ length: tileCount }, (_, i) => ({
        x: seed.x,
        y: seed.y,
        rotation: 0,
        color: rgb(palette[i % palette.length]),
        placed: false,
      })),
      cursor: 0,
    };
  };

  const rebuild = () => {
    ribbons = Array.from({ length: ribbonCount }, (_, i) => makeRibbon(i));
  };

  const stepRibbon = (ribbon: Ribbon) => {
    ribbon.tick += 1;
    if (ribbon.tick % ribbon.interval !== 0) return;
    const brick = ribbon.bricks[ribbon.cursor];
    ribbon.curveCounter += 1;
    ribbon.curve *= 1.035;
    ribbon.rotation = (ribbon.curve * Math.PI) / 180;
    const next = nextKlimtBrickPoint(ribbon.x, ribbon.y, ribbon.rotation, brickHeight);
    ribbon.x = next.x;
    ribbon.y = next.y;
    if (
      ribbon.curveCounter > ribbon.curveLimit ||
      ribbon.x < -60 ||
      ribbon.x > runtime.width + 60 ||
      ribbon.y < -60 ||
      ribbon.y > runtime.height + 60
    ) {
      const seed = ribbonSeed(Math.floor(runtime.random() * ribbonCount), ribbonCount, runtime.width, runtime.height);
      ribbon.x = seed.x;
      ribbon.y = seed.y;
      ribbon.curve = [-45, 45, 135, -135][Math.floor(runtime.random() * 4)];
      ribbon.curveCounter = 0;
      ribbon.curveLimit = 36 + Math.floor(runtime.random() * 70);
    }
    brick.x = ribbon.x;
    brick.y = ribbon.y;
    brick.rotation = ribbon.rotation;
    brick.placed = true;
    ribbon.cursor = (ribbon.cursor + 1) % ribbon.bricks.length;
  };

  rebuild();

  return createLoop(runtime, (ctx, width, height) => {
    ctx.fillStyle = fadeFill(options.background ?? '#020202', options.trail ?? 0.12);
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    for (const ribbon of ribbons) {
      stepRibbon(ribbon);
      ctx.globalAlpha = 0.22;
      for (const brick of ribbon.bricks) {
        if (!brick.placed) continue;
        ctx.save();
        ctx.translate(brick.x, brick.y);
        ctx.rotate(brick.rotation);
        ctx.fillStyle = brick.color;
        ctx.fillRect(-brickWidth / 2, -brickHeight, brickWidth, brickHeight);
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }, rebuild);
}

interface Firework {
  x: number;
  y: number;
  age: number;
  twinkleStart: number;
  fadeStart: number;
  end: number;
  beams: Array<{ glow: HTMLCanvasElement; size: number; rotation: number; speed: number; dist: number; alpha: number }>;
}

interface Ribbon {
  x: number;
  y: number;
  rotation: number;
  curve: number;
  curveCounter: number;
  curveLimit: number;
  interval: number;
  tick: number;
  cursor: number;
  bricks: Array<{ x: number; y: number; rotation: number; color: string; placed: boolean }>;
}

function createLoop(runtime: Runtime, frame: Frame, onResize?: () => void): EffectHandle {
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

function createRuntime(target: Target, options: BaseEffectOptions): Runtime {
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

function makeGlow(diameter: number, [r, g, b]: RGBTuple): HTMLCanvasElement {
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

function makeBeam(w: number, h: number, [r, g, b]: RGBTuple): HTMLCanvasElement {
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

function seededRandom(seed?: number): () => number {
  if (seed === undefined) return Math.random;
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function signed(value: number): number {
  return value > 0.5 ? 1 : -1;
}

function rgb([r, g, b]: RGBTuple): string {
  return `rgb(${r},${g},${b})`;
}

function fadeFill(background: string, alpha: number): string {
  if (background.startsWith('#')) {
    const hex = background.slice(1);
    const full = hex.length === 3 ? hex.split('').map((x) => x + x).join('') : hex;
    const n = Number.parseInt(full, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
  }
  return background;
}

function ribbonSeed(index: number, count: number, width: number, height: number): { x: number; y: number } {
  const angle = (index / count) * TAU - Math.PI / 2;
  return {
    x: width / 2 + Math.cos(angle) * width * 0.26,
    y: height / 2 + Math.sin(angle) * height * 0.22,
  };
}
