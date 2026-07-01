/**
 * Bounce a value back and forth between 0 and `length` as `t` increases.
 *
 * Produces a triangle wave: `0 → length → 0 → length …`. Perfect for seamless
 * looping motion (a sprite sliding to the edge and back without a visible jump).
 *
 * @param t - The input value, usually an ever-increasing time or counter.
 * @param length - The peak of the bounce; output ranges over `[0, length]`.
 * @returns The ping-ponged value in `[0, length]`. Returns `0` if `length <= 0`.
 * @example
 * pingPong(15, 10); // => 5  (past the peak, heading back down)
 * pingPong(20, 10); // => 0  (full cycle, back to start)
 */
export function pingPong(t: number, length: number): number {
  if (length <= 0) return 0;
  const span = length * 2;
  const x = ((t % span) + span) % span;
  return length - Math.abs(x - length);
}
