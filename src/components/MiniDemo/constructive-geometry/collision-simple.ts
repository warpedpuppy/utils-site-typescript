// Simple-collision family (kinds: point-to-circle, point-to-rect, line-to-point,
// circle-to-rect, rect-to-rect, line-to-circle, line-to-line, line-to-rect).
// Moved verbatim from ConstructiveGeometryDemo.tsx (behavior-identical).
import { circleToRect } from "@utilspalooza/core/CircleToRect";
import { distance } from "@utilspalooza/core/Distance";
import { lineToCircle } from "@utilspalooza/core/LineToCircle";
import { lineToLine } from "@utilspalooza/core/LineToLine";
import { lineToPoint } from "@utilspalooza/core/LineToPoint";
import { lineToRect } from "@utilspalooza/core/LineToRect";
import { pointToCircle } from "@utilspalooza/core/PointToCircle";
import { pointToRect } from "@utilspalooza/core/PointToRect";
import { rectToRect } from "@utilspalooza/core/RectToRect";
import type { CirclePair, HandlePair, PointPair, SceneData } from "./types";
import {
  RECT_HALF_W,
  RECT_HALF_H,
  LINE_POINT_THRESHOLD,
  drawBackdrop,
  drawCircle,
  drawCenter,
  drawPoint,
  drawAabbRect,
  drawHeaderBox,
  drawStatusPill,
  labelSegment,
  formatPoint,
  fmt,
} from "./shared";

export function buildPointToCircleScene(points: PointPair, circles: CirclePair): SceneData {
  const p = points.point1;
  const c = circles.circle1;
  const d = distance(p, c);
  const hit = pointToCircle(p.x, p.y, c.x, c.y, c.radius);
  return {
    call: `pointToCircle(${fmt(p.x)}, ${fmt(p.y)}, ${fmt(c.x)}, ${fmt(c.y)}, ${fmt(c.radius)}) = ${hit}`,
    hint: "Drag the point or the circle. The line from the circle center to the point IS the distance — when it gets shorter than the radius, the point is inside.",
    readouts: [
      { label: "distance to center", value: `√(dx²+dy²) = ${fmt(d)}` },
      { label: "compare", value: `${fmt(d)} ${d <= c.radius ? "≤" : ">"} ${fmt(c.radius)} (radius)` },
      { label: "state", value: hit ? "inside!" : "outside", tone: hit ? "live" : undefined },
    ],
  };
}

export function drawPointToCircleScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  circles: CirclePair,
  points: PointPair,
) {
  const p = points.point1;
  const c = circles.circle1;
  const d = distance(p, c);
  const hit = pointToCircle(p.x, p.y, c.x, c.y, c.radius);
  const color = hit ? "#f97316" : "#818cf8";

  drawBackdrop(ctx, width, height);
  drawCircle(ctx, c, color, "r");

  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = hit ? "rgba(249, 115, 22, 0.9)" : "rgba(255, 255, 255, 0.65)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(c.x, c.y);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCenter(ctx, c, color, 5);
  drawPoint(ctx, p, "#fb7185", "p");
  labelSegment(ctx, (c.x + p.x) / 2, (c.y + p.y) / 2 - 14, `d = ${fmt(d)}`, hit ? "#fdba74" : "rgba(255,255,255,0.9)");

  drawHeaderBox(ctx, [
    { text: `distance = ${fmt(d)}`, color: "#e2e8f0" },
    { text: `radius = ${fmt(c.radius)}`, color: hit ? "#fb923c" : "#cbd5e1" },
  ]);
  if (hit) drawStatusPill(ctx, width - 156, 18, "inside!");
}

// ─── COLLISION: pointToRect ──────────────────────────────────────────────────

export function buildPointToRectScene(points: PointPair): SceneData {
  const p = points.point1;
  const rc = points.point2;
  const rx = rc.x - RECT_HALF_W, ry = rc.y - RECT_HALF_H;
  const rw = RECT_HALF_W * 2, rh = RECT_HALF_H * 2;
  const hit = pointToRect(p.x, p.y, rx, ry, rw, rh);
  const xPass = p.x >= rx && p.x <= rx + rw;
  const yPass = p.y >= ry && p.y <= ry + rh;
  return {
    call: `pointToRect(${fmt(p.x)}, ${fmt(p.y)}, ${fmt(rx)}, ${fmt(ry)}, ${fmt(rw)}, ${fmt(rh)}) = ${hit}`,
    hint: "Drag the point or the rectangle. Four axis-aligned comparisons — if x is between the left and right edges AND y is between top and bottom, the point is inside.",
    readouts: [
      { label: "x test", value: `${fmt(rx)} ≤ ${fmt(p.x)} ≤ ${fmt(rx + rw)}: ${xPass}`, tone: xPass ? "live" : undefined },
      { label: "y test", value: `${fmt(ry)} ≤ ${fmt(p.y)} ≤ ${fmt(ry + rh)}: ${yPass}`, tone: yPass ? "live" : undefined },
      { label: "state", value: hit ? "inside!" : "outside", tone: hit ? "live" : undefined },
    ],
  };
}

export function drawPointToRectScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  points: PointPair,
) {
  const p = points.point1;
  const rc = points.point2;
  const rx = rc.x - RECT_HALF_W, ry = rc.y - RECT_HALF_H;
  const rw = RECT_HALF_W * 2, rh = RECT_HALF_H * 2;
  const hit = pointToRect(p.x, p.y, rx, ry, rw, rh);

  drawBackdrop(ctx, width, height);
  drawAabbRect(ctx, rx, ry, rw, rh, hit ? "#f97316" : "#818cf8");

  ctx.setLineDash([5, 5]);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(96, 165, 250, 0.7)";
  ctx.beginPath();
  ctx.moveTo(p.x, ry);
  ctx.lineTo(p.x, ry + rh);
  ctx.stroke();
  ctx.strokeStyle = "rgba(125, 211, 252, 0.7)";
  ctx.beginPath();
  ctx.moveTo(rx, p.y);
  ctx.lineTo(rx + rw, p.y);
  ctx.stroke();
  ctx.setLineDash([]);

  drawPoint(ctx, p, "#fb7185", "p");

  drawHeaderBox(ctx, [
    { text: `x: ${fmt(rx)} ≤ ${fmt(p.x)} ≤ ${fmt(rx + rw)}`, color: "rgba(96, 165, 250, 0.95)" },
    { text: `y: ${fmt(ry)} ≤ ${fmt(p.y)} ≤ ${fmt(ry + rh)}`, color: "rgba(125, 211, 252, 0.95)" },
  ]);
  if (hit) drawStatusPill(ctx, width - 156, 18, "inside!");
}

// ─── COLLISION: lineToPoint ──────────────────────────────────────────────────

export function buildLineToPointScene(handles: HandlePair, points: PointPair): SceneData {
  const { a, b } = handles;
  const p = points.point1;
  const dx = b.x - a.x, dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq));
  const closest = { x: a.x + t * dx, y: a.y + t * dy };
  const d = distance(p, closest);
  const hit = lineToPoint(a.x, a.y, b.x, b.y, p.x, p.y, LINE_POINT_THRESHOLD);
  return {
    call: `lineToPoint(${fmt(a.x)}, ${fmt(a.y)}, ${fmt(b.x)}, ${fmt(b.y)}, ${fmt(p.x)}, ${fmt(p.y)}, ${LINE_POINT_THRESHOLD}) = ${hit}`,
    hint: `Drag the segment endpoints or the point. The construction projects the point onto the segment (clamped to t ∈ [0,1]), then measures the perpendicular distance. If that distance ≤ threshold (${LINE_POINT_THRESHOLD}), it's a hit.`,
    readouts: [
      { label: "t (parameter)", value: fmt(t) },
      { label: "closest on segment", value: formatPoint(closest) },
      { label: "distance", value: fmt(d) },
      { label: "compare", value: `${fmt(d)} ${d <= LINE_POINT_THRESHOLD ? "≤" : ">"} ${LINE_POINT_THRESHOLD} (threshold)` },
      { label: "state", value: hit ? "on the line!" : "off the line", tone: hit ? "live" : undefined },
    ],
  };
}

export function drawLineToPointScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  handles: HandlePair,
  points: PointPair,
) {
  const { a, b } = handles;
  const p = points.point1;
  const dx = b.x - a.x, dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq));
  const closest = { x: a.x + t * dx, y: a.y + t * dy };
  const d = distance(p, closest);
  const hit = lineToPoint(a.x, a.y, b.x, b.y, p.x, p.y, LINE_POINT_THRESHOLD);

  drawBackdrop(ctx, width, height);

  ctx.strokeStyle = hit ? "rgba(249, 115, 22, 0.45)" : "rgba(255, 255, 255, 0.18)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(p.x, p.y, LINE_POINT_THRESHOLD, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = hit ? "#f97316" : "#818cf8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();

  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = "rgba(125, 211, 252, 0.9)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(closest.x, closest.y);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCenter(ctx, a, "#818cf8", 7);
  labelSegment(ctx, a.x - 22, a.y - 10, "a", "#818cf8");
  drawCenter(ctx, b, "#a78bfa", 7);
  labelSegment(ctx, b.x + 18, b.y - 10, "b", "#a78bfa");
  drawCenter(ctx, closest, "rgba(125, 211, 252, 0.9)", 5);
  labelSegment(ctx, closest.x + 22, closest.y + 16, `t=${fmt(t)}`, "rgba(125, 211, 252, 0.9)");
  drawPoint(ctx, p, "#fb7185", "p");
  labelSegment(ctx, (p.x + closest.x) / 2 + 20, (p.y + closest.y) / 2, `d = ${fmt(d)}`, "rgba(255,255,255,0.9)");

  drawHeaderBox(ctx, [
    { text: `closest at t = ${fmt(t)}`, color: "#e2e8f0" },
    { text: `d = ${fmt(d)}  threshold = ${LINE_POINT_THRESHOLD}`, color: hit ? "#fb923c" : "#cbd5e1" },
  ]);
  if (hit) drawStatusPill(ctx, width - 156, 18, "on the line!");
}

// ─── COLLISION: circleToRect ─────────────────────────────────────────────────

export function buildCircleToRectScene(circles: CirclePair, points: PointPair): SceneData {
  const c = circles.circle1;
  const rc = points.point1;
  const rx = rc.x - RECT_HALF_W, ry = rc.y - RECT_HALF_H;
  const rw = RECT_HALF_W * 2, rh = RECT_HALF_H * 2;
  const px = Math.max(rx, Math.min(c.x, rx + rw));
  const py = Math.max(ry, Math.min(c.y, ry + rh));
  const closest = { x: px, y: py };
  const d = distance(c, closest);
  const hit = circleToRect(c.x, c.y, c.radius, rx, ry, rw, rh);
  return {
    call: `circleToRect(${fmt(c.x)}, ${fmt(c.y)}, ${fmt(c.radius)}, ${fmt(rx)}, ${fmt(ry)}, ${fmt(rw)}, ${fmt(rh)}) = ${hit}`,
    hint: "Drag the circle or the rectangle. The key insight: clamp the circle's center to the rect to find the closest point on the rect surface, then compare that distance to the radius.",
    readouts: [
      { label: "clamped x", value: `clamp(${fmt(c.x)}, ${fmt(rx)}, ${fmt(rx + rw)}) = ${fmt(px)}` },
      { label: "clamped y", value: `clamp(${fmt(c.y)}, ${fmt(ry)}, ${fmt(ry + rh)}) = ${fmt(py)}` },
      { label: "distance to closest", value: fmt(d) },
      { label: "compare", value: `${fmt(d)} ${d <= c.radius ? "≤" : ">"} ${fmt(c.radius)} (radius)` },
      { label: "state", value: hit ? "touching!" : "not touching", tone: hit ? "live" : undefined },
    ],
  };
}

export function drawCircleToRectScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  circles: CirclePair,
  points: PointPair,
) {
  const c = circles.circle1;
  const rc = points.point1;
  const rx = rc.x - RECT_HALF_W, ry = rc.y - RECT_HALF_H;
  const rw = RECT_HALF_W * 2, rh = RECT_HALF_H * 2;
  const px = Math.max(rx, Math.min(c.x, rx + rw));
  const py = Math.max(ry, Math.min(c.y, ry + rh));
  const closest = { x: px, y: py };
  const d = distance(c, closest);
  const hit = circleToRect(c.x, c.y, c.radius, rx, ry, rw, rh);
  const color = hit ? "#f97316" : "#818cf8";

  drawBackdrop(ctx, width, height);
  drawAabbRect(ctx, rx, ry, rw, rh, hit ? "#fb7185" : "#a78bfa");
  drawCircle(ctx, c, color, "r");

  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = hit ? "rgba(249, 115, 22, 0.9)" : "rgba(255, 255, 255, 0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(c.x, c.y);
  ctx.lineTo(closest.x, closest.y);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCenter(ctx, c, color, 5);
  drawCenter(ctx, closest, "#fde68a", 6);
  labelSegment(ctx, closest.x + 24, closest.y - 12, "closest", "#fde68a");
  labelSegment(
    ctx,
    (c.x + closest.x) / 2 - 28,
    (c.y + closest.y) / 2 - 8,
    `d = ${fmt(d)}`,
    hit ? "#fdba74" : "rgba(255,255,255,0.85)",
  );

  drawHeaderBox(ctx, [
    { text: `closest = (${fmt(px)}, ${fmt(py)})`, color: "#e2e8f0" },
    { text: `d = ${fmt(d)}  radius = ${fmt(c.radius)}`, color: hit ? "#fb923c" : "#cbd5e1" },
  ]);
  if (hit) drawStatusPill(ctx, width - 156, 18, "touching!");
}

// ─── COLLISION: rectToRect ───────────────────────────────────────────────────

export function buildRectToRectScene(points: PointPair): SceneData {
  const rc1 = points.point1;
  const rc2 = points.point2;
  const x1 = rc1.x - RECT_HALF_W, y1 = rc1.y - RECT_HALF_H;
  const x2 = rc2.x - RECT_HALF_W, y2 = rc2.y - RECT_HALF_H;
  const rw = RECT_HALF_W * 2, rh = RECT_HALF_H * 2;
  const hit = rectToRect(x1, y1, rw, rh, x2, y2, rw, rh);
  const overlapX = Math.min(x1 + rw, x2 + rw) - Math.max(x1, x2);
  const overlapY = Math.min(y1 + rh, y2 + rh) - Math.max(y1, y2);
  return {
    call: `rectToRect(${fmt(x1)}, ${fmt(y1)}, ${fmt(rw)}, ${fmt(rh)}, ${fmt(x2)}, ${fmt(y2)}, ${fmt(rw)}, ${fmt(rh)}) = ${hit}`,
    hint: "Drag either rectangle. AABB collision checks two interval overlaps — one on x, one on y. Both must overlap at the same time for a hit.",
    readouts: [
      { label: "x overlap", value: `${fmt(overlapX)}px ${overlapX > 0 ? "✓" : "✗"}`, tone: overlapX > 0 ? "live" : undefined },
      { label: "y overlap", value: `${fmt(overlapY)}px ${overlapY > 0 ? "✓" : "✗"}`, tone: overlapY > 0 ? "live" : undefined },
      { label: "state", value: hit ? "overlapping!" : "separated", tone: hit ? "live" : undefined },
    ],
  };
}

export function drawRectToRectScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  points: PointPair,
) {
  const rc1 = points.point1;
  const rc2 = points.point2;
  const x1 = rc1.x - RECT_HALF_W, y1 = rc1.y - RECT_HALF_H;
  const x2 = rc2.x - RECT_HALF_W, y2 = rc2.y - RECT_HALF_H;
  const rw = RECT_HALF_W * 2, rh = RECT_HALF_H * 2;
  const hit = rectToRect(x1, y1, rw, rh, x2, y2, rw, rh);

  drawBackdrop(ctx, width, height);

  if (hit) {
    const ox = Math.max(x1, x2);
    const oy = Math.max(y1, y2);
    const ow = Math.min(x1 + rw, x2 + rw) - ox;
    const oh = Math.min(y1 + rh, y2 + rh) - oy;
    ctx.fillStyle = "rgba(249, 115, 22, 0.2)";
    ctx.fillRect(ox, oy, ow, oh);
  }

  drawAabbRect(ctx, x1, y1, rw, rh, hit ? "#f97316" : "#818cf8");
  drawAabbRect(ctx, x2, y2, rw, rh, hit ? "#fb7185" : "#a78bfa");

  labelSegment(ctx, rc1.x, rc1.y, "rect1", hit ? "#f97316" : "#818cf8");
  labelSegment(ctx, rc2.x, rc2.y, "rect2", hit ? "#fb7185" : "#a78bfa");

  drawHeaderBox(ctx, [{ text: hit ? "overlapping!" : "separated", color: hit ? "#fdba74" : "#e2e8f0" }]);
  if (hit) drawStatusPill(ctx, width - 156, 18, "overlapping!");
}

// ─── COLLISION: lineToCircle ─────────────────────────────────────────────────

export function buildLineToCircleScene(handles: HandlePair, circles: CirclePair): SceneData {
  const { a, b } = handles;
  const c = circles.circle1;
  const dx = b.x - a.x, dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((c.x - a.x) * dx + (c.y - a.y) * dy) / lenSq));
  const closest = { x: a.x + t * dx, y: a.y + t * dy };
  const d = distance(c, closest);
  const hit = lineToCircle(a.x, a.y, b.x, b.y, c.x, c.y, c.radius);
  return {
    call: `lineToCircle(${fmt(a.x)}, ${fmt(a.y)}, ${fmt(b.x)}, ${fmt(b.y)}, ${fmt(c.x)}, ${fmt(c.y)}, ${fmt(c.radius)}) = ${hit}`,
    hint: "Drag the segment endpoints or the circle. Same construction as lineToPoint: project the circle's CENTER onto the segment (at parameter t), then compare that distance to the radius.",
    readouts: [
      { label: "t (parameter)", value: fmt(t) },
      { label: "closest on segment", value: formatPoint(closest) },
      { label: "distance to center", value: fmt(d) },
      { label: "compare", value: `${fmt(d)} ${d <= c.radius ? "≤" : ">"} ${fmt(c.radius)} (radius)` },
      { label: "state", value: hit ? "touching!" : "no hit", tone: hit ? "live" : undefined },
    ],
  };
}

export function drawLineToCircleScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  handles: HandlePair,
  circles: CirclePair,
) {
  const { a, b } = handles;
  const c = circles.circle1;
  const dx = b.x - a.x, dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((c.x - a.x) * dx + (c.y - a.y) * dy) / lenSq));
  const closest = { x: a.x + t * dx, y: a.y + t * dy };
  const d = distance(c, closest);
  const hit = lineToCircle(a.x, a.y, b.x, b.y, c.x, c.y, c.radius);
  const color = hit ? "#f97316" : "#818cf8";

  drawBackdrop(ctx, width, height);
  drawCircle(ctx, c, color, "r");

  ctx.strokeStyle = hit ? "#f97316" : "#818cf8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();

  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = hit ? "rgba(249, 115, 22, 0.9)" : "rgba(255, 255, 255, 0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(closest.x, closest.y);
  ctx.lineTo(c.x, c.y);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCenter(ctx, a, "#818cf8", 7);
  labelSegment(ctx, a.x - 22, a.y - 10, "a", "#818cf8");
  drawCenter(ctx, b, "#a78bfa", 7);
  labelSegment(ctx, b.x + 18, b.y - 10, "b", "#a78bfa");
  drawCenter(ctx, closest, "#fde68a", 5);
  labelSegment(ctx, closest.x + 22, closest.y + 16, `t=${fmt(t)}`, "#fde68a");
  drawCenter(ctx, c, color, 5);
  labelSegment(
    ctx,
    (closest.x + c.x) / 2 + 20,
    (closest.y + c.y) / 2 - 8,
    `d = ${fmt(d)}`,
    hit ? "#fdba74" : "rgba(255,255,255,0.85)",
  );

  drawHeaderBox(ctx, [
    { text: `closest at t = ${fmt(t)}`, color: "#e2e8f0" },
    { text: `d = ${fmt(d)}  radius = ${fmt(c.radius)}`, color: hit ? "#fb923c" : "#cbd5e1" },
  ]);
  if (hit) drawStatusPill(ctx, width - 156, 18, "touching!");
}

// ─── COLLISION: lineToLine ───────────────────────────────────────────────────

export function buildLineToLineScene(handles: HandlePair, points: PointPair): SceneData {
  const { a, b } = handles;
  const c = points.point1, d2 = points.point2;
  const denom = (a.x - b.x) * (c.y - d2.y) - (a.y - b.y) * (c.x - d2.x);
  const t = Math.abs(denom) > 0.0001
    ? ((a.x - c.x) * (c.y - d2.y) - (a.y - c.y) * (c.x - d2.x)) / denom
    : NaN;
  const u = Math.abs(denom) > 0.0001
    ? -((a.x - b.x) * (a.y - c.y) - (a.y - b.y) * (a.x - c.x)) / denom
    : NaN;
  const hit = lineToLine(a.x, a.y, b.x, b.y, c.x, c.y, d2.x, d2.y);
  const tInside = !isNaN(t) && t >= 0 && t <= 1;
  const uInside = !isNaN(u) && u >= 0 && u <= 1;
  return {
    call: `lineToLine(${fmt(a.x)}, ${fmt(a.y)}, ${fmt(b.x)}, ${fmt(b.y)}, ${fmt(c.x)}, ${fmt(c.y)}, ${fmt(d2.x)}, ${fmt(d2.y)}) = ${hit}`,
    hint: "Drag any endpoint. The algorithm finds where the two infinite lines would meet (parameters t and u), then checks if that meeting point falls within both segments (0 ≤ t ≤ 1 AND 0 ≤ u ≤ 1).",
    readouts: [
      { label: "t (on seg 1)", value: isNaN(t) ? "parallel" : `${fmt(t)} ${tInside ? "in range" : "out of range"}`, tone: tInside ? "live" : undefined },
      { label: "u (on seg 2)", value: isNaN(u) ? "parallel" : `${fmt(u)} ${uInside ? "in range" : "out of range"}`, tone: uInside ? "live" : undefined },
      { label: "gate", value: isNaN(t) || isNaN(u) ? "parallel -> no shared point" : tInside && uInside ? "both inside [0,1] -> crossing" : "one parameter falls outside [0,1]" },
      { label: "state", value: hit ? "crossing!" : "no intersection", tone: hit ? "live" : undefined },
    ],
  };
}

export function drawLineToLineScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  handles: HandlePair,
  points: PointPair,
) {
  const { a, b } = handles;
  const c = points.point1, d2 = points.point2;
  const denom = (a.x - b.x) * (c.y - d2.y) - (a.y - b.y) * (c.x - d2.x);
  const t = Math.abs(denom) > 0.0001
    ? ((a.x - c.x) * (c.y - d2.y) - (a.y - c.y) * (c.x - d2.x)) / denom
    : NaN;
  const u = Math.abs(denom) > 0.0001
    ? -((a.x - b.x) * (a.y - c.y) - (a.y - b.y) * (a.x - c.x)) / denom
    : NaN;
  const hit = lineToLine(a.x, a.y, b.x, b.y, c.x, c.y, d2.x, d2.y);
  const intersect = hit && !isNaN(t)
    ? { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) }
    : null;
  const tInside = !isNaN(t) && t >= 0 && t <= 1;
  const uInside = !isNaN(u) && u >= 0 && u <= 1;

  drawBackdrop(ctx, width, height);

  ctx.strokeStyle = hit ? "#f97316" : "#818cf8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();

  ctx.strokeStyle = hit ? "#fb7185" : "#a78bfa";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(c.x, c.y);
  ctx.lineTo(d2.x, d2.y);
  ctx.stroke();

  drawCenter(ctx, a, "#818cf8", 7);
  labelSegment(ctx, a.x - 22, a.y - 10, "a", "#818cf8");
  drawCenter(ctx, b, "#818cf8", 7);
  labelSegment(ctx, b.x + 18, b.y - 10, "b", "#818cf8");
  drawCenter(ctx, c, "#fb7185", 7);
  labelSegment(ctx, c.x - 22, c.y + 16, "c", "#fb7185");
  drawCenter(ctx, d2, "#fb7185", 7);
  labelSegment(ctx, d2.x + 18, d2.y + 16, "d", "#fb7185");

  if (intersect) {
    drawCenter(ctx, intersect, "#fde68a", 9);
    labelSegment(ctx, intersect.x + 18, intersect.y - 14, "✕", "#fde68a");
  }

  drawHeaderBox(ctx, [
    { text: `t = ${isNaN(t) ? "parallel" : fmt(t)} · u = ${isNaN(u) ? "parallel" : fmt(u)}`, color: "#e2e8f0" },
    { text: isNaN(t) || isNaN(u) ? "parallel/collinear here -> false" : tInside && uInside ? "both land inside the segments" : "meeting point falls outside at least one segment", color: hit ? "#c4b5fd" : "#cbd5e1" },
    { text: `crossing: ${hit}`, color: hit ? "#fdba74" : "#e2e8f0" },
  ]);
  if (hit) drawStatusPill(ctx, width - 156, 18, "crossing!");
}

// ─── COLLISION: lineToRect ───────────────────────────────────────────────────

export function buildLineToRectScene(handles: HandlePair, points: PointPair): SceneData {
  const { a, b } = handles;
  const rc = points.point1;
  const rx = rc.x - RECT_HALF_W, ry = rc.y - RECT_HALF_H;
  const rw = RECT_HALF_W * 2, rh = RECT_HALF_H * 2;
  const hit = lineToRect(a.x, a.y, b.x, b.y, rx, ry, rw, rh);
  const hitLeft = lineToLine(a.x, a.y, b.x, b.y, rx, ry, rx, ry + rh);
  const hitRight = lineToLine(a.x, a.y, b.x, b.y, rx + rw, ry, rx + rw, ry + rh);
  const hitTop = lineToLine(a.x, a.y, b.x, b.y, rx, ry, rx + rw, ry);
  const hitBottom = lineToLine(a.x, a.y, b.x, b.y, rx, ry + rh, rx + rw, ry + rh);
  const firstHit =
    hitLeft ? "left" :
      hitRight ? "right" :
        hitTop ? "top" :
          hitBottom ? "bottom" :
            "none";
  return {
    call: `lineToRect(${fmt(a.x)}, ${fmt(a.y)}, ${fmt(b.x)}, ${fmt(b.y)}, ${fmt(rx)}, ${fmt(ry)}, ${fmt(rw)}, ${fmt(rh)}) = ${hit}`,
    hint: "Drag the segment or the rectangle. `lineToRect()` only checks the four rectangle edges with `lineToLine()`. If no boundary edge is crossed, a fully contained segment still returns false.",
    readouts: [
      { label: "left edge", value: hitLeft ? "hit ✓" : "miss", tone: hitLeft ? "live" : undefined },
      { label: "right edge", value: hitRight ? "hit ✓" : "miss", tone: hitRight ? "live" : undefined },
      { label: "top edge", value: hitTop ? "hit ✓" : "miss", tone: hitTop ? "live" : undefined },
      { label: "bottom edge", value: hitBottom ? "hit ✓" : "miss", tone: hitBottom ? "live" : undefined },
      { label: "first winning edge", value: firstHit, tone: hit ? "live" : undefined },
      { label: "state", value: hit ? "crossing!" : "no hit", tone: hit ? "live" : undefined },
    ],
  };
}

export function drawLineToRectScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  handles: HandlePair,
  points: PointPair,
) {
  const { a, b } = handles;
  const rc = points.point1;
  const rx = rc.x - RECT_HALF_W, ry = rc.y - RECT_HALF_H;
  const rw = RECT_HALF_W * 2, rh = RECT_HALF_H * 2;
  const hit = lineToRect(a.x, a.y, b.x, b.y, rx, ry, rw, rh);
  const edges = [
    { name: "left", x1: rx, y1: ry, x2: rx, y2: ry + rh },
    { name: "right", x1: rx + rw, y1: ry, x2: rx + rw, y2: ry + rh },
    { name: "top", x1: rx, y1: ry, x2: rx + rw, y2: ry },
    { name: "bottom", x1: rx, y1: ry + rh, x2: rx + rw, y2: ry + rh },
  ];
  const firstHit = edges.find((edge) => lineToLine(a.x, a.y, b.x, b.y, edge.x1, edge.y1, edge.x2, edge.y2))?.name ?? "none";

  drawBackdrop(ctx, width, height);

  ctx.fillStyle = hit ? "rgba(249, 115, 22, 0.1)" : "rgba(129, 140, 248, 0.1)";
  ctx.fillRect(rx, ry, rw, rh);

  edges.forEach((edge) => {
    const edgeHit = lineToLine(a.x, a.y, b.x, b.y, edge.x1, edge.y1, edge.x2, edge.y2);
    const isPrimary = edge.name === firstHit;
    ctx.strokeStyle = edgeHit ? (isPrimary ? "#f97316" : "rgba(249,115,22,0.45)") : (hit ? "rgba(249,115,22,0.2)" : "rgba(129,140,248,0.65)");
    ctx.lineWidth = edgeHit ? (isPrimary ? 3.5 : 2.5) : 2;
    ctx.beginPath();
    ctx.moveTo(edge.x1, edge.y1);
    ctx.lineTo(edge.x2, edge.y2);
    ctx.stroke();
    if (isPrimary) {
      labelSegment(ctx, (edge.x1 + edge.x2) / 2, (edge.y1 + edge.y2) / 2 - 12, edge.name, "#fde68a");
    }
  });

  ctx.strokeStyle = hit ? "#fb7185" : "#a78bfa";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();

  drawCenter(ctx, a, "#a78bfa", 7);
  labelSegment(ctx, a.x - 22, a.y - 10, "a", "#a78bfa");
  drawCenter(ctx, b, "#a78bfa", 7);
  labelSegment(ctx, b.x + 18, b.y - 10, "b", "#a78bfa");

  drawHeaderBox(ctx, [
    { text: `tests 4 rect edges with lineToLine`, color: "#e2e8f0" },
    { text: hit ? `first winning edge: ${firstHit}` : "no edge crossing found", color: hit ? "#c4b5fd" : "#cbd5e1" },
    { text: hit ? "only boundary hits count here" : "a fully inside segment still returns false", color: hit ? "#fdba74" : "#cbd5e1" },
  ]);
  if (hit) drawStatusPill(ctx, width - 156, 18, "crossing!");
}
