import { Point } from '../types/shapes';

export function distribute(
  circleCenter: Point,
  radius: number,
  totalItems: number
) {
  const totalCircleRadians = Math.PI * 2;
  const returnArray = [];
  for (let i = 0; i < totalItems; i++) {
    const percent = i / totalItems;
    returnArray.push({
      x: circleCenter.x + radius * Math.cos(totalCircleRadians * percent),
      y: circleCenter.y + radius * Math.sin(totalCircleRadians * percent),
    });
  }
  return returnArray;
}
