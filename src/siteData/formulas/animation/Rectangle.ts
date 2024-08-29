import { Point } from "../../../types/shapes";
import { CollisionDetectionObject } from "../../../types/types";
import { LineLength } from "./LineLength";
import { GetRotation } from "./GetRotation";

export const RectangleObject: CollisionDetectionObject = {
  keyFunction: function CreateRect(
    width: number,
    height: number,
    angle: number = 0,
    options: {
      rotate: boolean;
      rotateSpeed: number;
      clockwise: boolean;
    } = {
      rotate: false,
      rotateSpeed: 1000,
      clockwise: true,
    }
  ) {
    let vertices: Point[] = [];

    let x = width / 2;
    let y = height / 2;
    let center: Point = { x: 0, y: 0 };

    let dist = LineLength.keyFunction({
      startPoint: center,
      endPoint: { x, y },
    });

    let atan2 = GetRotation.keyFunction(center, {
      x,
      y,
    });

    const currentDate = new Date();

    let rotateQ = options.rotate
      ? currentDate.getTime() / options.rotateSpeed
      : 0;
    let spinDirection = options.clockwise
      ? [-rotateQ, rotateQ]
      : [rotateQ, -rotateQ];

    x = -dist * Math.cos(atan2 + angle + spinDirection[0]);
    y = dist * Math.sin(atan2 + angle + spinDirection[0]);
    vertices.push({ x, y });

    x = dist * Math.cos(atan2 - angle + spinDirection[1]);
    y = dist * Math.sin(atan2 - angle + spinDirection[1]);
    vertices.push({ x, y });

    x = dist * Math.cos(atan2 + angle + spinDirection[0]);
    y = -dist * Math.sin(atan2 + angle + spinDirection[0]);
    vertices.push({ x, y });

    x = -dist * Math.cos(atan2 - angle + spinDirection[1]);
    y = -dist * Math.sin(atan2 - angle + spinDirection[1]);
    vertices.push({ x, y });

    return { vertices };
  },
  dependencies: [LineLength.functionString, GetRotation.functionString],
  functionString: `
 function CreateRect(
    width: number,
    height: number,
    angle: number = 0,
    options: {
      rotate: boolean;
      rotateSpeed: number;
      clockwise: boolean;
    } = {
      rotate: false,
      rotateSpeed: 0.01,
      clockwise: true,
    }
  ) {
    let vertices: Point[] = [];

    let x = width / 2;
    let y = height / 2;
    let center: Point = { x: 0, y: 0 };

    let dist = LineLength.keyFunction({
      startPoint: center,
      endPoint: { x, y },
    });

    let atan2 = GetRotation.keyFunction(center, {
      x,
      y,
    });

    const currentDate = new Date();

    let rotateQ = options.rotate
      ? currentDate.getTime() / options.rotateSpeed
      : 0;

    let spinDirection = options.clockwise
      ? [-rotateQ, rotateQ]
      : [rotateQ, -rotateQ];

    x = -dist * Math.cos(atan2 + angle + spinDirection[0]);
    y = dist * Math.sin(atan2 + angle + spinDirection[0]);
    vertices.push({ x, y });

    x = dist * Math.cos(atan2 - angle + spinDirection[1]);
    y = dist * Math.sin(atan2 - angle + spinDirection[1]);
    vertices.push({ x, y });

    x = dist * Math.cos(atan2 + angle + spinDirection[0]);
    y = -dist * Math.sin(atan2 + angle + spinDirection[0]);
    vertices.push({ x, y });

    x = -dist * Math.cos(atan2 - angle + spinDirection[1]);
    y = -dist * Math.sin(atan2 - angle + spinDirection[1]);
    vertices.push({ x, y });

    return { vertices };
  }
  `,
};
