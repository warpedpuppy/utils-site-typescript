import { Point } from './types';
export function waveAmplitude(x: number, y: number, sources: Point[], time: number, k: number, omega: number): number {
  let amp = 0;
  for (let s of sources) {
    let dx = x - s.x, dy = y - s.y;
    amp += Math.cos(k * Math.sqrt(dx*dx + dy*dy) - omega * time);
  }
  return amp / sources.length;
}
