import { Line, Point } from "../../../../../types/types";
import { LineLength } from "../../LineLength";
export function LinePoint(line: Line, point: Point) {
  // get distance from the point to the two ends of the line
  let d1 = LineLength(point, line.startPoint);
  let d2 = LineLength(point, line.endPoint);

  // get the length of the line
  let lineLen = LineLength(line.startPoint, line.endPoint);

  // since floats are so minutely accurate, add
  // a little buffer zone that will give collision
  let buffer = 0.1; // higher # = less accurate

  // if the two distances are equal to the line's
  // length, the point is on the line!
  // note we use the buffer here to give a range,
  // rather than one #
  if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
    return true;
  }
  return false;
}
