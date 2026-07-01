import type { Circle, Container, Point } from './types';

export interface LeftTopRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface RectLike {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LegacyBall {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  rotate: number;
  rotation: number;
}

/**
 * Legacy utility: distance and angle between two points.
 *
 * @param point1 - Start point.
 * @param point2 - End point.
 * @returns Tuple of `[distance, angleRadians]`.
 */
export function distanceAndAngle(point1: Point, point2: Point): [number, number] {
  const xs = point2.x - point1.x;
  const ys = point2.y - point1.y;
  return [Math.sqrt(xs * xs + ys * ys), Math.atan2(ys, xs)];
}

/**
 * Legacy utility: rectangle intersection for left/top/right/bottom boxes.
 *
 * @param a - First rectangle.
 * @param b - Second rectangle.
 * @returns Whether the rectangles overlap.
 */
export function intersectRect(a: LeftTopRect, b: LeftTopRect): boolean {
  return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom;
}

/**
 * Create a random CSS hex color.
 *
 * @returns A string like `#3fa1cc`.
 */
export function randomHex(): string {
  return '#000000'.replace(/0/g, () => Math.floor(Math.random() * 16).toString(16));
}

/**
 * Pick a random item from an array.
 *
 * @param arr - Source array.
 * @returns One item from `arr`.
 */
export function randomItemFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Create a random Pixi-style color string.
 *
 * @returns A string like `0xff00aa`.
 */
export function randomColor(): string {
  const x = Math.round(0xffffff * Math.random()).toString(16);
  const padding = '000000'.substring(0, 6 - x.length);
  return `0x${padding}${x}`;
}

/**
 * Legacy cosine oscillator, made explicit-clock for core purity.
 *
 * @param startPoint - Center value.
 * @param differential - Maximum distance from center.
 * @param speed - Oscillation speed multiplier.
 * @param clock - Caller-owned time value, usually frame-counted milliseconds.
 * @returns Oscillating value.
 */
export function legacyCosWave(
  startPoint: number,
  differential: number,
  speed: number,
  clock: number
): number {
  return startPoint + Math.cos(clock * speed) * differential;
}

/**
 * Return a shuffled copy of an array.
 *
 * @param array - Source array.
 * @returns A new array containing the same items in random order.
 */
export function shuffle<T>(array: T[]): T[] {
  const out = array.slice();
  let currentIndex = out.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    const temporaryValue = out[currentIndex];
    out[currentIndex] = out[randomIndex];
    out[randomIndex] = temporaryValue;
  }
  return out;
}

/**
 * Legacy point-to-rectangle collision using Pixi-style `{x,y,width,height}`.
 *
 * @param point - Point to test.
 * @param rectangle - Rectangle to test against.
 * @returns Whether the point is inside the rectangle.
 */
export function pixiPointRectangleCollisionDetection(point: Point, rectangle: RectLike): boolean {
  const rightSide = rectangle.x + rectangle.width;
  const bottom = rectangle.y + rectangle.height;
  return point.x > rectangle.x && point.x < rightSide && point.y > rectangle.y && point.y < bottom;
}

/**
 * Legacy triangle-circle edge collision test.
 *
 * @param circle - Circle to test.
 * @param point1 - First triangle vertex.
 * @param point2 - Second triangle vertex.
 * @param point3 - Third triangle vertex.
 * @returns Whether the circle intersects any triangle edge.
 */
export function triangleCircleCollision(
  circle: Circle,
  point1: Point,
  point2: Point,
  point3: Point
): boolean {
  return (
    lineSegmentCircleCollision(point1, point2, circle) ||
    lineSegmentCircleCollision(point2, point3, circle) ||
    lineSegmentCircleCollision(point3, point1, circle)
  );
}

function lineSegmentCircleCollision(a: Point, b: Point, circle: Circle): boolean {
  const eX = b.x - a.x;
  const eY = b.y - a.y;
  const cX = circle.x - a.x;
  const cY = circle.y - a.y;
  const len = Math.sqrt(eX * eX + eY * eY);
  if (len === 0) return Math.sqrt(cX * cX + cY * cY) <= circle.radius;
  const projection = (cX * eX + cY * eY) / len;
  if (projection < 0 || projection > len) return false;
  const distance = Math.sqrt(cX * cX + cY * cY - projection * projection);
  return distance <= circle.radius;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Convert a CSS hex color to RGB components.
 *
 * @param hex - Hex color, with or without `#`.
 * @returns RGB object, or `null` for invalid input.
 */
export function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert one RGB component to a two-character hex string.
 *
 * @param c - Component in the 0-255 range.
 * @returns Two-character hex string.
 */
export function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

/**
 * Convert RGB components to a CSS hex color.
 *
 * @param r - Red component.
 * @param g - Green component.
 * @param b - Blue component.
 * @returns CSS hex string.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

/**
 * Legacy circle-rectangle collision with the older quarter-width registration math.
 *
 * @param circle - Circle to test.
 * @param rect - Rectangle to test.
 * @returns Whether the shapes collide.
 */
export function circleRectangleCollisionRegPointCenter(circle: Circle, rect: RectLike): boolean {
  const distX = Math.abs(circle.x - rect.x - rect.width * 0.25);
  const distY = Math.abs(circle.y - rect.y - rect.height * 0.25);
  if (distX > rect.width * 0.25 + circle.radius) return false;
  if (distY > rect.height * 0.25 + circle.radius) return false;
  if (distX <= rect.width * 0.25) return true;
  return distY <= rect.height;
}

/**
 * Legacy circle-rectangle collision.
 *
 * @param circle - Circle to test.
 * @param rect - Rectangle to test.
 * @returns Whether the shapes collide.
 */
export function circleRectangleCollision(circle: Circle, rect: RectLike): boolean {
  const distX = Math.abs(circle.x - rect.x - rect.width / 2);
  const distY = Math.abs(circle.y - rect.y - rect.height / 2);
  if (distX > rect.width / 2 + circle.radius) return false;
  if (distY > rect.height / 2 + circle.radius) return false;
  if (distX <= rect.width / 2) return true;
  return distY <= rect.height;
}

/**
 * Legacy rectangle-rectangle collision.
 *
 * @param rect1 - First rectangle.
 * @param rect2 - Second rectangle.
 * @returns Whether the rectangles overlap.
 */
export function rectangleRectangleCollisionDetection(rect1: RectLike, rect2: RectLike): boolean {
  return (
    rect1.x <= rect2.x + rect2.width &&
    rect2.x <= rect1.x + rect1.width &&
    rect1.y <= rect2.y + rect2.height &&
    rect2.y <= rect1.y + rect1.height
  );
}

/**
 * Legacy point-rectangle collision.
 *
 * @param point - Point to test.
 * @param rect - Rectangle to test.
 * @returns Whether the point is inside the rectangle.
 */
export function pointRectangleCollisionDetection(point: Point, rect: RectLike): boolean {
  return point.x > rect.x && point.x < rect.x + rect.width && point.y > rect.y && point.y < rect.y + rect.height;
}

/**
 * Parse a URL query string into a plain object.
 *
 * @param search - Query string with or without a leading `?`.
 * @returns Key/value map.
 */
export function createParamObject(search: string): Record<string, string> {
  const string = search.startsWith('?') ? search.substring(1) : search;
  const returnObj: Record<string, string> = {};
  if (!string) return returnObj;
  const arr = string.split('&');
  for (const item of arr) {
    const miniArr = item.split('=');
    returnObj[miniArr[0]] = miniArr[1];
  }
  return returnObj;
}

/**
 * Legacy circle-circle collision returning hit state and penetration depth.
 *
 * @param ballA - First circle.
 * @param ballB - Second circle.
 * @returns Tuple of `[isColliding, overlapDepth]`.
 */
export function circleToCircleCollisionDetection(
  ballA: Circle,
  ballB: Circle
): [boolean, number] {
  const rSum = ballA.radius + ballB.radius;
  const dx = ballB.x - ballA.x;
  const dy = ballB.y - ballA.y;
  return [rSum * rSum > dx * dx + dy * dy, rSum - Math.sqrt(dx * dx + dy * dy)];
}

/**
 * Legacy short-name circle-circle collision.
 *
 * @param ballA - First circle.
 * @param ballB - Second circle.
 * @returns Whether the circles collide.
 */
export function ccc(ballA: Circle, ballB: Circle): boolean {
  const rSum = ballA.radius + ballB.radius;
  const dx = ballB.x - ballA.x;
  const dy = ballB.y - ballA.y;
  return rSum * rSum > dx * dx + dy * dy;
}

/**
 * Move a legacy ball while wrapping around container edges.
 *
 * @param ball - Ball-like object, mutated in place.
 * @param activeAction - External velocity offset from the original app state.
 * @param stage - Bounds to wrap around.
 * @returns Nothing.
 */
export function updateLeaveScreen(
  ball: LegacyBall,
  activeAction: { vx: number; vy: number },
  stage: Container
): void {
  ball.x -= activeAction.vx;
  ball.y -= activeAction.vy;
  ball.rotation += (ball.rotate * Math.PI) / 180;

  if (ball.x > stage.width + ball.r) ball.x = -ball.r;
  else if (ball.x < -ball.r) ball.x = stage.width + ball.r;

  if (ball.y > stage.height + ball.r) ball.y = -ball.r;
  else if (ball.y < -ball.r) ball.y = stage.height + ball.r;
}

/**
 * Move a legacy ball and bounce it inside a container.
 *
 * @param ball - Ball-like object, mutated in place.
 * @param stage - Bounds to bounce inside.
 * @returns Nothing.
 */
export function update(ball: LegacyBall, stage: Container): void {
  ball.x += ball.vx;
  ball.y += ball.vy;
  ball.rotation += (ball.rotate * Math.PI) / 180;

  if (ball.x > stage.width - ball.r) {
    ball.x = stage.width - ball.r;
    ball.vx *= -1;
  } else if (ball.x < ball.r) {
    ball.x = ball.r;
    ball.vx *= -1;
  }
  if (ball.y > stage.height - ball.r) {
    ball.y = stage.height - ball.r;
    ball.vy *= -1;
  } else if (ball.y < ball.r) {
    ball.y = ball.r + 1;
    ball.vy *= -1;
  }
}

/**
 * Legacy positional correction for overlapping balls.
 *
 * @param ballA - First ball, mutated in place.
 * @param ballB - Second ball, mutated in place.
 * @param depth - Overlap depth.
 * @returns Nothing.
 */
export function adjustPositions(ballA: LegacyBall, ballB: LegacyBall, depth: number): void {
  const percent = 0.2;
  const slop = 0.01;
  let correction: number | [number, number] =
    (Math.max(depth - slop, 0) / (1 / ballA.r + 1 / ballB.r)) * percent;
  let norm: [number, number] = [ballB.x - ballA.x, ballB.y - ballA.y];
  const mag = Math.sqrt(norm[0] * norm[0] + norm[1] * norm[1]);
  norm = [norm[0] / mag, norm[1] / mag];
  correction = [correction * norm[0], correction * norm[1]];
  if (!isNaN(correction[0]) && !isNaN(correction[1])) {
    ballA.x -= (1 / ballA.r) * correction[0];
    ballA.y -= (1 / ballA.r) * correction[1];
    ballB.x += (1 / ballB.r) * correction[0];
    ballB.y += (1 / ballB.r) * correction[1];
  }
}

/**
 * Legacy impulse collision response for two balls.
 *
 * @param ballA - First ball, mutated in place.
 * @param ballB - Second ball, mutated in place.
 * @returns New velocities, or `undefined` if the balls are separating.
 */
export function resolveCollision(
  ballA: LegacyBall,
  ballB: LegacyBall
): { aX: number; aY: number; bX: number; bY: number } | undefined {
  const relVel: [number, number] = [ballB.vx - ballA.vx, ballB.vy - ballA.vy];
  let norm: [number, number] = [ballB.x - ballA.x, ballB.y - ballA.y];
  const mag = Math.sqrt(norm[0] * norm[0] + norm[1] * norm[1]);
  norm = [norm[0] / mag, norm[1] / mag];

  const velAlongNorm = relVel[0] * norm[0] + relVel[1] * norm[1];
  if (velAlongNorm > 0) return undefined;

  const bounce = 0.7;
  let j = -(1 + bounce) * velAlongNorm;
  j /= 1 / ballA.r + 1 / ballB.r;

  const impulse: [number, number] = [j * norm[0], j * norm[1]];
  ballA.vx -= (1 / ballA.r) * impulse[0];
  ballA.vy -= (1 / ballA.r) * impulse[1];
  ballB.vx += (1 / ballB.r) * impulse[0];
  ballB.vy += (1 / ballB.r) * impulse[1];
  return { aX: ballA.vx, aY: ballA.vy, bX: ballB.vx, bY: ballB.vy };
}

/**
 * Legacy line-segment to circle collision.
 *
 * @param a - Segment start.
 * @param b - Segment end.
 * @param c - Circle center.
 * @param r - Circle radius.
 * @returns Whether the line segment intersects the circle.
 */
export function lineIntersectCircle(a: Point, b: Point, c: Point, r: number): boolean {
  const aa = (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
  const bb = 2 * ((b.x - a.x) * (a.x - c.x) + (b.y - a.y) * (a.y - c.y));
  const cc =
    c.x * c.x +
    c.y * c.y +
    a.x * a.x +
    a.y * a.y -
    2 * (c.x * a.x + c.y * a.y) -
    r * r;
  const deter = bb * bb - 4 * aa * cc;
  if (deter <= 0) return false;
  const e = Math.sqrt(deter);
  const u1 = (-bb + e) / (2 * aa);
  const u2 = (-bb - e) / (2 * aa);
  return !((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1));
}

/**
 * Compute the top-left position needed to center a child rectangle in a stage.
 *
 * @param childWidth - Child width.
 * @param childHeight - Child height.
 * @param canvasWidth - Stage width.
 * @param canvasHeight - Stage height.
 * @returns Centered top-left point.
 */
export function centerOnStage(
  childWidth: number,
  childHeight: number,
  canvasWidth: number,
  canvasHeight: number
): Point {
  return {
    x: (canvasWidth - childWidth) / 2,
    y: (canvasHeight - childHeight) / 2,
  };
}
