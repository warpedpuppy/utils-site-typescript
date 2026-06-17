import { Line, Point } from "../../../../../types/shapes";
import { CollisionDetectionObject } from "../../../../../types/types";
import { LineLength } from "../../animation/LineLength";
import { LinePoint as LinePointImported } from "../../../../../core-functions/CollisionObjectAPI/LinePoint";

export const LinePoint: CollisionDetectionObject = {
  keyFunction: LinePointImported,
  dependencies: [LineLength.functionString],
  interfaces: ["Point", "Line"],
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
