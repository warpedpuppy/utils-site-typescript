import { Line } from "../../../../types/shapes";
import { CollisionDetectionObject } from "../../../../types/types";

export const LineLength: CollisionDetectionObject = {
  keyFunction: function LineLength(line: Line) {
    const { startPoint, endPoint } = line;
    let a = startPoint.x - endPoint.x;
    let b = startPoint.y - endPoint.y;
    return Math.sqrt(a * a + b * b);
  },
  dependencies: [],
  functionString: `
  function LineLength(line: Line) {
    const { startPoint, endPoint } = line;
    let a = startPoint.x - endPoint.x;
    let b = startPoint.y - endPoint.y;
    return Math.sqrt(a * a + b * b);
  }
  `,
};
