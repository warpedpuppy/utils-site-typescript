export function linear(t: number) {
  return t;
}

export function easeIn(t: number) {
  return t * t;
}

export function easeOut(t: number) {
  return t * (2 - t);
}

export function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
