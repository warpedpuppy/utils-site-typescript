export function CircleCircle(circle1: any, circle2: any) {
  let distX = circle1.x - circle2.x;
  let distY = circle1.y - circle2.y;
  let distance = Math.sqrt(distX * distX + distY * distY);
  return distance <= circle1.radius + circle2.radius;
}
