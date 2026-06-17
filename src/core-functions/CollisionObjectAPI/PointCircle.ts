export function PointCircle(point: any, circle: any) {
  let distX = point.x - circle.x;
  let distY = point.y - circle.y;
  let distance = Math.sqrt(distX * distX + distY * distY);
  return distance <= circle.radius;
}
