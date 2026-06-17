import { Point, Polygon } from "../../../../types/shapes";
import { CollisionDetectionObject } from "../../../../types/types";
import { PolygonPoint as PolygonPointImported } from "../../../../core-functions/CollisionObjectAPI/PolygonPoint";

export const PolygonPoint: CollisionDetectionObject = {
  keyFunction: PolygonPointImported,
  dependencies: [],
  functionString: `
function PolygonPoint(polygon: Polygon, point: Point) {
  let collision = false;
  let next = 0;
  const { vertices } = polygon;
  for (let current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next === vertices.length) next = 0;

    let vc = vertices[current]; 
    let vn = vertices[next];
    if (
      ((vc.y > point.y && vn.y < point.y) ||
        (vc.y < point.y && vn.y > point.y)) &&
      point.x < ((vn.x - vc.x) * (point.y - vc.y)) / (vn.y - vc.y) + vc.x
    ) {
      collision = !collision;
    }
  }
  return collision;
}`,
};
