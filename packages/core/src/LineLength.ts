import { Line } from './types';

export function lineLength(line: Line) {
  const { startPoint, endPoint } = line;
  let a = startPoint.x - endPoint.x;
  let b = startPoint.y - endPoint.y;
  return Math.sqrt(a * a + b * b);
}
