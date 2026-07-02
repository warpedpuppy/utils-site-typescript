// Single-vector family (kinds: vec-scale, vec-magnitude, vec-magnitude-squared,
// vec-normalize, vec-angle, vec-perpendicular).
// Moved verbatim from ConstructiveGeometryDemo.tsx (behavior-identical).
import {
  vecAngle,
  vecMagnitude,
  vecMagnitudeSquared,
  vecNormalize,
  vecPerpendicular,
  vecScale,
} from "@utilspalooza/core/Vec2";
import type { Point } from "@utilspalooza/core";
import type { SceneData } from "./types";
import {
  drawBackdrop,
  drawAxes,
  drawVector,
  drawComponentGuides,
  drawOrigin,
  drawHeaderBox,
  drawUnitCircle,
  drawAngleArc,
  drawAngleArcBetween,
  drawRail,
  labelSegment,
  vectorFromHandle,
  handleFromVector,
  formatVector,
  fmt,
  fmtSigned,
  fmtAbs,
  radToDeg,
} from "./shared";

export function buildVecScaleScene(origin: Point, handle: Point, scale: number): SceneData {
  const v = vectorFromHandle(handle, origin);
  const result = vecScale(v, scale);
  return {
    call: `vecScale(${formatVector(v)}, ${fmt(scale)}) = ${formatVector(result)}`,
    hint:
      "Drag the vector tip or the orange rail knob. Scaling keeps direction and changes only length; negative values flip the arrow through the origin.",
    readouts: [
      { label: "vector", value: formatVector(v) },
      { label: "scalar", value: fmt(scale) },
      { label: "scaled", value: formatVector(result) },
    ],
  };
}

export function buildVecMagnitudeScene(origin: Point, handle: Point): SceneData {
  const v = vectorFromHandle(handle, origin);
  const mag = vecMagnitude(v);
  return {
    call: `vecMagnitude(${formatVector(v)}) = ${fmt(mag)}`,
    hint:
      "Drag the tip of the vector. The vector's x and y components are its adjacent and opposite legs; magnitude is the same Pythagorean hypotenuse, just written as a vector length.",
    readouts: [
      { label: "vector", value: formatVector(v) },
      { label: "magnitude", value: `√(${fmtAbs(v.x)}² + ${fmtAbs(v.y)}²) = ${fmt(mag)}` },
    ],
  };
}

export function buildVecMagnitudeSquaredScene(origin: Point, handle: Point): SceneData {
  const v = vectorFromHandle(handle, origin);
  const mag2 = vecMagnitudeSquared(v);
  return {
    call: `vecMagnitudeSquared(${formatVector(v)}) = ${fmt(mag2)}`,
    hint:
      "Drag the vector tip. Same geometric length question as magnitude, but it stops before the square root, which is why it is the cheap comparison helper.",
    readouts: [
      { label: "vector", value: formatVector(v) },
      { label: "squared length", value: `${fmt(v.x)}² + ${fmt(v.y)}² = ${fmt(mag2)}` },
    ],
  };
}

export function buildVecNormalizeScene(origin: Point, handle: Point): SceneData {
  const v = vectorFromHandle(handle, origin);
  const result = vecNormalize(v);
  return {
    call: `vecNormalize(${formatVector(v)}) = ${formatVector(result)}`,
    hint:
      "Drag the vector tip. Normalizing keeps the heading but forces the length to 1, which is why the output arrow always lands on the unit circle.",
    readouts: [
      { label: "vector", value: formatVector(v) },
      { label: "normalized", value: formatVector(result) },
      { label: "length", value: fmt(vecMagnitude(result)) },
    ],
  };
}

export function buildVecAngleScene(origin: Point, handle: Point): SceneData {
  const v = vectorFromHandle(handle, origin);
  const radians = vecAngle(v);
  return {
    call: `vecAngle(${formatVector(v)}) = ${fmt(radians)} rad`,
    hint:
      "Drag the tip of the vector around the origin. The function returns the vector's heading from the positive x-axis, so the demo makes the angle itself visible instead of leaving atan2 as dead text.",
    readouts: [
      { label: "vector", value: formatVector(v) },
      { label: "angle", value: `${fmt(radians)} rad = ${fmt(radToDeg(radians))}°` },
    ],
  };
}

export function buildVecPerpendicularScene(origin: Point, handle: Point): SceneData {
  const v = vectorFromHandle(handle, origin);
  const result = vecPerpendicular(v);
  return {
    call: `vecPerpendicular(${formatVector(v)}) = ${formatVector(result)}`,
    hint:
      "Drag the vector tip. The output is the 90° counter-clockwise turn, which is why it is the quick way to get a normal from an edge.",
    readouts: [
      { label: "vector", value: formatVector(v) },
      { label: "perpendicular", value: formatVector(result) },
    ],
  };
}

export function drawSingleVectorScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  origin: Point,
  handle: Point,
  focus: "magnitude" | "magnitude-squared" | "normalize" | "angle" | "perpendicular",
) {
  const v = vectorFromHandle(handle, origin);
  const mag = vecMagnitude(v);
  const mag2 = vecMagnitudeSquared(v);
  const normalized = vecNormalize(v);
  const radians = vecAngle(v);
  const perpendicular = vecPerpendicular(v);

  drawBackdrop(ctx, width, height);
  drawAxes(ctx, width, height, origin);
  drawVector(ctx, origin, handle, "#818cf8", "v");
  drawComponentGuides(ctx, origin, handle);
  drawOrigin(ctx, origin);

  if (focus === "magnitude") {
    drawHeaderBox(ctx, [{ text: `|v| = ${fmt(mag)}`, color: "#e2e8f0" }]);
    labelSegment(ctx, origin.x + v.x / 2, origin.y + 16, `x = ${fmtSigned(v.x)}`, "rgba(96, 165, 250, 0.95)");
    labelSegment(ctx, handle.x + 14, origin.y - v.y / 2, `y = ${fmtSigned(v.y)}`, "rgba(125, 211, 252, 0.95)");
    labelSegment(ctx, origin.x + v.x / 2, origin.y - v.y / 2 - 18, `|v| = ${fmt(mag)}`, "rgba(255, 255, 255, 0.95)");
  } else if (focus === "magnitude-squared") {
    drawHeaderBox(ctx, [{ text: `|v|² = ${fmt(mag2)}`, color: "#e2e8f0" }]);
    labelSegment(ctx, origin.x + v.x / 2, origin.y + 16, `x² = ${fmt(v.x * v.x)}`, "rgba(96, 165, 250, 0.95)");
    labelSegment(ctx, handle.x + 16, origin.y - v.y / 2, `y² = ${fmt(v.y * v.y)}`, "rgba(125, 211, 252, 0.95)");
    labelSegment(ctx, origin.x + v.x / 2, origin.y - v.y / 2 - 18, `sum = ${fmt(mag2)}`, "rgba(255, 255, 255, 0.95)");
  } else if (focus === "normalize") {
    drawHeaderBox(ctx, [{ text: `normalize(v) has length 1`, color: "#e2e8f0" }]);
    drawUnitCircle(ctx, origin, 64);
    drawVector(ctx, origin, handleFromVector(origin, normalized, 64), "#fb7185", "unit", false);
  } else if (focus === "perpendicular") {
    drawHeaderBox(ctx, [{ text: `perpendicular = 90° turn`, color: "#e2e8f0" }]);
    drawVector(ctx, origin, handleFromVector(origin, perpendicular, 0.75), "#fb7185", "⊥", false);
    drawAngleArcBetween(ctx, origin, handle, handleFromVector(origin, perpendicular, 0.75), 42, "rgba(249, 115, 22, 0.95)");
  } else {
    drawHeaderBox(ctx, [{ text: `θ = ${fmt(radians)} rad = ${fmt(radToDeg(radians))}°`, color: "#e2e8f0" }]);
    drawAngleArc(ctx, origin, handle, origin.x + 54, "rgba(249, 115, 22, 0.95)");
    labelSegment(ctx, origin.x + 52, origin.y - 10, `θ = ${fmt(radToDeg(radians))}°`, "rgba(249, 115, 22, 0.98)");
  }
}

export function drawScaleScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  origin: Point,
  handle: Point,
  scale: number,
) {
  const v = vectorFromHandle(handle, origin);
  const scaled = vecScale(v, scale);
  drawBackdrop(ctx, width, height);
  drawAxes(ctx, width, height, origin);
  drawVector(ctx, origin, handle, "#818cf8", "v");
  drawVector(ctx, origin, handleFromVector(origin, scaled, 1), "#f97316", "scaled", false);
  drawOrigin(ctx, origin);
  drawRail(ctx, width, height, "scale", scale, -2, 2);
  drawHeaderBox(ctx, [{ text: `scale = ${fmt(scale)}`, color: "#e2e8f0" }]);
}
