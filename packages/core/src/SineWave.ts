export function sineWave(x: number, centerY: number, amplitude: number, wavelength: number, phase: number): number {
  return centerY + Math.sin((x / wavelength + phase) * Math.PI * 2) * amplitude;
}
