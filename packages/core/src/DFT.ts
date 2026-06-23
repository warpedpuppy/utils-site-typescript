import { Point } from './types';
/**
 * Discrete Fourier Transform of a list of 2D points (treated as complex numbers).
 *
 * Decomposes a path into a sum of rotating circles (epicycles) — the math behind
 * "draw anything with spinning vectors" animations. Each output entry is one
 * circle: its frequency, radius (`amp`), and starting angle (`phase`). Results are
 * sorted by amplitude so the most significant circles come first.
 *
 * @param pts - The input path as an array of points (`x` = real, `y` = imaginary).
 * @returns One `{ freq, amp, phase }` per input sample, sorted by descending `amp`.
 * @example
 * const circles = dft(pathPoints); // feed into an epicycle drawer
 */
export function dft(pts: Point[]): { freq: number; amp: number; phase: number }[] {
  const N = pts.length;
  const X: { freq: number; amp: number; phase: number }[] = [];
  for (let k = 0; k < N; k++) {
    let re = 0, im = 0;
    for (let n = 0; n < N; n++) {
      const phi = (2*Math.PI*k*n)/N;
      re += pts[n].x*Math.cos(phi) + pts[n].y*Math.sin(phi);
      im += -pts[n].x*Math.sin(phi) + pts[n].y*Math.cos(phi);
    }
    re /= N; im /= N;
    X.push({freq: k, amp: Math.sqrt(re*re+im*im), phase: Math.atan2(im,re)});
  }
  return X.sort((a, b) => b.amp - a.amp);
}
