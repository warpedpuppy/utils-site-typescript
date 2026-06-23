/**
 * Sample the height of a sine wave at a horizontal position.
 *
 * The standard wave equation: `centerY + amplitude · sin(2π·(x/wavelength + phase))`.
 * Animate by advancing `phase` over time to make the wave travel.
 *
 * @param x - Horizontal position to sample.
 * @param centerY - The wave's rest (center) height.
 * @param amplitude - Peak height above/below center.
 * @param wavelength - Horizontal distance between successive peaks.
 * @param phase - Phase offset in wavelengths; advance over time to animate.
 * @returns The wave's y value at `x`.
 * @example
 * const y = sineWave(x, 200, 50, 120, time * 0.01);
 */
export function sineWave(x: number, centerY: number, amplitude: number, wavelength: number, phase: number): number {
  return centerY + Math.sin((x / wavelength + phase) * Math.PI * 2) * amplitude;
}
