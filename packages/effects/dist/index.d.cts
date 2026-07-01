interface EffectHandle {
    pause: () => void;
    resume: () => void;
    resize: () => void;
    destroy: () => void;
}
interface TweenHandle {
    /** Stop immediately. Does NOT fire onComplete. */
    cancel: () => void;
    /** Freeze at the current value; resume() continues from where it stopped. */
    pause: () => void;
    resume: () => void;
    /** Jump straight to the end value, firing a final onUpdate + onComplete. */
    finish: () => void;
}
interface TweenOptions {
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
interface BaseEffectOptions {
    background?: string;
    density?: number;
    dpr?: number;
    interactive?: boolean;
    seed?: number;
    speed?: number;
}
interface GlitterOptions extends BaseEffectOptions {
    dotCount?: number;
    beamCount?: number;
    color?: RGBTuple;
}
interface PrettyRingOptions extends BaseEffectOptions {
    count?: number;
    radius?: number;
    palettes?: RGBTuple[];
    layers?: number;
    wobble?: number;
}
interface SparkliesOptions extends BaseEffectOptions {
    fireworkCount?: number;
    beamsPerFirework?: number;
    palettes?: RGBTuple[];
    trail?: number;
}
interface KlimtOptions extends BaseEffectOptions {
    ribbonCount?: number;
    tileCount?: number;
    palettes?: RGBTuple[];
    brickWidth?: number;
    brickHeight?: number;
    trail?: number;
}
type RGBTuple = [number, number, number];
type Target = string | HTMLElement | HTMLCanvasElement;
declare function cosWave(start: number, diff: number, speed: number, clock: number): number;
declare function sparklyBeamPoint(originX: number, originY: number, distance: number, rotation: number): {
    x: number;
    y: number;
};
declare function nextKlimtBrickPoint(previousX: number, previousY: number, previousRotation: number, brickHeight: number): {
    x: number;
    y: number;
};
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
declare function tween(from: number, to: number, options?: TweenOptions): TweenHandle;
declare function mountGlitter(target: Target, options?: GlitterOptions): EffectHandle;
declare function mountPrettyRing(target: Target, options?: PrettyRingOptions): EffectHandle;
declare function mountSparklies(target: Target, options?: SparkliesOptions): EffectHandle;
declare function mountKlimt(target: Target, options?: KlimtOptions): EffectHandle;

export { type BaseEffectOptions, type EffectHandle, type GlitterOptions, type KlimtOptions, type PrettyRingOptions, type SparkliesOptions, type TweenHandle, type TweenOptions, cosWave, mountGlitter, mountKlimt, mountPrettyRing, mountSparklies, nextKlimtBrickPoint, sparklyBeamPoint, tween };
