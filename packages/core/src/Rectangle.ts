import { lineLength } from "./LineLength";
import { getRotation } from "./GetRotation";

export function createRect(
  width: number,
  height: number,
  angle: number = 0,
  options: {
    rotate?: boolean;
    rotateSpeed?: number;
    clockwise?: boolean;
  } = {
    rotate: false,
    rotateSpeed: 1000,
    clockwise: true,
  }
) {
  let vertices: { x: number; y: number }[] = [];

  let x = width / 2;
  let y = height / 2;
  let center: { x: number; y: number } = { x: 0, y: 0 };

  let dist = lineLength({
    startPoint: center,
    endPoint: { x, y },
  });

  let atan2 = getRotation(center, {
    x,
    y,
  });

  const currentDate = new Date();
  const rotate = options.rotate ?? false;
  const rotateSpeed = options.rotateSpeed ?? 1000;
  const clockwise = options.clockwise ?? true;

  let rotateQ = rotate
    ? currentDate.getTime() / rotateSpeed
    : 0;
  let spinDirection = clockwise
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
