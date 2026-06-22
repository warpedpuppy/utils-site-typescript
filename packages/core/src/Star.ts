export function starVertices(
  spikes: number,
  innerRadius: number,
  outerRadius: number,
  angle: number = 0,
  options: {
    rotate?: boolean;
    rotateSpeed?: number;
    clockwise?: boolean;
  } = { rotate: false, rotateSpeed: 1000, clockwise: true }
) {
  let vertices: { x: number; y: number }[] = [];
  let rot = 0;
  let step = Math.PI / spikes;
  const currentDate = new Date();
  const rotate = options.rotate ?? false;
  const rotateSpeed = options.rotateSpeed ?? 1000;
  const clockwise = options.clockwise ?? true;

  let rotateQ = rotate
    ? currentDate.getTime() / rotateSpeed
    : 0;
  if (!clockwise) rotateQ *= -1;
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
