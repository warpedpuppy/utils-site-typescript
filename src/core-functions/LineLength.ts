import { Line } from '../types/shapes';

export function LineLength(line: Line) {
  const { startPoint, endPoint } = line;
  let a = startPoint.x - endPoint.x;
  let b = startPoint.y - endPoint.y;
  return Math.sqrt(a * a + b * b);
}
