import { LineLength } from "./LineLength";
import { GetRotation } from "./GetRotation";

export function CreateRect(
  width: any,
  height: any,
  angle: any = 0,
  options: any = {
    rotate: false,
    rotateSpeed: 1000,
    clockwise: true,
  }
) {
  let vertices: any[] = [];

  let x = width / 2;
  let y = height / 2;
  let center: any = { x: 0, y: 0 };

  let dist = LineLength({
    startPoint: center,
    endPoint: { x, y },
  });

  let atan2 = GetRotation(center, {
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
