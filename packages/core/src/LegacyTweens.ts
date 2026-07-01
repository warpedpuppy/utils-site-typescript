/**
 * Robert Penner-style time-based quadratic ease-in.
 *
 * @param t - Current elapsed time.
 * @param b - Beginning value.
 * @param c - Change in value.
 * @param d - Total duration.
 * @returns Interpolated value.
 */
export function easeInQuadTime(t: number, b: number, c: number, d: number): number {
  const u = t / d;
  return c * u * u + b;
}

/**
 * Time-based sine ease-in.
 *
 * @param t - Current elapsed time.
 * @param b - Beginning value.
 * @param c - Change in value.
 * @param d - Total duration.
 * @returns Interpolated value.
 */
export function easeInSineTime(t: number, b: number, c: number, d: number): number {
  return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
}

/**
 * Compute a tweened value with an explicit clock and easing function.
 *
 * @param start - Beginning value.
 * @param end - Ending value.
 * @param elapsedMs - Elapsed time in milliseconds.
 * @param durationMs - Duration in milliseconds.
 * @param easing - Normalized easing function.
 * @returns Interpolated value.
 */
export function tweenValue(
  start: number,
  end: number,
  elapsedMs: number,
  durationMs: number,
  easing: (t: number) => number = (t) => t
): number {
  if (durationMs <= 0) return end;
  const percentage = Math.min(1, Math.max(0, elapsedMs / durationMs));
  return start + easing(percentage) * (end - start);
}

export interface TweenProperty {
  from: number;
  to: number;
}

/**
 * Compute all property values for a frame of a tween.
 *
 * @param properties - Map of property names to start/end values.
 * @param elapsedMs - Elapsed time in milliseconds.
 * @param durationMs - Duration in milliseconds.
 * @param easing - Normalized easing function.
 * @returns Object with tweened values for each property.
 */
export function tweenFrame<T extends string>(
  properties: Record<T, TweenProperty>,
  elapsedMs: number,
  durationMs: number,
  easing: (t: number) => number = (t) => t
): Record<T, number> {
  const out = {} as Record<T, number>;
  for (const property in properties) {
    const range = properties[property];
    out[property] = tweenValue(range.from, range.to, elapsedMs, durationMs, easing);
  }
  return out;
}
