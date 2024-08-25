import { Point, Polygon } from "../../../types/types";
export function centerOnStage(item: any, parent: any) {
  let x = (parent.width - item.width) / 2;
  let y = (parent.height - item.height) / 2;
  return { x, y };
}

export function rgbToHex(r: number, g: number, b: number) {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

export function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

export function hexToRgb(hex: any) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function deg2rad(degree: number) {
  return degree * (Math.PI / 180);
}
export function rad2deg(radians: number) {
  return (radians * 180) / Math.PI;
}

export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function sineCurve(
  startingValue: number,
  differential: number,
  speed: number
) {
  const currentDate = new Date();
  return startingValue + Math.sin(currentDate.getTime() * speed) * differential;
}

export function getAtan2(originPoint: Point, destinationPoint: Point) {
  return Math.atan2(
    destinationPoint.y - originPoint.y,
    destinationPoint.x - originPoint.x
  );
}

export function distanceBetweenTwoPoints(startPoint: Point, endPoint: Point) {
  let a = startPoint.x - endPoint.x;
  let b = startPoint.y - endPoint.y;
  return Math.sqrt(a * a + b * b);
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

export {};
