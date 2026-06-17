import { CollisionDetectionObject } from "../../../../types/types";
import { Point } from "../../../../types/shapes";

export const DistributeAroundCircle: CollisionDetectionObject = {
  keyFunction: function distribute(
    circleCenter: Point,
    radius: number,
    totalItems: number
  ) {
    let totalCircleRadians = Math.PI * 2;
    let returnArray = [];
    for (let i: number = 0; i < totalItems; i++) {
      let percent = i / totalItems;
      const x =
        circleCenter.x + radius * Math.cos(totalCircleRadians * percent);
      const y =
        circleCenter.y + radius * Math.sin(totalCircleRadians * percent);
      returnArray.push({ x, y });
    }
    return returnArray;
  },
  dependencies: [],
  interfaces: ["Point"],
  functionString: `
  function distribute(
    circleCenter: Point,
    radius: number,
    totalItems: number
  ) {
    let totalCircleRadians = Math.PI * 2;
    let returnArray = [];
    for (let i: number = 0; i < totalItems; i++) {
      let percent = i / totalItems;
      const x =
        circleCenter.x + radius * Math.cos(totalCircleRadians * percent);
      const y =
        circleCenter.y + radius * Math.sin(totalCircleRadians * percent);
      returnArray.push({ x, y });
    }
    return returnArray;
  }
  `,
};
