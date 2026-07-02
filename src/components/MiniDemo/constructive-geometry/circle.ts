// Circle-to-circle collision family (kinds: "circle-to-circle", "circle-circle").
// Moved verbatim from ConstructiveGeometryDemo.tsx (behavior-identical).
import { distance } from "@utilspalooza/core/Distance";
import { getTriangleData } from "@utilspalooza/core/GetTriangleData";
import type { CirclePair, SceneData } from "./types";
import type { ConstructiveGeometryDemoDef } from "../constructiveGeometryDemos";
import {
  formatCircleObject,
  fmt,
  fmtSigned,
  fmtAbs,
  drawBackdrop,
  drawCircle,
  drawRightTriangle,
  drawCenter,
  drawHeaderBox,
  labelSegment,
  drawStatusPill,
} from "./shared";

export function buildCircleScene(demo: ConstructiveGeometryDemoDef, circles: CirclePair): SceneData {
  const { circle1, circle2 } = circles;
  const centerDistance = distance(circle1, circle2);
  const triangle = getTriangleData(circle1, circle2);
  const sumRadius = circle1.radius + circle2.radius;
  const hit = demo.hitTest ? demo.hitTest(circle1, circle2) : false;

  return {
    call:
      demo.kind === "circle-circle"
        ? `${demo.fnName}(${formatCircleObject(circle1)}, ${formatCircleObject(circle2)}) = ${hit}`
        : `${demo.fnName}(${fmt(circle1.x)}, ${fmt(circle1.y)}, ${fmt(circle1.radius)}, ${fmt(circle2.x)}, ${fmt(circle2.y)}, ${fmt(circle2.radius)}) = ${hit}`,
    hint:
      "Drag either circle. The right triangle shows how the center-to-center distance is derived, then the demo compares that distance against r1 + r2.",
    readouts: [
      { label: "dx", value: fmtSigned(triangle.dx) },
      { label: "dy", value: fmtSigned(triangle.dy) },
      { label: "distance", value: `√(${fmtAbs(triangle.dx)}² + ${fmtAbs(triangle.dy)}²) = ${fmt(centerDistance)}` },
      { label: "compare", value: `${fmt(centerDistance)} ${centerDistance <= sumRadius ? "<=" : ">"} ${fmt(sumRadius)}` },
      { label: "state", value: hit ? "touching!" : "not touching yet", tone: hit ? "live" : undefined },
    ],
  };
}

export function drawCircleScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  circles: CirclePair,
  hit: boolean,
) {
  const { circle1, circle2 } = circles;
  const corner = { x: circle2.x, y: circle1.y };
  const dx = circle2.x - circle1.x;
  const dy = circle2.y - circle1.y;
  const dist = distance(circle1, circle2);
  const sumRadius = circle1.radius + circle2.radius;

  drawBackdrop(ctx, width, height);

  const circle1Color = hit ? "#f97316" : "#818cf8";
  const circle2Color = hit ? "#fb7185" : "#a78bfa";

  drawCircle(ctx, circle1, circle1Color, "r1");
  drawCircle(ctx, circle2, circle2Color, "r2");
  drawRightTriangle(ctx, circle1, circle2, corner, hit);
  drawCenter(ctx, circle1, circle1Color);
  drawCenter(ctx, circle2, circle2Color);
  drawCenter(ctx, corner, "rgba(125, 211, 252, 0.8)", 4);

  drawHeaderBox(ctx, [
    { text: `distance = ${fmt(dist)}`, color: "#e2e8f0" },
    { text: `compare against r1 + r2 = ${fmt(sumRadius)}`, color: hit ? "#fb923c" : "#cbd5e1" },
  ]);

  labelSegment(ctx, circle1.x + dx / 2, circle1.y - 12, `dx = ${fmtSigned(dx)}`, "rgba(96, 165, 250, 0.95)");
  labelSegment(ctx, corner.x + 12, circle1.y + dy / 2, `dy = ${fmtSigned(dy)}`, "rgba(125, 211, 252, 0.95)");
  labelSegment(
    ctx,
    circle1.x + dx / 2,
    circle1.y + dy / 2 - 16,
    `hyp = ${fmt(dist)}`,
    hit ? "rgba(249, 115, 22, 0.98)" : "rgba(255, 255, 255, 0.95)",
  );

  if (hit) {
    drawStatusPill(ctx, width - 156, 18, "touching!");
  }
}
