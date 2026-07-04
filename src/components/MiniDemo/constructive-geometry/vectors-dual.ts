// Dual-vector family (kinds: vec-add, vec-subtract, vec-dot, vec-cross,
// vec-angle-between, vec-lerp, vec-limit).
// Moved verbatim from ConstructiveGeometryDemo.tsx (behavior-identical).
import {
  vecAdd,
  vecAngleBetween,
  vecCross,
  vecDot,
  vecLerp,
  vecLimit,
  vecSubtract,
} from "@utilspalooza/core/Vec2";
import type { Point } from "@utilspalooza/core";
import type { HandlePair, SceneData } from "./types";
import {
  drawBackdrop,
  drawAxes,
  drawVector,
  drawOrigin,
  drawHeaderBox,
  drawAngleArcBetween,
  drawParallelogram,
  drawRail,
  drawUnitCircle,
  labelSegment,
  vectorFromHandle,
  handleFromVector,
  dotReading,
  angleReading,
  crossReading,
  formatVector,
  fmt,
  radToDeg,
} from "./shared";

export function buildVecAddScene(origin: Point, handles: HandlePair): SceneData {
  const a = vectorFromHandle(handles.a, origin);
  const b = vectorFromHandle(handles.b, origin);
  const result = vecAdd(a, b);
  return {
    call: `vecAdd(${formatVector(a)}, ${formatVector(b)}) = ${formatVector(result)}`,
    hint:
      "Drag either vector. Addition means tail-to-tail vectors combine into one resultant displacement.",
    readouts: [
      { label: "a", value: formatVector(a) },
      { label: "b", value: formatVector(b) },
      { label: "a + b", value: formatVector(result) },
    ],
  };
}

export function buildVecSubtractScene(origin: Point, handles: HandlePair): SceneData {
  const a = vectorFromHandle(handles.a, origin);
  const b = vectorFromHandle(handles.b, origin);
  const result = vecSubtract(a, b);
  return {
    call: `vecSubtract(${formatVector(a)}, ${formatVector(b)}) = ${formatVector(result)}`,
    hint:
      "Drag either vector. Subtraction answers the displacement from b to a, so the result is the arrow you would draw from b's tip to a's tip.",
    readouts: [
      { label: "a", value: formatVector(a) },
      { label: "b", value: formatVector(b) },
      { label: "a - b", value: formatVector(result) },
    ],
  };
}

export function buildVecDotScene(origin: Point, handles: HandlePair): SceneData {
  const a = vectorFromHandle(handles.a, origin);
  const b = vectorFromHandle(handles.b, origin);
  const dot = vecDot(a, b);
  const angle = vecAngleBetween(a, b);
  return {
    call: `vecDot(${formatVector(a)}, ${formatVector(b)}) = ${fmt(dot)}`,
    hint:
      "Drag either vector. The dot product is the overlap question: positive means they lean the same way, zero means perpendicular, negative means opposed.",
    readouts: [
      { label: "a", value: formatVector(a) },
      { label: "b", value: formatVector(b) },
      { label: "dot", value: `${fmt(a.x)}×${fmt(b.x)} + ${fmt(a.y)}×${fmt(b.y)} = ${fmt(dot)}` },
      { label: "reading", value: dotReading(dot, angle) },
    ],
  };
}

export function buildVecCrossScene(origin: Point, handles: HandlePair): SceneData {
  const a = vectorFromHandle(handles.a, origin);
  const b = vectorFromHandle(handles.b, origin);
  const cross = vecCross(a, b);
  return {
    call: `vecCross(${formatVector(a)}, ${formatVector(b)}) = ${fmt(cross)}`,
    hint:
      "Drag either vector. In 2D the cross product becomes a signed area: its sign tells you turn direction, and its size tells you how much parallelogram area the pair spans.",
    readouts: [
      { label: "a", value: formatVector(a) },
      { label: "b", value: formatVector(b) },
      { label: "cross", value: `${fmt(a.x)}×${fmt(b.y)} - ${fmt(a.y)}×${fmt(b.x)} = ${fmt(cross)}` },
      { label: "reading", value: crossReading(cross) },
    ],
  };
}

export function buildVecAngleBetweenScene(origin: Point, handles: HandlePair): SceneData {
  const a = vectorFromHandle(handles.a, origin);
  const b = vectorFromHandle(handles.b, origin);
  const angle = vecAngleBetween(a, b);
  return {
    call: `vecAngleBetween(${formatVector(a)}, ${formatVector(b)}) = ${fmt(angle)} rad`,
    hint:
      "Drag either vector. Read blue as your current heading and pink as the target heading. This measures how big the turn is between them, but not whether that turn is clockwise or counter-clockwise.",
    readouts: [
      { label: "heading", value: formatVector(a) },
      { label: "target", value: formatVector(b) },
      { label: "turn needed", value: `${fmt(angle)} rad = ${fmt(radToDeg(angle))}°` },
      { label: "reading", value: angleReading(angle) },
    ],
  };
}

export function buildVecLerpScene(origin: Point, handles: HandlePair, t: number): SceneData {
  const a = vectorFromHandle(handles.a, origin);
  const b = vectorFromHandle(handles.b, origin);
  const result = vecLerp(a, b, t);
  return {
    call: `vecLerp(${formatVector(a)}, ${formatVector(b)}, ${fmt(t)}) = ${formatVector(result)}`,
    hint:
      "Drag either endpoint or the orange rail knob. Vector lerp is just scalar lerp done on x and y independently, so the result slides on the straight segment between a and b.",
    readouts: [
      { label: "a", value: formatVector(a) },
      { label: "b", value: formatVector(b) },
      { label: "t", value: fmt(t) },
      { label: "lerp", value: formatVector(result) },
    ],
  };
}

export function buildVecLimitScene(origin: Point, handle: Point, max: number): SceneData {
  const v = vectorFromHandle(handle, origin);
  const result = vecLimit(v, max);
  return {
    call: `vecLimit(${formatVector(v)}, ${fmt(max)}) = ${formatVector(result)}`,
    hint:
      "Drag the vector tip or the orange rail knob. If the vector is already short enough, it stays put; if not, it gets clipped back to the max-length circle without changing direction.",
    readouts: [
      { label: "vector", value: formatVector(v) },
      { label: "max", value: fmt(max) },
      { label: "limited", value: formatVector(result) },
    ],
  };
}

export function drawDualVectorResultScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  origin: Point,
  handles: HandlePair,
  focus: "add" | "subtract",
) {
  const a = vectorFromHandle(handles.a, origin);
  const b = vectorFromHandle(handles.b, origin);
  const result = focus === "add" ? vecAdd(a, b) : vecSubtract(a, b);
  const resultHandle = handleFromVector(origin, result, 1);

  drawBackdrop(ctx, width, height);
  drawAxes(ctx, width, height, origin);
  drawVector(ctx, origin, handles.a, "#818cf8", "a");
  drawVector(ctx, origin, handles.b, "#fb7185", "b");
  drawVector(ctx, origin, resultHandle, "#f97316", focus === "add" ? "a+b" : "a-b", false);
  drawOrigin(ctx, origin);

  drawHeaderBox(ctx, [{ text: `${focus === "add" ? "result" : "difference"} = ${formatVector(result)}`, color: "#e2e8f0" }]);
}

export function drawDualVectorScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  origin: Point,
  handles: HandlePair,
  focus: "dot" | "cross" | "angle-between",
) {
  const a = vectorFromHandle(handles.a, origin);
  const b = vectorFromHandle(handles.b, origin);
  const dot = vecDot(a, b);
  const cross = vecCross(a, b);
  const angle = vecAngleBetween(a, b);

  drawBackdrop(ctx, width, height);
  drawAxes(ctx, width, height, origin);
  drawVector(ctx, origin, handles.a, "#818cf8", "a");
  drawVector(ctx, origin, handles.b, "#fb7185", "b");
  drawOrigin(ctx, origin);
  drawAngleArcBetween(ctx, origin, handles.a, handles.b, 48, "rgba(249, 115, 22, 0.95)");

  if (focus === "dot") {
    drawHeaderBox(ctx, [
      { text: `a · b = ${fmt(dot)}`, color: "#e2e8f0" },
      { text: dotReading(dot, angle), color: dot > 0 ? "#86efac" : dot < 0 ? "#fca5a5" : "#fdba74" },
    ]);
  } else if (focus === "cross") {
    drawHeaderBox(ctx, [
      { text: `a × b = ${fmt(cross)}`, color: "#e2e8f0" },
      { text: crossReading(cross), color: cross > 0 ? "#86efac" : cross < 0 ? "#fca5a5" : "#fdba74" },
    ]);
    drawParallelogram(ctx, origin, handles.a, handles.b);
  } else {
    drawHeaderBox(ctx, [
      { text: `turn needed = ${fmt(angle)} rad = ${fmt(radToDeg(angle))}°`, color: "#e2e8f0" },
      { text: angleReading(angle), color: "#fdba74" },
    ]);
  }

  labelSegment(ctx, handles.a.x + 18, handles.a.y - 10, focus === "angle-between" ? "heading" : "a", "#818cf8");
  labelSegment(ctx, handles.b.x + 18, handles.b.y - 10, focus === "angle-between" ? "target" : "b", "#fb7185");
}

export function drawLerpScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  origin: Point,
  handles: HandlePair,
  t: number,
) {
  const a = vectorFromHandle(handles.a, origin);
  const b = vectorFromHandle(handles.b, origin);
  const lerped = vecLerp(a, b, t);
  const aHandle = handleFromVector(origin, a, 1);
  const bHandle = handleFromVector(origin, b, 1);
  const lerpHandle = handleFromVector(origin, lerped, 1);

  drawBackdrop(ctx, width, height);
  drawAxes(ctx, width, height, origin);
  drawVector(ctx, origin, aHandle, "#818cf8", "a");
  drawVector(ctx, origin, bHandle, "#fb7185", "b");
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(aHandle.x, aHandle.y);
  ctx.lineTo(bHandle.x, bHandle.y);
  ctx.stroke();
  drawVector(ctx, origin, lerpHandle, "#f97316", "lerp", false);
  drawOrigin(ctx, origin);
  drawRail(ctx, width, height, "lerp", t, 0, 1);
  drawHeaderBox(ctx, [{ text: `t = ${fmt(t)}`, color: "#e2e8f0" }]);
}

export function drawLimitScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  origin: Point,
  handle: Point,
  max: number,
) {
  const v = vectorFromHandle(handle, origin);
  const limited = vecLimit(v, max);
  drawBackdrop(ctx, width, height);
  drawAxes(ctx, width, height, origin);
  drawUnitCircle(ctx, origin, max);
  drawVector(ctx, origin, handle, "#818cf8", "v");
  drawVector(ctx, origin, handleFromVector(origin, limited, 1), "#f97316", "limited", false);
  drawOrigin(ctx, origin);
  drawRail(ctx, width, height, "limit", max, 20, 140);
  drawHeaderBox(ctx, [{ text: `max = ${fmt(max)}`, color: "#e2e8f0" }]);
}
