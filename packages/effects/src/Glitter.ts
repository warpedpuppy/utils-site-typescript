import {
  createLoop,
  createRuntime,
  makeBeam,
  makeGlow,
  TAU,
  type BaseEffectOptions,
  type EffectHandle,
  type RGBTuple,
  type Target,
} from './mountHarness';

export interface GlitterOptions extends BaseEffectOptions {
  dotCount?: number;
  beamCount?: number;
  color?: RGBTuple;
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
    angle: number;
    radius: number;
    radialAmplitude: number;
    angleAmplitude: number;
    alpha: number;
    speed: number;
    scale: number;
    radialPhase: number;
    anglePhase: number;
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
      return {
        angle: runtime.random() * TAU,
        radius: Math.sqrt(runtime.random()) * spread,
        radialAmplitude: 16 + runtime.random() * spread * 0.16,
        angleAmplitude: (runtime.random() - 0.5) * 0.42,
        alpha: 0.08 + runtime.random() * 0.28,
        speed: 0.00025 + runtime.random() * 0.0012,
        scale: 0.2 + runtime.random() * 1.4,
        // Start half the field moving outward and half inward.
        radialPhase: runtime.random() > 0.5 ? 0 : Math.PI,
        anglePhase: runtime.random() * TAU,
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
      const radius =
        dot.radius + Math.sin(clock * dot.speed + dot.radialPhase) * dot.radialAmplitude;
      const angle =
        dot.angle + Math.cos(clock * dot.speed * 0.35 + dot.anglePhase) * dot.angleAmplitude;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
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
