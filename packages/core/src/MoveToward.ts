import { Point } from './types';
export function moveToward(obj: Point, dest: Point, speed: number): number {
  let dx = dest.x - obj.x, dy = dest.y - obj.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > speed) { obj.x += (dx / dist) * speed; obj.y += (dy / dist) * speed; }
  else { obj.x = dest.x; obj.y = dest.y; }
  return Math.atan2(dy, dx);
}
