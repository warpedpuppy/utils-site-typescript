import { Point, Polygon, Line, Circle } from "../../../../../types/types";
import { lineLine } from "../../LineLine";

export function polyPoint(polygon: Polygon, point: Point) {
  let collision = false;

  // go through each of the vertices, plus the next
  // vertex in the list
  let next = 0;
  const { vertices } = polygon;
  // console.log(vertices, point);
  for (let current = 0; current < vertices.length; current++) {
    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current + 1;
    if (next === vertices.length) next = 0;

    // get the PVectors at our current position
    // this makes our if statement a little cleaner
    let vc = vertices[current]; // c for "current"
    let vn = vertices[next]; // n for "next"

    // compare position, flip 'collision' variable
    // back and forth
    if (
      ((vc.y > point.y && vn.y < point.y) ||
        (vc.y < point.y && vn.y > point.y)) &&
      point.x < ((vn.x - vc.x) * (point.y - vc.y)) / (vn.y - vc.y) + vc.x
    ) {
      collision = !collision;
    }
  }

  return collision;
}
