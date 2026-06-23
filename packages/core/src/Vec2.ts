import { Vector } from './types';

// 2D vector operations. All functions are pure and return a brand-new vector
// (the inputs are never mutated), so they compose freely. Names are `vec`-prefixed
// to stay unambiguous in the flat `@utilspalooza/core` namespace.

/**
 * Add two vectors component-wise.
 *
 * @param a - First vector.
 * @param b - Second vector.
 * @returns A new vector `{ x: a.x + b.x, y: a.y + b.y }`.
 * @example
 * vecAdd({ x: 1, y: 2 }, { x: 3, y: 4 }); // => { x: 4, y: 6 }
 */
export function vecAdd(a: Vector, b: Vector): Vector {
  return { x: a.x + b.x, y: a.y + b.y };
}

/**
 * Subtract vector `b` from `a` — the displacement pointing from `b` to `a`.
 *
 * @param a - The vector to subtract from.
 * @param b - The vector being subtracted.
 * @returns A new vector `{ x: a.x - b.x, y: a.y - b.y }`.
 * @example
 * vecSubtract({ x: 5, y: 5 }, { x: 1, y: 2 }); // => { x: 4, y: 3 }
 */
export function vecSubtract(a: Vector, b: Vector): Vector {
  return { x: a.x - b.x, y: a.y - b.y };
}

/**
 * Scale a vector by a scalar (stretch or shrink it, keeping direction unless negative).
 *
 * @param v - The vector to scale.
 * @param s - The scalar multiplier.
 * @returns A new vector `{ x: v.x * s, y: v.y * s }`.
 * @example
 * vecScale({ x: 3, y: 4 }, 2); // => { x: 6, y: 8 }
 */
export function vecScale(v: Vector, s: number): Vector {
  return { x: v.x * s, y: v.y * s };
}

/**
 * Dot product of two vectors.
 *
 * A measure of how much the vectors point the same way: positive when roughly
 * aligned, zero when perpendicular, negative when opposed. The basis for projection.
 *
 * @param a - First vector.
 * @param b - Second vector.
 * @returns The scalar `a.x * b.x + a.y * b.y`.
 * @example
 * vecDot({ x: 1, y: 0 }, { x: 0, y: 1 }); // => 0 (perpendicular)
 */
export function vecDot(a: Vector, b: Vector): number {
  return a.x * b.x + a.y * b.y;
}

/**
 * 2D cross product — the z-component of the 3D cross, a single scalar.
 *
 * Its sign tells you the turn direction from `a` to `b` (positive = counter-clockwise),
 * and its magnitude is the area of the parallelogram they span.
 *
 * @param a - First vector.
 * @param b - Second vector.
 * @returns The scalar `a.x * b.y - a.y * b.x`.
 * @example
 * vecCross({ x: 1, y: 0 }, { x: 0, y: 1 }); // => 1
 */
export function vecCross(a: Vector, b: Vector): number {
  return a.x * b.y - a.y * b.x;
}

/**
 * Length (magnitude) of a vector.
 *
 * @param v - The vector.
 * @returns Its length, `√(x² + y²)`.
 * @example
 * vecMagnitude({ x: 3, y: 4 }); // => 5
 */
export function vecMagnitude(v: Vector): number {
  return Math.hypot(v.x, v.y);
}

/**
 * Squared length of a vector — cheaper than {@link vecMagnitude} (skips the square root).
 *
 * Use this when you only need to *compare* lengths (e.g. "which is closer?"), since
 * comparing squared lengths gives the same answer without the costly `sqrt`.
 *
 * @param v - The vector.
 * @returns `x² + y²`.
 * @example
 * vecMagnitudeSquared({ x: 3, y: 4 }); // => 25
 */
export function vecMagnitudeSquared(v: Vector): number {
  return v.x * v.x + v.y * v.y;
}

/**
 * Normalize a vector to length 1, preserving its direction (a "unit vector").
 *
 * @param v - The vector to normalize.
 * @returns A new unit vector, or `{ x: 0, y: 0 }` if `v` has zero length.
 * @example
 * vecNormalize({ x: 0, y: 5 }); // => { x: 0, y: 1 }
 */
export function vecNormalize(v: Vector): Vector {
  const m = Math.hypot(v.x, v.y);
  return m === 0 ? { x: 0, y: 0 } : { x: v.x / m, y: v.y / m };
}

/**
 * The angle of a vector in radians, measured counter-clockwise from the positive x-axis.
 *
 * @param v - The vector.
 * @returns The angle in radians, in the range `-π`…`π` (via `Math.atan2`).
 * @example
 * vecAngle({ x: 0, y: 1 }); // => Math.PI / 2
 */
export function vecAngle(v: Vector): number {
  return Math.atan2(v.y, v.x);
}

/**
 * The (unsigned) angle between two vectors.
 *
 * @param a - First vector.
 * @param b - Second vector.
 * @returns The angle in radians, in the range `0`…`π`. Returns `0` if either vector is zero-length.
 * @example
 * vecAngleBetween({ x: 1, y: 0 }, { x: 0, y: 1 }); // => Math.PI / 2
 */
export function vecAngleBetween(a: Vector, b: Vector): number {
  const mags = Math.hypot(a.x, a.y) * Math.hypot(b.x, b.y);
  if (mags === 0) return 0;
  // clamp guards against tiny floating-point overshoot beyond [-1, 1]
  const cos = Math.max(-1, Math.min(1, (a.x * b.x + a.y * b.y) / mags));
  return Math.acos(cos);
}

/**
 * Rotate a vector by an angle (counter-clockwise in standard math coordinates).
 *
 * @param v - The vector to rotate.
 * @param radians - The rotation angle in radians.
 * @returns A new, rotated vector of the same length.
 * @example
 * vecRotate({ x: 1, y: 0 }, Math.PI / 2); // => { x: ~0, y: 1 }
 */
export function vecRotate(v: Vector, radians: number): Vector {
  const c = Math.cos(radians);
  const s = Math.sin(radians);
  return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
}

/**
 * A vector perpendicular to the given one (rotated 90° counter-clockwise).
 *
 * Handy for finding a surface normal from an edge.
 *
 * @param v - The vector.
 * @returns A new vector `{ x: -v.y, y: v.x }`.
 * @example
 * vecPerpendicular({ x: 1, y: 0 }); // => { x: 0, y: 1 }
 */
export function vecPerpendicular(v: Vector): Vector {
  return { x: -v.y, y: v.x };
}

/**
 * Reflect a vector off a surface, like a ball bouncing off a wall.
 *
 * @param v - The incoming vector (e.g. a velocity).
 * @param normal - The surface normal. Should be a unit vector; normalize it first if unsure.
 * @returns The reflected vector, `v - 2 (v · normal) normal`.
 * @example
 * vecReflect({ x: 1, y: -1 }, { x: 0, y: 1 }); // => { x: 1, y: 1 } (bounce off the floor)
 */
export function vecReflect(v: Vector, normal: Vector): Vector {
  const d = 2 * (v.x * normal.x + v.y * normal.y);
  return { x: v.x - d * normal.x, y: v.y - d * normal.y };
}

/**
 * Linearly interpolate between two vectors (lerp in 2D).
 *
 * @param a - Start vector, returned when `t` is 0.
 * @param b - End vector, returned when `t` is 1.
 * @param t - Interpolation factor; `0.5` is the midpoint.
 * @returns A new vector partway between `a` and `b`.
 * @example
 * vecLerp({ x: 0, y: 0 }, { x: 10, y: 20 }, 0.5); // => { x: 5, y: 10 }
 */
export function vecLerp(a: Vector, b: Vector, t: number): Vector {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/**
 * Clamp a vector's magnitude to at most `max`, preserving its direction.
 *
 * Common for capping a velocity to a maximum speed.
 *
 * @param v - The vector to limit.
 * @param max - The maximum allowed length.
 * @returns A new vector no longer than `max` (a copy of `v` if it was already shorter).
 * @example
 * vecLimit({ x: 30, y: 40 }, 10); // => { x: 6, y: 8 } (was length 50, now length 10)
 */
export function vecLimit(v: Vector, max: number): Vector {
  const m = Math.hypot(v.x, v.y);
  if (m > max && m > 0) {
    return { x: (v.x / m) * max, y: (v.y / m) * max };
  }
  return { x: v.x, y: v.y };
}
