import {
  createLoop,
  createRuntime,
  makeCrispGlow,
  TAU,
  type BaseEffectOptions,
  type EffectHandle,
  type RGBTuple,
  type Target,
} from './mountHarness';

export interface PrettyRingOptions extends BaseEffectOptions {
  count?: number;
  radius?: number;
  palettes?: RGBTuple[];
  layers?: number;
  wobble?: number;
}

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

/**
 * Cosine oscillation around a base value — the tiny math that makes each ring
 * dot breathe. Exported because the site's PrettyRing example embeds it in a
 * CodePen to show the motion is single-sourced.
 */
export function cosWave(start: number, diff: number, speed: number, clock: number): number {
  return start + Math.cos(clock * speed) * diff;
}

export function mountPrettyRing(target: Target, options: PrettyRingOptions = {}): EffectHandle {
  const runtime = createRuntime(target, options);
  const palette = options.palettes ?? ringPalette;
  const density = options.density ?? 1;
  const layers = Math.max(1, Math.floor(options.layers ?? 3));
  const count = Math.max(80, Math.floor((options.count ?? 720) * density));
  const wobble = options.wobble ?? 42;
  const glows = palette.map((color) => makeCrispGlow(10, color));
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
      const size = 7 + 2.5 * dot.scale;
      ctx.drawImage(dot.glow, x - size / 2, y - size / 2, size, size);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }, rebuild);
}
