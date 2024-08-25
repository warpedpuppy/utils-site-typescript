import { Point, Polygon, Line } from "../../../types/types";
import { lineLine } from "./LineUtils";
export function polyPoly(polygon1: Polygon, polygon2: Polygon) {
  // go through each of the vertices, plus the next
  // vertex in the list

  let next = 0;

  for (let current = 0; current < polygon1.vertices.length; current++) {
    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current + 1;
    if (next === polygon1.vertices.length) next = 0;

    // get the PVectors at our current position
    // this makes our if statement a little cleaner
    let vc = polygon1.vertices[current]; // c for "current"
    let vn = polygon1.vertices[next]; // n for "next"

    // now we can use these two points (a line) to compare
    // to the other polygon's vertices using polyLine()
    let line: Line = { startPoint: vc, endPoint: vn };
    let collision = polyLine(polygon2, line);
    if (collision) return true;

    // optional: check if the 2nd polygon is INSIDE the first
    collision = polyPoint(polygon1, polygon2.vertices[0]);
    if (collision) return true;
  }

  return false;
}
export function polyLine(polygon: Polygon, line: Line) {
  // go through each of the vertices, plus the next
  // vertex in the list
  let next = 0;
  const { vertices } = polygon;
  for (let current = 0; current < vertices.length; current++) {
    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current + 1;
    if (next === vertices.length) next = 0;

    // get the PVectors at our current position
    // extract X/Y coordinates from each
    let x3 = vertices[current].x;
    let y3 = vertices[current].y;
    let x4 = vertices[next].x;
    let y4 = vertices[next].y;

    let tempLine: Line = {
      startPoint: { x: x3, y: y3 },
      endPoint: { x: x4, y: y4 },
    };
    let hit = lineLine(line, tempLine).hit;
    if (hit) {
      return true;
    }
  }

  // never got a hit
  return false;
}

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
