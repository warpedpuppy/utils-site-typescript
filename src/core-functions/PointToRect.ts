export function pointToRect(px: any, py: any, rx: any, ry: any, rw: any, rh: any) {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}
