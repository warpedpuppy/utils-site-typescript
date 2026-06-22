export function unitCirclePoint(cx: number, cy: number, radius: number, time: number): { x: number; y: number; cos: number; sin: number } {
  let cos = Math.cos(time), sin = Math.sin(time);
  return { x: cx + radius * cos, y: cy + radius * sin, cos, sin };
}
