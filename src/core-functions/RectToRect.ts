export function rectToRect(x1: any, y1: any, w1: any, h1: any, x2: any, y2: any, w2: any, h2: any) {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}
