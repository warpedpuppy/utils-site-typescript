import { Point } from './types';
/**
 * Step a moving object toward a destination at a fixed speed, snapping on arrival.
 *
 * **Mutates `obj`** — its `x`/`y` are advanced by up to `speed` units toward `dest`.
 * If it's within one step, it lands exactly on `dest`.
 *
 * @param obj - The point to move (mutated in place).
 * @param dest - The target point.
 * @param speed - Maximum distance to travel this call.
 * @returns The heading angle (radians) from `obj` toward `dest`, for orienting the sprite.
 * @example
 * const ball = { x: 0, y: 0 };
 * moveToward(ball, { x: 10, y: 0 }, 2); // ball is now { x: 2, y: 0 }; returns 0
 */
export function moveToward(obj: Point, dest: Point, speed: number): number {
  let dx = dest.x - obj.x, dy = dest.y - obj.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > speed) { obj.x += (dx / dist) * speed; obj.y += (dy / dist) * speed; }
  else { obj.x = dest.x; obj.y = dest.y; }
  return Math.atan2(dy, dx);
}
