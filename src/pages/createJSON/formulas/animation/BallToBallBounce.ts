import { Ball } from "../../../../types/shapes";
import { CollisionDetectionObject } from "../../../../types/types";

export const BallToBallBounce: CollisionDetectionObject = {
  keyFunction: function BallToBallBounce(
    ball1: Ball,
    ball2: Ball,
    spring: number = 0.05
  ) {
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
  },
  dependencies: [],
  functionString: `
  function BallToBallBounce(
    ball1: Ball,
    ball2: Ball,
    spring: number = 0.05
  ) {
    if (ball1 === ball2) return;
    let dx = ball2.x - ball1.x;
    let dy = ball2.y - ball1.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let minDist = ball2.radius + ball1.radius;
    if (distance < minDist) {
      let angle = Math.atan2(dy, dx);

      // targetX and targetY preserve the point at which the circle should have stopped before overlapping.  
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
  `,
};
