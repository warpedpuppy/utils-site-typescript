import { Ball } from './types';

/**
 * Push two overlapping balls apart with a spring-like force (soft collision response).
 *
 * When the balls overlap, applies an equal-and-opposite force proportional to the
 * overlap, easing them apart rather than resolving the collision instantly.
 * **Mutates both balls'** velocities in place.
 *
 * @param ball1 - First ball (its `vx`/`vy` are mutated).
 * @param ball2 - Second ball (its `vx`/`vy` are mutated).
 * @param spring - Stiffness of the separating force, 0–1. Defaults to `0.05`.
 * @returns Nothing — both balls' velocities are updated in place.
 * @example
 * ballToBallBounce(a, b); // call for each pair, once per frame
 */
export function ballToBallBounce(ball1: Ball, ball2: Ball, spring: number = 0.05) {
  if (ball1 === ball2) return;
  let dx = ball2.x - ball1.x;
  let dy = ball2.y - ball1.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  let minDist = ball2.radius + ball1.radius;
  if (distance < minDist) {
    let angle = Math.atan2(dy, dx);
    let targetX = ball1.x + Math.cos(angle) * minDist;
    let targetY = ball1.y + Math.sin(angle) * minDist;
    let xOverlap = targetX - ball2.x;
    let yOverlap = targetY - ball2.y;
    let ax = xOverlap * spring;
    let ay = yOverlap * spring;
    ball1.vx -= ax;
    ball1.vy -= ay;
    ball2.vx += ax;
    ball2.vy += ay;
  }
}
