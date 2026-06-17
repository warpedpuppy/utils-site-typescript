export function DrawStar(
  spikes: any,
  innerRadius: any,
  outerRadius: any,
  angle: any = 0,
  options: any = { rotate: false, rotateSpeed: 1000, clockwise: true }
) {
  let vertices = [];
  let rot = 0;
  let step = Math.PI / spikes;
  const currentDate = new Date();
  let rotateQ = options.rotate
    ? currentDate.getTime() / options.rotateSpeed
    : 0;
  if (options.clockwise === false) rotateQ *= -1;
  for (let i = 0; i < spikes; i++) {
    let x = Math.cos(angle + rot + rotateQ) * outerRadius;
    let y = Math.sin(angle + rot + rotateQ) * outerRadius;
    vertices.push({ x, y });
    rot += step;
    x = Math.cos(angle + rot + rotateQ) * innerRadius;
    y = Math.sin(angle + rot + rotateQ) * innerRadius;
    vertices.push({ x, y });
    rot += step;
  }
  return { vertices };
}
