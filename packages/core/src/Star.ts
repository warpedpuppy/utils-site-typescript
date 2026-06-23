import { Point } from './types';
/**
 * Compute the vertices of a star polygon, alternating between an outer and inner radius.
 *
 * @param spikes - Number of points on the star.
 * @param innerRadius - Radius of the inner (valley) vertices.
 * @param outerRadius - Radius of the outer (tip) vertices.
 * @param angle - Starting rotation in radians. Defaults to `0`.
 * @param options - Optional spin animation: `{ rotate, rotateSpeed, clockwise, time }`. When
 *   `rotate` is true the angle advances with `options.time` (ms, e.g. `performance.now()`),
 *   keeping the function pure — pass the time in rather than reading the clock here.
 * @returns `{ vertices }` — `spikes * 2` points, alternating outer then inner.
 * @example
 * starVertices(5, 5, 10).vertices.length; // => 10
 */
export function starVertices(
  spikes: number,
  innerRadius: number,
  outerRadius: number,
  angle: number = 0,
  options: {
    rotate?: boolean;
    rotateSpeed?: number;
    clockwise?: boolean;
    time?: number;
  } = { rotate: false, rotateSpeed: 1000, clockwise: true }
) {
  let vertices: Point[] = [];
  let rot = 0;
  let step = Math.PI / spikes;
  const rotate = options.rotate ?? false;
  const rotateSpeed = options.rotateSpeed ?? 1000;
  const clockwise = options.clockwise ?? true;
  const time = options.time ?? 0;

  let rotateQ = rotate
    ? time / rotateSpeed
    : 0;
  if (!clockwise) rotateQ *= -1;
  for (let i = 0; i < spikes; i++) {
    let x = Math.cos(angle + rot + rotateQ) * outerRadius;
    let y = Math.sin(angle + rot + rotateQ) * outerRadius;
    vertices.push({ x, y });
    rot += step;
    x = Math.cos(angle + rot + rotateQ) * innerRadius;
    y = Math.sin(angle + rot + rotateQ) * innerRadius;
    vertices.push({ x, y });
    rot += step;
  }
  return { vertices };
}
