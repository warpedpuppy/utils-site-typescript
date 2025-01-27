import { Ball, Container } from "../../../types/shapes";
import { CollisionDetectionObject } from "../../../types/types";

export const BallBounce: CollisionDetectionObject = {
  keyFunction: function BallBounce(ball: Ball, stage: Container) {
    let gravity: number = 0.5;
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vy += gravity;
    if (ball.y >= stage.height - ball.radius) {
      ball.y = stage.height - ball.radius;
      ball.vy = -ball.vy * 0.8;
    }
    if (ball.x >= stage.width) {
      ball.vy = 1;
      ball.x = 1;
      ball.y = 1;
    }
  },
  dependencies: [],
  interfaces: ["Ball", "Container"],
  // interfaces: function () {
  //   let ball: Ball = {
  //     x: 0,
  //     y: 0,
  //     radius: 10,
  //     vx: 4,
  //     vy: 1,
  //     id: "ball",
  //     color: "black",
  //   };
  //   let container: Container = {
  //     x: 0,
  //     y: 0,
  //     width: 10,
  //     height: 10,
  //   };
  //   return [ball, container];
  // },
  functionString: `
  function BallBounce(ball: Ball, stage: Container) {
    let gravity: number = 0.5;
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vy += gravity;
      if (ball.y >= stage.height - ball.radius) {
      ball.y = stage.height - ball.radius;
       ball.vy = -ball.vy * 0.8;
    }
    if (ball.x >= stage.width) {
      ball.vy = 1;
      ball.x = 1;
      ball.y = 1;
    }
  }
  `,
};
