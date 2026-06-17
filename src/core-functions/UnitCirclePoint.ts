export function unitCirclePoint(cx: any, cy: any, radius: any, time: any) {
  let cos = Math.cos(time), sin = Math.sin(time);
  return { x: cx + radius * cos, y: cy + radius * sin, cos, sin };
}
