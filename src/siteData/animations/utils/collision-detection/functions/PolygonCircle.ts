import { Polygon, Circle } from "../../../../../types/types";
import { LineCircle } from "./LineCircle";

export function PolygonCircle(polygon: Polygon, circle: Circle) {
  // go through each of the vertices, plus
  // the next vertex in the list
  let next = 0;
  const { vertices } = polygon;
  for (let current = 0; current < vertices.length; current++) {
    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current + 1;
    if (next == vertices.length) next = 0;

    // get the PVectors at our current position
    // this makes our if statement a little cleaner
    let vc = vertices[current]; // c for "current"
    let vn = vertices[next]; // n for "next"

    // check for collision between the circle and
    // a line formed between the two vertices
    let line = { startPoint: vc, endPoint: vn };
    let collision = LineCircle(line, circle);
    if (collision) return true;
  }

  // the above algorithm only checks if the circle
  // is touching the edges of the polygon – in most
  // cases this is enough, but you can un-comment the
  // following code to also test if the center of the
  // circle is inside the polygon

  // boolean centerInside = polygonPoint(vertices, cx,cy);
  // if (centerInside) return true;

  // otherwise, after all that, return false
  return false;
}
