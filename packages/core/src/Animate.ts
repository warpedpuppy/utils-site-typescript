import { clamp } from './Clamp';
import { linear } from './Easing';
import { lerp } from './Lerp';

export type EasingFunction = (t: number) => number;

export interface TickerFrame {
  time: number;
  delta: number;
  elapsed: number;
  frame: number;
}

export interface TickerHandle {
  cancel: () => void;
}

export interface TweenValueOptions {
  easing?: EasingFunction;
  clamp?: boolean;
}

export type TweenObjectSpec<T extends Record<string, number>> = {
  [K in keyof T]: {
    from: number;
    to: number;
  };
};

export interface SpringOptions {
  stiffness?: number;
  damping?: number;
  mass?: number;
  deltaSeconds?: number;
}

export interface SpringState {
  value: number;
  velocity: number;
}

const raf =
  typeof globalThis.requestAnimationFrame === 'function'
    ? globalThis.requestAnimationFrame.bind(globalThis)
    : (callback: FrameRequestCallback) => globalThis.setTimeout(() => callback(Date.now()), 16);

const caf =
  typeof globalThis.cancelAnimationFrame === 'function'
    ? globalThis.cancelAnimationFrame.bind(globalThis)
    : (id: number) => globalThis.clearTimeout(id);

/**
 * Run a callback every animation frame and return a small cancellation handle.
 *
 * @example
 * const handle = ticker(({ elapsed }) => draw(elapsed));
 * // later: handle.cancel();
 */
export function ticker(callback: (frame: TickerFrame) => void): TickerHandle {
  let active = true;
  let rafId = 0;
  let previous = 0;
  let start = 0;
  let frame = 0;

  const tick = (time: number) => {
    if (!active) return;
    if (frame === 0) {
      start = time;
      previous = time;
    }

    const delta = time - previous;
    previous = time;
    callback({ time, delta, elapsed: time - start, frame });
    frame += 1;
    rafId = raf(tick);
  };

  rafId = raf(tick);

  return {
    cancel() {
      active = false;
      caf(rafId);
    },
  };
}

/**
 * Return the value of a scalar tween at a specific elapsed time.
 *
 * @example
 * tweenValue(0, 100, 250, 500); // => 50 (halfway through, linear)
 */
export function tweenValue(
  from: number,
  to: number,
  elapsedMs: number,
  durationMs: number,
  easingOrOptions: EasingFunction | TweenValueOptions = linear,
): number {
  const options = typeof easingOrOptions === 'function' ? { easing: easingOrOptions } : easingOrOptions;
  const easing = options.easing ?? linear;
  const shouldClamp = options.clamp ?? true;
  const t = durationMs <= 0 ? 1 : elapsedMs / durationMs;
  const progress = shouldClamp ? clamp(t, 0, 1) : t;
  return lerp(from, to, easing(progress));
}

/**
 * Return every numeric property of an object tween at a specific elapsed time.
 *
 * @example
 * tweenObject({ x: { from: 0, to: 10 } }, 250, 500); // => { x: 5 }
 */
export function tweenObject<T extends Record<string, number>>(
  spec: TweenObjectSpec<T>,
  elapsedMs: number,
  durationMs: number,
  easingOrOptions: EasingFunction | TweenValueOptions = linear,
): T {
  const out = {} as T;
  for (const key of Object.keys(spec) as Array<keyof T>) {
    const range = spec[key];
    out[key] = tweenValue(range.from, range.to, elapsedMs, durationMs, easingOrOptions) as T[keyof T];
  }
  return out;
}

/**
 * Alias for tweenObject when you want to sample animation state one frame at a time.
 *
 * @example
 * tweenFrame({ x: { from: 0, to: 10 } }, 500, 500); // => { x: 10 }
 */
export const tweenFrame = tweenObject;

/**
 * Advance a damped spring one fixed simulation step.
 *
 * @example
 * let s = { value: 0, velocity: 0 };
 * s = springValue(s, 100); // => state nudged toward 100; call each frame
 */
export function springValue(
  state: SpringState,
  target: number,
  {
    stiffness = 170,
    damping = 26,
    mass = 1,
    deltaSeconds = 1 / 60,
  }: SpringOptions = {},
): SpringState {
  const force = -stiffness * (state.value - target);
  const damper = -damping * state.velocity;
  const acceleration = (force + damper) / mass;
  const velocity = state.velocity + acceleration * deltaSeconds;
  const value = state.value + velocity * deltaSeconds;
  return { value, velocity };
}

/**
 * The damping coefficient that makes {@link springValue} *critically* damped — the
 * fastest approach to the target with no overshoot — for a given `stiffness` and `mass`.
 *
 * Critical damping is `c = 2·√(k·m)`. Pass less to {@link springValue}'s `damping` for
 * bounce (underdamped), more for a sluggish crawl (overdamped). With the default
 * stiffness of 170 this is `≈ 26`, which is why 26 is the default damping.
 *
 * @example
 * criticalDamping(170); // => ~26.08
 */
export function criticalDamping(stiffness: number, mass = 1): number {
  return 2 * Math.sqrt(stiffness * mass);
}

/**
 * Map elapsed time into a repeating 0..1 progress value.
 *
 * @example
 * loop(750, 500); // => 0.5 (250ms into the second cycle)
 */
export function loop(elapsedMs: number, durationMs: number): number {
  if (durationMs <= 0) return 1;
  return ((elapsedMs % durationMs) + durationMs) % durationMs / durationMs;
}

/**
 * Map elapsed time into a reversing 0..1..0 progress value.
 *
 * @example
 * yoyo(500, 500); // => 1 (at the turnaround peak)
 */
export function yoyo(elapsedMs: number, durationMs: number): number {
  if (durationMs <= 0) return 1;
  const cycle = loop(elapsedMs, durationMs * 2);
  return cycle <= 0.5 ? cycle * 2 : (1 - cycle) * 2;
}

/**
 * Delay a progress value by `delayMs`, returning 0 until the delay has elapsed.
 *
 * @example
 * delay(300, 200, 500); // => 0.2 (100ms into a 500ms tween)
 */
export function delay(elapsedMs: number, delayMs: number, durationMs: number): number {
  if (elapsedMs <= delayMs) return 0;
  if (durationMs <= 0) return 1;
  return clamp((elapsedMs - delayMs) / durationMs, 0, 1);
}

/**
 * Return the delayed progress for an item in a staggered list.
 *
 * @example
 * stagger(2, 600, 500, 200); // => 0.4 (item 2 starts 400ms in)
 */
export function stagger(index: number, elapsedMs: number, durationMs: number, staggerMs: number): number {
  return delay(elapsedMs, Math.max(0, index) * staggerMs, durationMs);
}
