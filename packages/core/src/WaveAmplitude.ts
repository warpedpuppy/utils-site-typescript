import { Point } from './types';
/**
 * Compute the combined wave height at a point from multiple ripple sources (interference).
 *
 * Sums a traveling cosine wave radiating from each source and averages them, so
 * overlapping waves reinforce (bright) or cancel (dark) — the two-slit interference
 * pattern. `k` is the spatial frequency (2π/wavelength), `omega` the temporal frequency.
 *
 * @param x - Sample point x.
 * @param y - Sample point y.
 * @param sources - The wave-emitting source points.
 * @param time - Current time, advanced each frame to animate the waves.
 * @param k - Wave number (spatial frequency).
 * @param omega - Angular frequency (temporal).
 * @returns The averaged wave amplitude at the point, roughly `-1`…`1`.
 * @example
 * const a = waveAmplitude(x, y, [s1, s2], time, 0.05, 0.1);
 */
export function waveAmplitude(x: number, y: number, sources: Point[], time: number, k: number, omega: number): number {
  let amp = 0;
  for (let s of sources) {
    let dx = x - s.x, dy = y - s.y;
    amp += Math.cos(k * Math.sqrt(dx*dx + dy*dy) - omega * time);
  }
  return amp / sources.length;
}
