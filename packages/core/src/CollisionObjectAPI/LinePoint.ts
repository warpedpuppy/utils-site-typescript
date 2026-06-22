import { lineLength } from "../LineLength";
import { Line, Point } from '../types';

export function linePoint(line: Line, point: Point) {
  // get distance from the point to the two ends of the line
  let tempLine: Line = { startPoint: line.startPoint, endPoint: point };
  let d1 = lineLength(tempLine);

  tempLine = { startPoint: line.endPoint, endPoint: point };
  let d2 = lineLength(tempLine);

  // get the length of the line
  let lineLen = lineLength(line);

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
