import { Ball, Container } from './types';

export function ballBounce(ball: Ball, stage: Container) {
  const gravity = 0.4;
  const restitution = 0.72;
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
