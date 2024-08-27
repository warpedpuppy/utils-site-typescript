import { Polygon, Circle } from "../../../../../types/shapes";
import { CollisionDetectionObject } from "../../../../../types/types";
import { LineCircle } from "./LineCircle";
import { PolygonPoint } from "./PolygonPoint";

export const PolygonCircle: CollisionDetectionObject = {
  keyFunction: function PolygonCircle(polygon: Polygon, circle: Circle) {
    // go through each of the vertices, plus
    // the next vertex in the list
    let next = 0;
    const { vertices } = polygon;
    for (let current = 0; current < vertices.length; current++) {
      // get next vertex in list
      // if we've hit the end, wrap around to 0
      next = current + 1;
      if (next === vertices.length) next = 0;

      // get the PVectors at our current position
      // this makes our if statement a little cleaner
      let startPoint = vertices[current]; // c for "current"
      let endPoint = vertices[next]; // n for "next"

      // check for collision between the circle and
      // a line formed between the two vertices
      let line = { startPoint, endPoint };
      let collision = LineCircle.keyFunction(line, circle);
      if (collision) return true;
    }

    // the above algorithm only checks if the circle
    // is touching the edges of the polygon – in most
    // cases this is enough, but you can un-comment the
    // following code to also test if the center of the
    // circle is inside the polygon

    let centerInside = PolygonPoint.keyFunction(polygon, {
      x: circle.x,
      y: circle.y,
    });
    if (centerInside) return true;

    // otherwise, after all that, return false
    return false;
  },
  dependencies: [LineCircle.functionString, PolygonPoint.functionString],
  functionString: `
export function PolygonCircle(polygon: Polygon, circle: Circle) {
  let next = 0;
  const { vertices } = polygon;
  for (let current = 0; current < vertices.length; current++) {
   
    next = current + 1;
    if (next === vertices.length) next = 0;

    let startPoint = vertices[current]; 
    let endPoint = vertices[next]; 

    let line = { startPoint, endPoint };
    let collision = LineCircle(line, circle);
    if (collision) return true;
  }

  let centerInside = PolygonPoint(polygon, { x: circle.x, y: circle.y });
  if (centerInside) return true;

  return false;
}
`,
};
