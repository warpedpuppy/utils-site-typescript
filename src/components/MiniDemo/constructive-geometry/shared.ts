// Shared toolkit for the constructive-geometry scene families: constants,
// pure geometry helpers, canvas drawing primitives, and format/util helpers.
// Moved verbatim out of ConstructiveGeometryDemo.tsx (behavior-identical) so
// every per-family scene file and the harness can import them.
import type React from "react";
import type { Circle, Point, Vector } from "@utilspalooza/core";
import { distance } from "@utilspalooza/core/Distance";
import { lineLine } from "@utilspalooza/core/CollisionObjectAPI/LineLine";
import type { RailControls } from "./types";

export const PAD = 18;
export const RECT_HALF_W = 72;
export const RECT_HALF_H = 48;
export const RECT_POLY_HALF_W = 56;
export const RECT_POLY_HALF_H = 40;
export const LINE_POINT_THRESHOLD = 12;


export function regularPolygon(
  cx: number,
  cy: number,
  radius: number,
  sides: number,
  rotation = 0,
): Point[] {
  const verts: Point[] = [];
  for (let i = 0; i < sides; i++) {
    const a = rotation + (i / sides) * Math.PI * 2;
    verts.push({ x: Math.round(cx + Math.cos(a) * radius), y: Math.round(cy + Math.sin(a) * radius) });
  }
  return verts;
}

export function polygonEdges(verts: Point[]): { startPoint: Point; endPoint: Point }[] {
  return verts.map((v, i) => ({ startPoint: v, endPoint: verts[(i + 1) % verts.length] }));
}

export function polyCentroid(verts: Point[]): Point {
  let x = 0;
  let y = 0;
  for (const v of verts) {
    x += v.x;
    y += v.y;
  }
  return { x: x / verts.length, y: y / verts.length };
}

export function translatePolygonTo(
  verts: Point[],
  targetCentroid: Point,
  width: number,
  height: number,
): Point[] {
  const c = polyCentroid(verts);
  let dx = targetCentroid.x - c.x;
  let dy = targetCentroid.y - c.y;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const v of verts) {
    minX = Math.min(minX, v.x);
    minY = Math.min(minY, v.y);
    maxX = Math.max(maxX, v.x);
    maxY = Math.max(maxY, v.y);
  }
  if (minX + dx < PAD) dx = PAD - minX;
  if (maxX + dx > width - PAD) dx = width - PAD - maxX;
  if (minY + dy < PAD) dy = PAD - minY;
  if (maxY + dy > height - PAD) dy = height - PAD - maxY;

  return verts.map((v) => ({ x: Math.round(v.x + dx), y: Math.round(v.y + dy) }));
}

export function rayCrossings(verts: Point[], p: Point): Point[] {
  const crossings: Point[] = [];
  for (let i = 0; i < verts.length; i++) {
    const vc = verts[i];
    const vn = verts[(i + 1) % verts.length];
    if (vc.y > p.y !== vn.y > p.y) {
      const cx = ((vn.x - vc.x) * (p.y - vc.y)) / (vn.y - vc.y) + vc.x;
      if (cx > p.x) crossings.push({ x: cx, y: p.y });
    }
  }
  return crossings.sort((a, b) => a.x - b.x);
}

export function polygonCrossings(poly1: Point[], poly2: Point[]): Point[] {
  const out: Point[] = [];
  for (const e1 of polygonEdges(poly1)) {
    for (const e2 of polygonEdges(poly2)) {
      const result = lineLine(e1, e2);
      if (result.hit && result.intersectionX !== undefined && result.intersectionY !== undefined) {
        out.push({ x: result.intersectionX, y: result.intersectionY });
      }
    }
  }
  return out;
}

export function nearestEdge(verts: Point[], p: Point): { point: Point; dist: number } {
  let best: Point = verts[0];
  let bestDist = Infinity;
  for (const edge of polygonEdges(verts)) {
    const closest = closestPointOnSegment(p, edge.startPoint, edge.endPoint);
    const d = distance(p, closest);
    if (d < bestDist) {
      bestDist = d;
      best = closest;
    }
  }
  return { point: best, dist: bestDist };
}

export function closestPointOnSegment(p: Point, a: Point, b: Point): Point {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq));
  return { x: a.x + t * dx, y: a.y + t * dy };
}

export function drawPolygonShape(
  ctx: CanvasRenderingContext2D,
  verts: Point[],
  color: string,
  fill?: string,
) {
  ctx.beginPath();
  verts.forEach((v, i) => (i === 0 ? ctx.moveTo(v.x, v.y) : ctx.lineTo(v.x, v.y)));
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  verts.forEach((v) => drawCenter(ctx, v, color, 3.5));
}

// ─── Rect drawing helper ─────────────────────────────────────────────────────

export function drawAabbRect(
  ctx: CanvasRenderingContext2D,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
  color: string,
) {
  ctx.fillStyle = `${color}1f`;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.fillRect(rx, ry, rw, rh);
  ctx.strokeRect(rx, ry, rw, rh);
}

export function drawBackdrop(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let x = 24; x < width; x += 24) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 24; y < height; y += 24) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

export function drawAxes(ctx: CanvasRenderingContext2D, width: number, height: number, origin: Point) {
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(PAD, origin.y);
  ctx.lineTo(width - PAD, origin.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(origin.x, PAD);
  ctx.lineTo(origin.x, height - PAD);
  ctx.stroke();
}

export function drawRightTriangle(
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  corner: Point,
  hit: boolean,
) {
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(96, 165, 250, 0.9)";
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(corner.x, corner.y);
  ctx.stroke();

  ctx.strokeStyle = "rgba(125, 211, 252, 0.9)";
  ctx.beginPath();
  ctx.moveTo(corner.x, corner.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.lineWidth = 3;
  ctx.strokeStyle = hit ? "rgba(249, 115, 22, 0.95)" : "rgba(255, 255, 255, 0.92)";
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

export function drawHeaderBox(
  ctx: CanvasRenderingContext2D,
  lines: Array<{ text: string; color: string }>,
) {
  const width = Math.max(...lines.map((line) => ctx.measureText(line.text).width)) + 24;
  const height = 16 + lines.length * 18;
  ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
  ctx.fillRect(18, 14, width, height);
  ctx.font = "600 12px 'Space Mono', monospace";
  lines.forEach((line, index) => {
    ctx.fillStyle = line.color;
    ctx.fillText(line.text, 30, 33 + index * 18);
  });
}

export function drawStatusPill(ctx: CanvasRenderingContext2D, x: number, y: number, text: string) {
  ctx.fillStyle = "rgba(249, 115, 22, 0.18)";
  ctx.fillRect(x, y, 136, 34);
  ctx.font = "700 14px 'Space Mono', monospace";
  ctx.fillStyle = "#fdba74";
  ctx.fillText(text, x + 24, y + 22);
}

export function drawCircle(ctx: CanvasRenderingContext2D, circle: Circle, color: string, radiusLabel: string) {
  ctx.fillStyle = `${color}1f`;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.font = "600 12px 'Space Mono', monospace";
  ctx.fillStyle = color;
  ctx.fillText(`${radiusLabel} = ${fmt(circle.radius)}`, circle.x - circle.radius + 8, circle.y - circle.radius - 10);
}

export function drawPoint(ctx: CanvasRenderingContext2D, point: Point, color: string, label: string) {
  drawCenter(ctx, point, color, 7);
  labelSegment(ctx, point.x + 18, point.y - 10, label, color);
}

export function drawOrigin(ctx: CanvasRenderingContext2D, origin: Point) {
  drawCenter(ctx, origin, "#f8fafc", 5);
  labelSegment(ctx, origin.x + 20, origin.y - 10, "origin", "#f8fafc");
}

export function drawVector(
  ctx: CanvasRenderingContext2D,
  origin: Point,
  handle: Point,
  color: string,
  label: string,
  // `interactive` (default true) draws the filled tip dot that signals a
  // draggable handle. Pass false for computed-result vectors (a+b, scaled, the
  // lerp output, …) so they don't masquerade as something you can grab.
  interactive: boolean = true,
) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(handle.x, handle.y);
  ctx.stroke();

  const dx = handle.x - origin.x;
  const dy = handle.y - origin.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const arrowSize = 10;
  ctx.beginPath();
  ctx.moveTo(handle.x, handle.y);
  ctx.lineTo(handle.x - ux * arrowSize - uy * 5, handle.y - uy * arrowSize + ux * 5);
  ctx.lineTo(handle.x - ux * arrowSize + uy * 5, handle.y - uy * arrowSize - ux * 5);
  ctx.closePath();
  ctx.fill();

  if (interactive) drawCenter(ctx, handle, color, 7);
  labelSegment(ctx, handle.x + 16, handle.y - 10, label, color);
}

export function drawComponentGuides(ctx: CanvasRenderingContext2D, origin: Point, handle: Point) {
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(96, 165, 250, 0.9)";
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(handle.x, origin.y);
  ctx.stroke();

  ctx.strokeStyle = "rgba(125, 211, 252, 0.9)";
  ctx.beginPath();
  ctx.moveTo(handle.x, origin.y);
  ctx.lineTo(handle.x, handle.y);
  ctx.stroke();
  ctx.setLineDash([]);
}

export function drawUnitCircle(ctx: CanvasRenderingContext2D, origin: Point, radius: number) {
  ctx.strokeStyle = "rgba(249, 115, 22, 0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(origin.x, origin.y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

export function drawAngleArc(
  ctx: CanvasRenderingContext2D,
  origin: Point,
  handle: Point,
  radius: number,
  color: string,
) {
  const endAngle = Math.atan2(handle.y - origin.y, handle.x - origin.x);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(origin.x, origin.y, radius, 0, endAngle, endAngle < 0);
  ctx.stroke();
}

export function drawAngleArcBetween(
  ctx: CanvasRenderingContext2D,
  origin: Point,
  a: Point,
  b: Point,
  radius: number,
  color: string,
) {
  const start = Math.atan2(a.y - origin.y, a.x - origin.x);
  let end = Math.atan2(b.y - origin.y, b.x - origin.x);
  while (end - start > Math.PI) end -= Math.PI * 2;
  while (end - start < -Math.PI) end += Math.PI * 2;

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(origin.x, origin.y, radius, start, end, end < start);
  ctx.stroke();
}

export function drawParallelogram(ctx: CanvasRenderingContext2D, origin: Point, a: Point, b: Point) {
  const far = { x: a.x + (b.x - origin.x), y: a.y + (b.y - origin.y) };
  ctx.fillStyle = "rgba(249, 115, 22, 0.12)";
  ctx.strokeStyle = "rgba(249, 115, 22, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(a.x, a.y);
  ctx.lineTo(far.x, far.y);
  ctx.lineTo(b.x, b.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

export function drawRail(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  key: keyof RailControls,
  value: number,
  min: number,
  max: number,
) {
  const y = height - 26;
  const x0 = width - 164;
  const x1 = width - 28;
  const frac = (value - min) / (max - min);
  const x = x0 + frac * (x1 - x0);
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.lineTo(x1, y);
  ctx.stroke();
  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "600 12px 'Space Mono', monospace";
  ctx.fillStyle = "#fdba74";
  ctx.fillText(`${key}: ${fmt(value)}`, x0, y - 10);
}

export function drawCenter(
  ctx: CanvasRenderingContext2D,
  point: { x: number; y: number },
  color: string,
  radius: number = 5,
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fill();
}

export function labelSegment(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  color: string,
) {
  ctx.font = "600 12px 'Space Mono', monospace";
  const metrics = ctx.measureText(text);
  const w = metrics.width + 12;
  ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
  ctx.fillRect(x - w / 2, y - 12, w, 18);
  ctx.fillStyle = color;
  ctx.fillText(text, x - metrics.width / 2, y + 1);
}


export function getCanvasPoint(
  event: React.PointerEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement | null,
) {
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

export function clampCircle(circle: Circle, width: number, height: number): Circle {
  return {
    ...circle,
    x: clamp(circle.x, circle.radius + PAD, width - circle.radius - PAD),
    y: clamp(circle.y, circle.radius + PAD, height - circle.radius - PAD),
  };
}

export function clampPoint(point: Point, width: number, height: number): Point {
  return {
    x: clamp(point.x, PAD, width - PAD),
    y: clamp(point.y, PAD, height - PAD),
  };
}

export function vectorFromHandle(handle: Point, origin: Point): Vector {
  return {
    x: Math.round((handle.x - origin.x) * 10) / 10,
    y: Math.round((origin.y - handle.y) * 10) / 10,
  };
}

export function handleFromVector(origin: Point, vector: Vector, scale: number): Point {
  return {
    x: origin.x + vector.x * scale,
    y: origin.y - vector.y * scale,
  };
}

export function unitCircleLayout(width: number, height: number) {
  return {
    center: {
      x: Math.round(width * 0.28),
      y: Math.round(height * 0.58),
    },
    radius: Math.min(84, Math.round(width * 0.18), Math.round(height * 0.28)),
  };
}

export function snapPointToCircle(point: Point, layout: ReturnType<typeof unitCircleLayout>): Point {
  const dx = point.x - layout.center.x;
  const dy = point.y - layout.center.y;
  const length = Math.hypot(dx, dy) || 1;
  return {
    x: Math.round(layout.center.x + (dx / length) * layout.radius),
    y: Math.round(layout.center.y + (dy / length) * layout.radius),
  };
}

export function dotReading(dot: number, angle: number) {
  if (Math.abs(dot) < 0.001) return "perpendicular: no overlap";
  if (dot > 0) return `same-ish way (${fmt(radToDeg(angle))}° apart)`;
  return `opposed (${fmt(radToDeg(angle))}° apart)`;
}

export function crossReading(cross: number) {
  if (Math.abs(cross) < 0.001) return "collinear / zero area";
  return cross > 0 ? "counter-clockwise turn" : "clockwise turn";
}

export function railPosition(
  key: keyof RailControls,
  value: number,
  width: number,
  height: number,
) {
  const x0 = width - 164;
  const x1 = width - 28;
  const y = height - 26;
  const min = key === "scale" ? -2 : key === "lerp" ? 0 : key === "phase" ? -1 : 20;
  const max = key === "scale" ? 2 : key === "lerp" ? 1 : key === "phase" ? 1 : key === "waveTime" ? 60 : 140;
  const resolvedMin = key === "waveTime" ? 0 : min;
  const frac = (value - resolvedMin) / (max - resolvedMin);
  return { x: x0 + frac * (x1 - x0), y };
}

export function railValueForPosition(
  key: keyof RailControls,
  x: number,
  _origin: Point,
  width: number,
) {
  const x0 = width - 164;
  const x1 = width - 28;
  const frac = clamp((x - x0) / (x1 - x0), 0, 1);
  if (key === "scale") return -2 + frac * 4;
  if (key === "lerp") return frac;
  if (key === "phase") return -1 + frac * 2;
  if (key === "waveTime") return frac * 60;
  return 20 + frac * 120;
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function formatPoint(point: Point) {
  return `{ x: ${fmt(point.x)}, y: ${fmt(point.y)} }`;
}

export function formatCircleObject(circle: Circle) {
  return `{ x: ${fmt(circle.x)}, y: ${fmt(circle.y)}, radius: ${fmt(circle.radius)} }`;
}

export function formatVector(vector: Vector) {
  return `{ x: ${fmt(vector.x)}, y: ${fmt(vector.y)} }`;
}

export function fmt(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function fmtSigned(value: number) {
  return `${value >= 0 ? "+" : ""}${fmt(value)}`;
}

export function fmtAbs(value: number) {
  return fmt(Math.abs(value));
}

export function radToDeg(value: number) {
  return (value * 180) / Math.PI;
}

export function normalizeCycleAngle(value: number) {
  const tau = Math.PI * 2;
  return ((value % tau) + tau) % tau;
}

export function normalizeCycleFraction(value: number) {
  return ((value % 1) + 1) % 1;
}
