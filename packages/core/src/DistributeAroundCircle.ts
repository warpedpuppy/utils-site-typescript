import { Point } from './types';

export function distributeAroundCircle(
  circleCenter: Point,
  radius: number,
  totalItems: number
): Point[] {
  const totalCircleRadians = Math.PI * 2;
  const returnArray: Point[] = [];
  for (let i = 0; i < totalItems; i++) {
    const percent = i / totalItems;
    returnArray.push({
      x: circleCenter.x + radius * Math.cos(totalCircleRadians * percent),
      y: circleCenter.y + radius * Math.sin(totalCircleRadians * percent),
    });
  }
  return returnArray;
}
