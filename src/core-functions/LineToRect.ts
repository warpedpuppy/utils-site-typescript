export function lineToRect(x1: any, y1: any, x2: any, y2: any, rx: any, ry: any, rw: any, rh: any) {
  let lines = [
    [rx, ry, rx + rw, ry],
    [rx + rw, ry, rx + rw, ry + rh],
    [rx + rw, ry + rh, rx, ry + rh],
    [rx, ry + rh, rx, ry]
  ];
  for (let [x3, y3, x4, y4] of lines) {
    let denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) > 0.0001) {
      let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
      let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
      if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return true;
    }
  }
  return false;
}
