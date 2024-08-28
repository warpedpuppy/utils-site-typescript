import { Ball } from "../../../../types/shapes";
import { CollisionDetectionObject } from "../../../../types/types";

export const BallBounce: CollisionDetectionObject = {
  keyFunction: function BallBounce(ball: Ball, stage: any) {
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
  },
  dependencies: [],
  functionString: `
  function BallBounce(ball: Circle, stage: any) {
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
  `,
};
