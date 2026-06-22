import { Point } from './types';

export function circleFromThreePoints(
  point1: Point,
  point2: Point,
  point3: Point
) {
  let x12 = point1.x - point2.x;
  let x13 = point1.x - point3.x;

  let y12 = point1.y - point2.y;
  let y13 = point1.y - point3.y;

  let x31 = point3.x - point1.x;
  let x21 = point2.x - point1.x;

  let y31 = point3.y - point1.y;
  let y21 = point2.y - point1.y;

  let sx13 = Math.pow(point1.x, 2) - Math.pow(point3.x, 2);
  let sy13 = Math.pow(point1.y, 2) - Math.pow(point3.y, 2);
  let sx21 = Math.pow(point2.x, 2) - Math.pow(point1.x, 2);
  let sy21 = Math.pow(point2.y, 2) - Math.pow(point1.y, 2);

  let f =
    (sx13 * x12 + sy13 * x12 + sx21 * x13 + sy21 * x13) /
    (2 * (y31 * x12 - y21 * x13));
  let g =
    (sx13 * y12 + sy13 * y12 + sx21 * y13 + sy21 * y13) /
    (2 * (x31 * y12 - x21 * y13));

  let c =
    -Math.pow(point1.x, 2) -
    Math.pow(point1.y, 2) -
    2 * g * point1.x -
    2 * f * point1.y;

  let x = -g;
  let y = -f;
  let sqr_of_r = x * x + y * y - c;

  let radius = Math.sqrt(sqr_of_r);

  return { radius, center: { x, y } };
}
