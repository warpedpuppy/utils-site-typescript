import { Ball, Container } from "../../../types/shapes";
import { CollisionDetectionObject } from "../../../types/types";

export const BallBounce: CollisionDetectionObject = {
  keyFunction: function BallBounce(ball: Ball, stage: Container) {
    const gravity     = 0.4;
    const restitution = 0.72;   // fraction of speed kept after each wall/floor hit
    const friction    = 0.985;  // horizontal damping applied on every floor bounce

    ball.vy += gravity;
    ball.x  += ball.vx;
    ball.y  += ball.vy;

    // Floor
    if (ball.y >= stage.height - ball.radius) {
      ball.y  = stage.height - ball.radius;
      ball.vy = -Math.abs(ball.vy) * restitution;
      ball.vx *= friction;
    }

    // Ceiling
    if (ball.y <= ball.radius) {
      ball.y  = ball.radius;
      ball.vy = Math.abs(ball.vy);
    }

    // Right wall
    if (ball.x >= stage.width - ball.radius) {
      ball.x  = stage.width - ball.radius;
      ball.vx = -Math.abs(ball.vx) * restitution;
    }

    // Left wall
    if (ball.x <= ball.radius) {
      ball.x  = ball.radius;
      ball.vx = Math.abs(ball.vx) * restitution;
    }
  },
  dependencies: [],
  interfaces: ["Ball", "Container"],
  functionString: `
  function BallBounce(ball: Ball, stage: Container) {
    const gravity     = 0.4;
    const restitution = 0.72;
    const friction    = 0.985;

    ball.vy += gravity;
    ball.x  += ball.vx;
    ball.y  += ball.vy;

    // Floor
    if (ball.y >= stage.height - ball.radius) {
      ball.y  = stage.height - ball.radius;
      ball.vy = -Math.abs(ball.vy) * restitution;
      ball.vx *= friction;
    }
    // Ceiling
    if (ball.y <= ball.radius) {
      ball.y  = ball.radius;
      ball.vy = Math.abs(ball.vy);
    }
    // Right wall
    if (ball.x >= stage.width - ball.radius) {
      ball.x  = stage.width - ball.radius;
      ball.vx = -Math.abs(ball.vx) * restitution;
    }
    // Left wall
    if (ball.x <= ball.radius) {
      ball.x  = ball.radius;
      ball.vx = Math.abs(ball.vx) * restitution;
    }
  }
  `,
};
