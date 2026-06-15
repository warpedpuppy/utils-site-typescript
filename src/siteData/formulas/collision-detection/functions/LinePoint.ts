import { Line, Point } from "../../../../types/shapes";
import { CollisionDetectionObject } from "../../../../types/types";
import { LineLength } from "../../animation/LineLength";

export const LinePoint: CollisionDetectionObject = {
  keyFunction: function LinePoint(line: Line, point: Point) {
    // get distance from the point to the two ends of the line
    let tempLine: Line = { startPoint: line.startPoint, endPoint: point };
    let d1 = LineLength.keyFunction(tempLine);

    tempLine = { startPoint: line.endPoint, endPoint: point };
    let d2 = LineLength.keyFunction(tempLine);

    // get the length of the line
    let lineLen = LineLength.keyFunction(line);

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
  },
  dependencies: [LineLength.functionString],
  functionString: `
function LinePoint(line: Line, point: Point) {
  
  let tempLine: Line = { startPoint: line.startPoint, endPoint: point };
  let d1 = LineLength(tempLine);

  tempLine = { startPoint: line.endPoint, endPoint: point };
  let d2 = LineLength(tempLine);

  let lineLen = LineLength(line);

  let buffer = 0.1; 

  if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
    return true;
  }
  return false;
}`,
};
