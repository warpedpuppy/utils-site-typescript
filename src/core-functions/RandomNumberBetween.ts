export function RandomNumberBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
