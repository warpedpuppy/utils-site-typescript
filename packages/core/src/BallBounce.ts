import { Ball, Container } from './types';

/**
 * Advance a ball one frame under gravity, bouncing it off the container walls.
 *
 * A simple Euler-integration physics step: applies gravity to vertical velocity,
 * moves the ball, then reflects and damps its velocity (restitution + friction)
 * whenever it hits a wall. **Mutates `ball`** in place.
 *
 * @param ball - The ball to advance (its `x`, `y`, `vx`, `vy` are mutated).
 * @param stage - The bounding container (`width`/`height`) the ball bounces inside.
 * @param restitution - Bounciness: fraction of speed kept on each bounce (0–1).
 *   `1` is a perfectly elastic, never-tiring bounce; lower values lose energy faster.
 *   Defaults to `0.72`.
 * @returns Nothing — `ball` is updated in place.
 * @example
 * ballBounce(ball, { x: 0, y: 0, width: 800, height: 600 });      // default bounce
 * ballBounce(ball, stage, 0.95);                                   // extra bouncy
 */
export function ballBounce(ball: Ball, stage: Container, restitution: number = 0.72): void {
  const gravity = 0.4;
  const friction = 0.985;
  ball.vy += gravity;
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.y >= stage.height - ball.radius) {
    ball.y = stage.height - ball.radius;
    ball.vy = -Math.abs(ball.vy) * restitution;
    ball.vx *= friction;
  }
  if (ball.y <= ball.radius) {
    ball.y = ball.radius;
    ball.vy = Math.abs(ball.vy);
  }
  if (ball.x >= stage.width - ball.radius) {
    ball.x = stage.width - ball.radius;
    ball.vx = -Math.abs(ball.vx) * restitution;
  }
  if (ball.x <= ball.radius) {
    ball.x = ball.radius;
    ball.vx = Math.abs(ball.vx) * restitution;
  }
}
