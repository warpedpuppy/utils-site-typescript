export function MoveAlongLine(
  origin: any,
  destination: any,
  ratio: any
) {
  let x = origin.x + ratio * (destination.x - origin.x);
  let y = origin.y + ratio * (destination.y - origin.y);
  return { x, y };
}
