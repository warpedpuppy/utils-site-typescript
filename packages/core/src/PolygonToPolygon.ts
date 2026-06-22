function pointInPolygon(x: number, y: number, poly: { x: number; y: number }[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    let xi = poly[i].x, yi = poly[i].y;
    let xj = poly[j].x, yj = poly[j].y;
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

export function polygonToPolygon(poly1: { x: number; y: number }[], poly2: { x: number; y: number }[]): boolean {
  for (let p of poly1) if (pointInPolygon(p.x, p.y, poly2)) return true;
  for (let p of poly2) if (pointInPolygon(p.x, p.y, poly1)) return true;
  return false;
}
