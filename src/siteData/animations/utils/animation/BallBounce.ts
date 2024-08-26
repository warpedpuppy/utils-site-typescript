import { Circle } from "../../../../types/types";

export function BallBounce(ball: Circle, stage: any) {
  let gravity: number = 0.5;
  ball.x += ball.vx;
  ball.y += ball.vy;
  ball.vy += gravity;
  if (ball.y >= stage.canvasHeight - ball.radius) {
    ball.vy *= -1;
  }
  if (ball.x >= stage.canvasWidth) {
    ball.vy = 1;
    ball.x = 1;
    ball.y = 1;
  }
}
