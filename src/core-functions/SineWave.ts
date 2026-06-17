export function sineWave(x: any, centerY: any, amplitude: any, wavelength: any, phase: any) {
  return centerY + Math.sin((x / wavelength + phase) * Math.PI * 2) * amplitude;
}
