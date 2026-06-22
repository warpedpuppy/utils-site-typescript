import { Point } from './types';

export function findPointAroundCircle(
  circleCenter: Point,
  radius: number,
  percentageAroundCircle: number
) {
  let totalCircleRadians = Math.PI * 2;
  let percent = percentageAroundCircle / 100;
  const x = circleCenter.x + radius * Math.cos(totalCircleRadians * percent);
  const y = circleCenter.y + radius * Math.sin(totalCircleRadians * percent);
  return { x, y };
}
