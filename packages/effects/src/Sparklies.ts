import {
  createLoop,
  createRuntime,
  fadeFill,
  jewelPalette,
  makeGlow,
  TAU,
  type BaseEffectOptions,
  type EffectHandle,
  type RGBTuple,
  type Target,
} from './mountHarness';

export interface SparkliesOptions extends BaseEffectOptions {
  fireworkCount?: number;
  beamsPerFirework?: number;
  palettes?: RGBTuple[];
  trail?: number;
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

/**
 * Where a firework beam's tip sits after travelling `distance` along `rotation`.
 * Exported because the site's Sparklies example embeds it verbatim in a CodePen.
 */
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
