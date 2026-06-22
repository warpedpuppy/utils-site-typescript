export function randomIntegerBetween(min: number, max: number): number {
  max++;
  return Math.floor(Math.random() * (max - min) + min);
}
