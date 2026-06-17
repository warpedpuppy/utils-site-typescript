export function lensDeflection(x: any, y0: any, lx: any, ly: any, mass: any) {
  let b = Math.abs(y0 - ly);
  if (b === 0 || x <= lx - 100 || x >= lx + 100) return 0;
  let r = Math.sqrt((x - lx) * (x - lx) + b * b);
  return r > 5 ? mass / (r * b) * 0.5 : 0;
}
