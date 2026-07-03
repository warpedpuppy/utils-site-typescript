// @utilspalooza/effects — drop-in canvas effects.
//
// This barrel is re-exports only. Each effect lives in its own file and shares
// the canvas/rAF/pointer machinery in ./mountHarness. The public surface is
// exactly the names re-exported below; harness internals (createLoop, makeGlow,
// RGBTuple, Runtime, …) stay private on purpose.

export type { EffectHandle, BaseEffectOptions } from './mountHarness';

export { tween } from './Tween';
export type { TweenHandle, TweenOptions } from './Tween';

export { mountGlitter } from './Glitter';
export type { GlitterOptions } from './Glitter';

export { mountPrettyRing, cosWave } from './PrettyRing';
export type { PrettyRingOptions } from './PrettyRing';

export { mountSparklies, sparklyBeamPoint } from './Sparklies';
export type { SparkliesOptions } from './Sparklies';

export { mountKlimt, nextKlimtBrickPoint } from './Klimt';
export type { KlimtOptions } from './Klimt';
