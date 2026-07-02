// Distance family (kind: "distance") — the simplest constructive-geometry cut.
// Moved verbatim from ConstructiveGeometryDemo.tsx (behavior-identical).
import { distance } from "@utilspalooza/core/Distance";
import { getTriangleData } from "@utilspalooza/core/GetTriangleData";
import type { PointPair, SceneData } from "./types";
import {
  formatPoint,
  fmt,
  fmtSigned,
  fmtAbs,
  drawBackdrop,
  drawPoint,
  drawRightTriangle,
  drawCenter,
  drawHeaderBox,
  labelSegment,
} from "./shared";

export function buildDistanceScene(points: PointPair): SceneData {
  const d = distance(points.point1, points.point2);
  const triangle = getTriangleData(points.point1, points.point2);
  return {
    call: `distance(${formatPoint(points.point1)}, ${formatPoint(points.point2)}) = ${fmt(d)}`,
    hint:
      "Drag either point. This is the simplest constructive-geometry cut: the horizontal run and vertical rise are free, so the only mystery left is the hypotenuse.",
    readouts: [
      { label: "dx", value: fmtSigned(triangle.dx) },
      { label: "dy", value: fmtSigned(triangle.dy) },
      { label: "distance", value: `√(${fmtAbs(triangle.dx)}² + ${fmtAbs(triangle.dy)}²) = ${fmt(d)}` },
    ],
  };
}

export function drawDistanceScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  points: PointPair,
) {
  const { point1, point2 } = points;
  const triangle = getTriangleData(point1, point2);
  const d = distance(point1, point2);
  const corner = { x: point2.x, y: point1.y };

  drawBackdrop(ctx, width, height);
  drawPoint(ctx, point1, "#818cf8", "p1");
  drawPoint(ctx, point2, "#fb7185", "p2");
  drawRightTriangle(ctx, point1, point2, corner, false);
  drawCenter(ctx, corner, "rgba(125, 211, 252, 0.8)", 4);

  drawHeaderBox(ctx, [{ text: `distance = ${fmt(d)}`, color: "#e2e8f0" }]);
  labelSegment(ctx, point1.x + triangle.dx / 2, point1.y - 12, `dx = ${fmtSigned(triangle.dx)}`, "rgba(96, 165, 250, 0.95)");
  labelSegment(ctx, corner.x + 12, point1.y + triangle.dy / 2, `dy = ${fmtSigned(triangle.dy)}`, "rgba(125, 211, 252, 0.95)");
  labelSegment(ctx, point1.x + triangle.dx / 2, point1.y + triangle.dy / 2 - 16, `hyp = ${fmt(d)}`, "rgba(255, 255, 255, 0.95)");
}
