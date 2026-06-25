interface EffectHandle {
    pause: () => void;
    resume: () => void;
    resize: () => void;
    destroy: () => void;
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
declare function mountGlitter(target: Target, options?: GlitterOptions): EffectHandle;
declare function mountPrettyRing(target: Target, options?: PrettyRingOptions): EffectHandle;
declare function mountSparklies(target: Target, options?: SparkliesOptions): EffectHandle;
declare function mountKlimt(target: Target, options?: KlimtOptions): EffectHandle;

export { type BaseEffectOptions, type EffectHandle, type GlitterOptions, type KlimtOptions, type PrettyRingOptions, type SparkliesOptions, cosWave, mountGlitter, mountKlimt, mountPrettyRing, mountSparklies, nextKlimtBrickPoint, sparklyBeamPoint };
