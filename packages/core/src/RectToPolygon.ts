import { Point } from './types';

/**
 * Test whether an axis-aligned rectangle overlaps a polygon.
 *
 * Combines three checks so no overlap is missed:
 * 1. Any polygon vertex inside the rectangle.
 * 2. Any rectangle corner inside the polygon.
 * 3. Any polygon edge crossing any rectangle edge.
 *
 * The vertex-only approach used by most simple implementations fails when one
 * shape is entirely inside the other, or when edges cross without either shape's
 * vertices being contained. All three checks together are complete.
 *
 * @param rx - Rectangle left edge.
 * @param ry - Rectangle top edge.
 * @param rw - Rectangle width.
 * @param rh - Rectangle height.
 * @param vertices - The polygon vertices, in order.
 * @returns `true` if the rectangle and polygon overlap.
 * @example
 * const tri = [{ x: 5, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }];
 * rectToPolygon(3, 3, 8, 8, tri); // => true
 * rectToPolygon(50, 50, 10, 10, tri); // => false
 */
export function rectToPolygon(rx: number, ry: number, rw: number, rh: number, vertices: Point[]): boolean {
  const rx2 = rx + rw, ry2 = ry + rh;

  // 1. Any polygon vertex inside the rect?
  for (const { x, y } of vertices) {
    if (x >= rx && x <= rx2 && y >= ry && y <= ry2) return true;
  }

  // 2. Any rect corner inside the polygon?
  const corners: Point[] = [
    { x: rx, y: ry }, { x: rx2, y: ry },
    { x: rx2, y: ry2 }, { x: rx, y: ry2 },
  ];
  for (const { x, y } of corners) {
    if (pointInPolygon(x, y, vertices)) return true;
  }

  // 3. Any polygon edge crossing any rect edge?
  const rectEdges: [number, number, number, number][] = [
    [rx, ry, rx2, ry], [rx2, ry, rx2, ry2],
    [rx2, ry2, rx, ry2], [rx, ry2, rx, ry],
  ];
  const n = vertices.length;
  for (let i = 0; i < n; i++) {
    const a = vertices[i], b = vertices[(i + 1) % n];
    for (const [x3, y3, x4, y4] of rectEdges) {
      if (segmentsIntersect(a.x, a.y, b.x, b.y, x3, y3, x4, y4)) return true;
    }
  }

  return false;
}

function pointInPolygon(px: number, py: number, vertices: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i].x, yi = vertices[i].y;
    const xj = vertices[j].x, yj = vertices[j].y;
    if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function segmentsIntersect(
  x1: number, y1: number, x2: number, y2: number,
  x3: number, y3: number, x4: number, y4: number,
): boolean {
  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denom) < 0.0001) return false;
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}
