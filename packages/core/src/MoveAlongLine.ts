import { Point } from './types';

export function moveAlongLine(
  origin: Point,
  destination: Point,
  ratio: number
) {
  let x = origin.x + ratio * (destination.x - origin.x);
  let y = origin.y + ratio * (destination.y - origin.y);
  return { x, y };
}
