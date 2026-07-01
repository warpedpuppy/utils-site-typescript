import { Point } from './types';
import { lineLength } from "./LineLength";
import { getRotation } from "./GetRotation";

/**
 * Compute the four corner vertices of a rectangle, centered on the origin.
 *
 * @param width - Rectangle width.
 * @param height - Rectangle height.
 * @param angle - Rotation in radians about the center. Defaults to `0`.
 * @param options - Optional spin animation: `{ rotate, rotateSpeed, clockwise, time }`. When
 *   `rotate` is true the angle advances with `options.time` (ms, e.g. `performance.now()`),
 *   keeping the function pure — pass the time in rather than reading the clock here.
 * @returns `{ vertices }` — the four corners as points.
 * @example
 * createRect(10, 10).vertices.length; // => 4
 */
export function createRect(
  width: number,
  height: number,
  angle: number = 0,
  options: {
    rotate?: boolean;
    rotateSpeed?: number;
    clockwise?: boolean;
    time?: number;
  } = {
    rotate: false,
    rotateSpeed: 1000,
    clockwise: true,
  }
): { vertices: Point[] } {
  let vertices: Point[] = [];

  let x = width / 2;
  let y = height / 2;
  let center: Point = { x: 0, y: 0 };

  let dist = lineLength({
    startPoint: center,
    endPoint: { x, y },
  });

  let atan2 = getRotation(center, {
    x,
    y,
  });

  const rotate = options.rotate ?? false;
  const rotateSpeed = options.rotateSpeed ?? 1000;
  const clockwise = options.clockwise ?? true;
  const time = options.time ?? 0;

  let rotateQ = rotate
    ? time / rotateSpeed
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
