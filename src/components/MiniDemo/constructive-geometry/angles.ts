// Angles family (kinds: get-rotation, lerp-angle — the latter also fronts
// shortestAngleBetween and wrapAngle via demo.fnName).
// Moved verbatim from ConstructiveGeometryDemo.tsx (behavior-identical).
import { lerpAngle, shortestAngleBetween, wrapAngle } from "@utilspalooza/core/AngleInterpolation";
import { getRotation } from "@utilspalooza/core/GetRotation";
import type { HandlePair, PointPair, SceneData } from "./types";
import type { ConstructiveGeometryDemoDef } from "../constructiveGeometryDemos";
import {
  drawBackdrop,
  drawAxes,
  drawUnitCircle,
  drawVector,
  drawAngleArc,
  drawCenter,
  drawHeaderBox,
  drawRail,
  labelSegment,
  unitCircleLayout,
  formatPoint,
  fmt,
  fmtSigned,
  radToDeg,
} from "./shared";

export function buildGetRotationScene(points: PointPair): SceneData {
  const { point1, point2 } = points;
  const angle = getRotation(point1, point2);
  return {
    call: `getRotation(${formatPoint(point1)}, ${formatPoint(point2)}) = ${fmt(angle)} rad`,
    hint:
      "Drag either point. The arrow shows the heading from the current point toward the destination; getRotation is just atan2(dy, dx) made readable.",
    readouts: [
      { label: "current", value: formatPoint(point1) },
      { label: "destination", value: formatPoint(point2) },
      { label: "angle", value: `${fmt(angle)} rad = ${fmt(radToDeg(angle))}°`, tone: "live" },
    ],
  };
}

export function drawGetRotationScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  points: PointPair,
) {
  const { point1, point2 } = points;
  const angle = getRotation(point1, point2);

  drawBackdrop(ctx, width, height);
  drawVector(ctx, point1, point2, "#818cf8", "destination");
  drawAngleArc(ctx, point1, point2, 44, "rgba(249, 115, 22, 0.95)");
  drawCenter(ctx, point1, "#f97316", 7);
  labelSegment(ctx, point1.x + 18, point1.y - 10, "current", "#f97316");

  drawHeaderBox(ctx, [
    { text: `angle = ${fmt(angle)} rad`, color: "#e2e8f0" },
    { text: `= ${fmt(radToDeg(angle))}°`, color: "#fdba74" },
  ]);

  labelSegment(
    ctx,
    point1.x + 60,
    point1.y - 14,
    `${fmt(radToDeg(angle))}°`,
    "rgba(249, 115, 22, 0.98)",
  );
}

export function buildLerpAngleScene(
  demo: ConstructiveGeometryDemoDef,
  size: { width: number; height: number },
  handles: HandlePair,
  t: number,
): SceneData {
  const layout = unitCircleLayout(size.width, size.height);
  const angleA = Math.atan2(handles.a.y - layout.center.y, handles.a.x - layout.center.x);
  const angleB = Math.atan2(handles.b.y - layout.center.y, handles.b.x - layout.center.x);
  const shortest = shortestAngleBetween(angleA, angleB);
  const lerped = lerpAngle(angleA, angleB, t);
  // Show wrapAngle acting on the raw difference — that's exactly what shortestAngleBetween calls.
  const rawDiff = angleB - angleA;
  const wrapped = wrapAngle(rawDiff);

  let callStr: string;
  if (demo.fnName === "shortestAngleBetween") {
    callStr = `shortestAngleBetween(${fmt(angleA)}, ${fmt(angleB)}) = ${fmt(shortest)}`;
  } else if (demo.fnName === "wrapAngle") {
    callStr = `wrapAngle(${fmt(rawDiff)}) = ${fmt(wrapped)}`;
  } else {
    callStr = `lerpAngle(${fmt(angleA)}, ${fmt(angleB)}, ${fmt(t)}) = ${fmt(lerped)}`;
  }

  return {
    call: callStr,
    hint:
      "Drag either handle to set an angle. The shaded arc is the shortest path — lerpAngle always travels it, even across the 0°/360° seam.",
    readouts: [
      { label: "a", value: `${fmt(radToDeg(angleA))}°` },
      { label: "b", value: `${fmt(radToDeg(angleB))}°` },
      { label: "b − a (raw)", value: `${fmtSigned(radToDeg(rawDiff))}°` },
      { label: "shortest (wrapped)", value: `${fmtSigned(radToDeg(shortest))}° ${shortest >= 0 ? "(CCW)" : "(CW)"}` },
      { label: `lerp at t = ${fmt(t)}`, value: `${fmt(radToDeg(lerped))}°`, tone: "live" },
    ],
  };
}

export function drawLerpAngleScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  handles: HandlePair,
  t: number,
) {
  const layout = unitCircleLayout(width, height);
  const { center, radius } = layout;
  const angleA = Math.atan2(handles.a.y - center.y, handles.a.x - center.x);
  const angleB = Math.atan2(handles.b.y - center.y, handles.b.x - center.x);
  const shortest = shortestAngleBetween(angleA, angleB);
  const lerped = lerpAngle(angleA, angleB, t);
  const lerpedPt = { x: center.x + Math.cos(lerped) * radius, y: center.y + Math.sin(lerped) * radius };

  drawBackdrop(ctx, width, height);
  drawAxes(ctx, width, height, center);
  drawUnitCircle(ctx, center, radius);
  drawCenter(ctx, center, "#f8fafc", 5);

  // Shaded short arc
  if (Math.abs(shortest) > 0.01) {
    ctx.fillStyle = "rgba(249, 115, 22, 0.12)";
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.arc(center.x, center.y, radius, angleA, angleA + shortest, shortest < 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(249, 115, 22, 0.7)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, angleA, angleA + shortest, shortest < 0);
    ctx.stroke();
  }

  // Arms A and B
  drawVector(ctx, center, handles.a, "#818cf8", "a");
  drawVector(ctx, center, handles.b, "#fb7185", "b");

  // Lerped arm
  drawVector(ctx, center, lerpedPt, "#f97316", `t=${fmt(t)}`, false);

  // t rail and header
  drawRail(ctx, width, height, "lerp", t, 0, 1);
  drawHeaderBox(ctx, [
    {
      text: `shortest = ${fmtSigned(radToDeg(shortest))}° ${shortest >= 0 ? "(CCW)" : "(CW)"}`,
      color: "#fdba74",
    },
    { text: `lerped = ${fmt(radToDeg(lerped))}°`, color: "#f97316" },
  ]);
}
