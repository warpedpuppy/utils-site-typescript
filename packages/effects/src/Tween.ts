export interface TweenHandle {
  /** Stop immediately. Does NOT fire onComplete. */
  cancel: () => void;
  /** Freeze at the current value; resume() continues from where it stopped. */
  pause: () => void;
  resume: () => void;
  /** Jump straight to the end value, firing a final onUpdate + onComplete. */
  finish: () => void;
}

export interface TweenOptions {
  /** Duration in milliseconds. Default 400. */
  duration?: number;
  /**
   * Normalized easing curve, `(t: 0..1) => 0..1`. Default linear.
   * Bring a real curve from the math package, e.g.
   * `import { easeOutCubic } from "@utilspalooza/core"`.
   */
  easing?: (t: number) => number;
  /** Milliseconds to wait before the first frame. Default 0. */
  delay?: number;
  /** Called every frame with the current interpolated value. */
  onUpdate?: (value: number) => void;
  /** Called once when the tween reaches the end (not on cancel). */
  onComplete?: () => void;
}

/**
 * Fire-and-forget numeric tween — the ergonomic counterpart to core's pure
 * `tweenValue`. This owns its own rAF loop and clock (which is exactly why it
 * lives in `effects`, not in the pure `@utilspalooza/core`). The interpolation
 * itself is the trivial lerp; the *shape* of the motion comes from the easing
 * you pass in, so source a real curve from core:
 *
 * @example
 * import { easeOutCubic } from "@utilspalooza/core";
 * const t = tween(0, 100, {
 *   duration: 600,
 *   easing: easeOutCubic,
 *   onUpdate: (v) => (box.style.left = v + "px"),
 *   onComplete: () => console.log("done"),
 * });
 * // t.pause(); t.resume(); t.cancel(); t.finish();
 *
 * @param from - Starting value.
 * @param to - Ending value.
 * @param options - Duration, easing, delay, and update/complete callbacks.
 * @returns A handle to pause, resume, cancel, or finish the tween.
 */
export function tween(from: number, to: number, options: TweenOptions = {}): TweenHandle {
  const duration = options.duration ?? 400;
  const easing = options.easing ?? ((t: number) => t);
  const delay = Math.max(0, options.delay ?? 0);
  const { onUpdate, onComplete } = options;

  let rafId = 0;
  let done = false;
  let paused = false;
  let startTime = performance.now() + delay;
  // Time consumed before a pause, so resume() picks up exactly where it stopped.
  let pausedElapsed = 0;

  function emit(value: number): void {
    if (onUpdate) onUpdate(value);
  }

  function complete(): void {
    if (done) return;
    done = true;
    cancelAnimationFrame(rafId);
    emit(to); // land exactly on `to`, regardless of easing(1) rounding
    if (onComplete) onComplete();
  }

  function tick(now: number): void {
    if (done || paused) return;
    const elapsed = now - startTime;
    if (elapsed < 0) {
      // Still inside the delay window — wait without emitting.
      rafId = requestAnimationFrame(tick);
      return;
    }
    const t = duration <= 0 ? 1 : Math.min(1, elapsed / duration);
    if (t >= 1) {
      complete();
      return;
    }
    emit(from + (to - from) * easing(t));
    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);

  return {
    cancel() {
      done = true;
      cancelAnimationFrame(rafId);
    },
    pause() {
      if (done || paused) return;
      paused = true;
      cancelAnimationFrame(rafId);
      pausedElapsed = performance.now() - startTime;
    },
    resume() {
      if (done || !paused) return;
      paused = false;
      startTime = performance.now() - pausedElapsed;
      rafId = requestAnimationFrame(tick);
    },
    finish() {
      complete();
    },
  };
}
