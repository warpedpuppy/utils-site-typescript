// Polygon-collision family (kinds: polygon-point, point-to-polygon,
// rect-to-polygon, polygon-line, polygon-circle, polygon-polygon,
// polygon-to-polygon).
// Moved verbatim from ConstructiveGeometryDemo.tsx (behavior-identical).
import { polygonPoint } from "@utilspalooza/core/CollisionObjectAPI/PolygonPoint";
import { pointToPolygon } from "@utilspalooza/core/PointToPolygon";
import { rectToPolygon } from "@utilspalooza/core/RectToPolygon";
import { polygonLine } from "@utilspalooza/core/CollisionObjectAPI/PolygonLine";
import { polygonCircle } from "@utilspalooza/core/CollisionObjectAPI/PolygonCircle";
import { polygonPolygon } from "@utilspalooza/core/CollisionObjectAPI/PolygonPolygon";
import { polygonToPolygon } from "@utilspalooza/core/PolygonToPolygon";
import { lineLine } from "@utilspalooza/core/CollisionObjectAPI/LineLine";
import { lineCircle } from "@utilspalooza/core/CollisionObjectAPI/LineCircle";
import type { Point } from "@utilspalooza/core";
import type { PolyScene, SceneData } from "./types";
import {
  PAD,
  RECT_POLY_HALF_W,
  RECT_POLY_HALF_H,
  rayCrossings,
  polygonEdges,
  nearestEdge,
  polygonCrossings,
  polyCentroid,
  drawBackdrop,
  drawPolygonShape,
  drawAabbRect,
  drawCircle,
  drawCenter,
  drawPoint,
  drawHeaderBox,
  drawStatusPill,
  labelSegment,
  formatPoint,
  formatCircleObject,
  fmt,
} from "./shared";

export function buildPolygonPointScene(scene: PolyScene): SceneData {
  const { poly1, point } = scene;
  const inside = polygonPoint({ vertices: poly1 }, point);
  const crossings = rayCrossings(poly1, point);
  return {
    call: `polygonPoint({ vertices }, ${formatPoint(point)}) = ${inside}`,
    hint:
      "Drag the point — or grab the polygon itself. A ray is cast to the right and we count how many edges it crosses: an odd count means the point is trapped inside, an even count means it escaped.",
    readouts: [
      { label: "edges", value: String(poly1.length) },
      { label: "ray crossings to the right", value: String(crossings.length) },
      { label: "parity", value: crossings.length % 2 === 1 ? "odd → inside" : "even → outside" },
      { label: "state", value: inside ? "inside!" : "outside", tone: inside ? "live" : undefined },
    ],
  };
}

export function drawPolygonPointScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: PolyScene,
) {
  const { poly1, point } = scene;
  const inside = polygonPoint({ vertices: poly1 }, point);
  const crossings = rayCrossings(poly1, point);

  drawBackdrop(ctx, width, height);
  drawPolygonShape(
    ctx,
    poly1,
    inside ? "#f97316" : "#818cf8",
    inside ? "rgba(249, 115, 22, 0.16)" : "rgba(129, 140, 248, 0.12)",
  );

  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = inside ? "rgba(249, 115, 22, 0.9)" : "rgba(125, 211, 252, 0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(width - PAD, point.y);
  ctx.stroke();
  ctx.setLineDash([]);

  crossings.forEach((c, index) => {
    drawCenter(ctx, c, "#fde68a", 6);
    labelSegment(ctx, c.x, c.y - 14, `#${index + 1}`, "#fde68a");
  });

  drawPoint(ctx, point, "#fb7185", "p");

  drawHeaderBox(ctx, [
    { text: `ray crossings = ${crossings.length}`, color: "#e2e8f0" },
    {
      text: crossings.length % 2 === 1 ? "odd → inside" : "even → outside",
      color: inside ? "#fdba74" : "#cbd5e1",
    },
  ]);
  if (inside) drawStatusPill(ctx, width - 156, 18, "inside!");
}

// ─── COLLISION: pointToPolygon ──────────────────────────────────────────────

export function buildPointToPolygonScene(scene: PolyScene): SceneData {
  const { poly1, point } = scene;
  const inside = pointToPolygon(point.x, point.y, poly1);
  const crossings = rayCrossings(poly1, point);
  return {
    call: `pointToPolygon(${fmt(point.x)}, ${fmt(point.y)}, vertices) = ${inside}`,
    hint:
      "Drag the point — or grab the polygon itself. A ray is cast to the right, and every time that ray crosses an edge the answer flips: outside -> inside -> outside -> inside.",
    readouts: [
      { label: "px", value: fmt(point.x) },
      { label: "py", value: fmt(point.y) },
      { label: "ray crossings", value: crossings.length ? String(crossings.length) : "0" },
      { label: "flip path", value: crossings.length === 0 ? "start outside -> stay outside" : `${Array.from({ length: crossings.length }, (_, index) => index % 2 === 0 ? "inside" : "outside").join(" -> ")}` },
      { label: "parity", value: crossings.length % 2 === 1 ? "odd -> inside" : "even -> outside", tone: "live" },
      { label: "state", value: inside ? "inside!" : "outside", tone: inside ? "live" : undefined },
    ],
  };
}

export function drawPointToPolygonScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: PolyScene,
) {
  const { poly1, point } = scene;
  const inside = pointToPolygon(point.x, point.y, poly1);
  const crossings = rayCrossings(poly1, point);

  drawBackdrop(ctx, width, height);
  drawPolygonShape(
    ctx,
    poly1,
    inside ? "#f97316" : "#818cf8",
    inside ? "rgba(249, 115, 22, 0.16)" : "rgba(129, 140, 248, 0.12)",
  );

  // Ray to the right edge
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = inside ? "rgba(249, 115, 22, 0.9)" : "rgba(125, 211, 252, 0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(width - PAD, point.y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Highlight each crossed edge and mark the crossing point
  const edgeList = polygonEdges(poly1);
  edgeList.forEach((edge) => {
    const vc = edge.startPoint, vn = edge.endPoint;
    const straddles = (vc.y > point.y) !== (vn.y > point.y);
    const cx = ((vn.x - vc.x) * (point.y - vc.y)) / (vn.y - vc.y) + vc.x;
    if (straddles && cx > point.x) {
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(vc.x, vc.y);
      ctx.lineTo(vn.x, vn.y);
      ctx.stroke();
    }
  });

  crossings.forEach((c, index) => {
    drawCenter(ctx, c, "#fde68a", 6);
    labelSegment(ctx, c.x, c.y - 14, `#${index + 1}`, "#fde68a");
    if (index < crossings.length - 1) {
      const nextLabel = index % 2 === 0 ? "inside" : "outside";
      labelSegment(ctx, c.x + 22, c.y + 16, nextLabel, "#fdba74");
    } else {
      labelSegment(ctx, c.x + 28, c.y + 16, inside ? "inside" : "outside", "#fdba74");
    }
  });

  // Coordinate labels next to the point
  labelSegment(ctx, point.x + 14, point.y - 8, `(${fmt(point.x)}, ${fmt(point.y)})`, "#fb7185");
  drawPoint(ctx, point, "#fb7185", "p");

  drawHeaderBox(ctx, [
    { text: `ray crossings = ${crossings.length}`, color: "#e2e8f0" },
    {
      text: crossings.length === 0 ? "no crossings: the ray never flips" : "each crossing flips the answer once",
      color: inside ? "#fb923c" : "#cbd5e1",
    },
    {
      text: crossings.length % 2 === 1 ? "odd -> inside" : "even -> outside",
      color: inside ? "#fdba74" : "#cbd5e1",
    },
  ]);
  if (inside) drawStatusPill(ctx, width - 156, 18, "inside!");
}

// ─── COLLISION: rectToPolygon ───────────────────────────────────────────────

export function rectPolyChecks(scene: PolyScene) {
  const { poly1, point } = scene;
  const rx = point.x - RECT_POLY_HALF_W, ry = point.y - RECT_POLY_HALF_H;
  const rw = RECT_POLY_HALF_W * 2, rh = RECT_POLY_HALF_H * 2;
  const rx2 = rx + rw, ry2 = ry + rh;

  const corners: Point[] = [
    { x: rx, y: ry }, { x: rx2, y: ry }, { x: rx2, y: ry2 }, { x: rx, y: ry2 },
  ];
  const vertsInRect = poly1.filter((v) => v.x >= rx && v.x <= rx2 && v.y >= ry && v.y <= ry2);
  const cornersInPoly = corners.filter((c) => polygonPoint({ vertices: poly1 }, c));

  const rectEdges: { startPoint: Point; endPoint: Point }[] = [
    { startPoint: corners[0], endPoint: corners[1] },
    { startPoint: corners[1], endPoint: corners[2] },
    { startPoint: corners[2], endPoint: corners[3] },
    { startPoint: corners[3], endPoint: corners[0] },
  ];
  const edgeCrossings: Point[] = [];
  for (const pe of polygonEdges(poly1)) {
    for (const re of rectEdges) {
      const r = lineLine(pe, re);
      if (r.hit && r.intersectionX !== undefined && r.intersectionY !== undefined) {
        const next = { x: r.intersectionX, y: r.intersectionY };
        const alreadySeen = edgeCrossings.some((p) => Math.hypot(p.x - next.x, p.y - next.y) < 0.5);
        if (!alreadySeen) edgeCrossings.push(next);
      }
    }
  }

  const hit = rectToPolygon(rx, ry, rw, rh, poly1);
  const primaryCheck =
    vertsInRect.length > 0 ? 1 :
      cornersInPoly.length > 0 ? 2 :
        edgeCrossings.length > 0 ? 3 : 0;
  const primaryLabel =
    primaryCheck === 1 ? "polygon vertex inside rect" :
      primaryCheck === 2 ? "rect corner inside polygon" :
        primaryCheck === 3 ? "polygon edge crosses rect edge" :
          "no overlap yet";
  return { rx, ry, rw, rh, corners, vertsInRect, cornersInPoly, edgeCrossings, hit, primaryCheck, primaryLabel };
}

export function buildRectToPolygonScene(scene: PolyScene): SceneData {
  const { rx, ry, rw, rh, vertsInRect, cornersInPoly, edgeCrossings, hit, primaryCheck, primaryLabel } = rectPolyChecks(scene);
  const primaryStep =
    primaryCheck === 1 ? "1 · polygon vertex in rect" :
      primaryCheck === 2 ? "2 · rect corner in polygon" :
        primaryCheck === 3 ? "3 · polygon edge crosses rect edge" :
          "no winning step";
  return {
    call: `rectToPolygon(${fmt(rx)}, ${fmt(ry)}, ${fmt(rw)}, ${fmt(rh)}, vertices) = ${hit}`,
    hint:
      "Drag the rectangle — or grab the polygon. The demo follows the real function's order: first look for a polygon vertex inside the rect, then a rect corner inside the polygon, then edge crossings. The first live reason is the one that wins.",
    readouts: [
      { label: "1 · vertex in rect", value: vertsInRect.length ? `yes (${vertsInRect.length})` : "no", tone: primaryCheck === 1 ? "live" : undefined },
      { label: "2 · corner in poly", value: cornersInPoly.length ? `yes (${cornersInPoly.length})` : "no", tone: primaryCheck === 2 ? "live" : undefined },
      { label: "3 · edge crossing", value: edgeCrossings.length ? `yes (${edgeCrossings.length})` : "no", tone: primaryCheck === 3 ? "live" : undefined },
      { label: "winning step", value: primaryCheck ? `${primaryStep}` : primaryLabel, tone: hit ? "live" : undefined },
      { label: "state", value: hit ? "overlapping!" : "separated", tone: hit ? "live" : undefined },
    ],
  };
}

export function drawRectToPolygonScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: PolyScene,
) {
  const { poly1 } = scene;
  const { rx, ry, rw, rh, corners, vertsInRect, cornersInPoly, edgeCrossings, hit, primaryCheck, primaryLabel } = rectPolyChecks(scene);
  const primaryColor =
    primaryCheck === 1 ? "#fde68a" :
      primaryCheck === 2 ? "#86efac" :
        primaryCheck === 3 ? "#f97316" :
          "#cbd5e1";

  drawBackdrop(ctx, width, height);
  drawPolygonShape(
    ctx,
    poly1,
    hit ? "#f97316" : "#818cf8",
    hit ? "rgba(249, 115, 22, 0.16)" : "rgba(129, 140, 248, 0.12)",
  );
  drawAabbRect(ctx, rx, ry, rw, rh, hit ? "#fb7185" : "#a78bfa");

  corners.forEach((corner) => {
    drawCenter(ctx, corner, "rgba(226, 232, 240, 0.45)", 3);
  });

  // Check 1 — polygon vertices that fall inside the rect
  vertsInRect.forEach((v, index) => {
    drawCenter(ctx, v, primaryCheck === 1 ? "#fde68a" : "rgba(253, 230, 138, 0.35)", primaryCheck === 1 ? 6 : 3);
    if (primaryCheck === 1) labelSegment(ctx, v.x, v.y - 14, `v${index + 1}`, "#fde68a");
  });
  // Check 2 — rect corners that fall inside the polygon
  cornersInPoly.forEach((c, index) => {
    drawCenter(ctx, c, primaryCheck === 2 ? "#86efac" : "rgba(134, 239, 172, 0.35)", primaryCheck === 2 ? 6 : 3);
    if (primaryCheck === 2) labelSegment(ctx, c.x, c.y - 14, `c${index + 1}`, "#86efac");
  });
  // Check 3 — edge crossings
  edgeCrossings.forEach((c, index) => {
    drawCenter(ctx, c, primaryCheck === 3 ? "#f97316" : "rgba(249, 115, 22, 0.35)", primaryCheck === 3 ? 5 : 3);
    if (primaryCheck === 3) labelSegment(ctx, c.x, c.y - 14, `x${index + 1}`, "#f97316");
  });

  labelSegment(ctx, scene.point.x, scene.point.y, "rect", hit ? "#fb7185" : "#a78bfa");

  drawHeaderBox(ctx, [
    { text: `1 vertex ${vertsInRect.length} · 2 corner ${cornersInPoly.length} · 3 cross ${edgeCrossings.length}`, color: "#e2e8f0" },
    { text: primaryCheck ? `first winner: ${primaryLabel}` : primaryLabel, color: hit ? primaryColor : "#cbd5e1" },
    { text: hit ? "overlapping!" : "separated", color: hit ? "#fdba74" : "#cbd5e1" },
  ]);
  if (hit) drawStatusPill(ctx, width - 156, 18, "overlapping!");
}

// ─── COLLISION: polygonLine ──────────────────────────────────────────────────

export function buildPolygonLineScene(scene: PolyScene): SceneData {
  const { poly1, lineA, lineB } = scene;
  const line = { startPoint: lineA, endPoint: lineB };
  const hit = polygonLine({ vertices: poly1 }, line);
  const edges = polygonEdges(poly1);
  const crossedEdges = edges
    .map((edge, index) => ({ edge, index, result: lineLine(line, edge) }))
    .filter((entry) => entry.result.hit);
  const firstHit = crossedEdges[0];
  return {
    call: `polygonLine({ vertices }, { startPoint, endPoint }) = ${hit}`,
    hint:
      "Drag the segment endpoints — or grab the polygon. The real function walks the polygon edges in order and returns on the first `lineLine` hit. It does not test for a segment that sits fully inside the polygon without crossing an edge.",
    readouts: [
      { label: "edges tested", value: String(edges.length) },
      { label: "edges crossed", value: crossedEdges.length ? `yes (${crossedEdges.length})` : "no" },
      { label: "winning edge", value: firstHit ? `edge ${firstHit.index + 1}` : "none", tone: hit ? "live" : undefined },
      { label: "state", value: hit ? "crossing!" : "no crossing", tone: hit ? "live" : undefined },
    ],
  };
}

export function drawPolygonLineScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: PolyScene,
) {
  const { poly1, lineA, lineB } = scene;
  const line = { startPoint: lineA, endPoint: lineB };
  const hit = polygonLine({ vertices: poly1 }, line);
  const edges = polygonEdges(poly1);
  const crossedEdges = edges
    .map((edge, index) => ({ edge, index, result: lineLine(line, edge) }))
    .filter((entry) => entry.result.hit);
  const firstHit = crossedEdges[0];

  drawBackdrop(ctx, width, height);
  drawPolygonShape(
    ctx,
    poly1,
    hit ? "#f97316" : "#818cf8",
    hit ? "rgba(249, 115, 22, 0.1)" : "rgba(129, 140, 248, 0.1)",
  );

  crossedEdges.forEach(({ edge, index, result }) => {
    const isPrimary = firstHit?.index === index;
    ctx.strokeStyle = isPrimary ? "#f97316" : "rgba(249, 115, 22, 0.45)";
    ctx.lineWidth = isPrimary ? 4 : 2.5;
    ctx.beginPath();
    ctx.moveTo(edge.startPoint.x, edge.startPoint.y);
    ctx.lineTo(edge.endPoint.x, edge.endPoint.y);
    ctx.stroke();

    if (result.intersectionX !== undefined && result.intersectionY !== undefined) {
      drawCenter(ctx, { x: result.intersectionX, y: result.intersectionY }, isPrimary ? "#fde68a" : "rgba(253, 230, 138, 0.7)", isPrimary ? 6 : 5);
      if (isPrimary) labelSegment(ctx, result.intersectionX, result.intersectionY - 14, `edge ${index + 1}`, "#fde68a");
    }
  });

  ctx.strokeStyle = hit ? "#fb7185" : "#a78bfa";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(lineA.x, lineA.y);
  ctx.lineTo(lineB.x, lineB.y);
  ctx.stroke();

  drawCenter(ctx, lineA, "#a78bfa", 7);
  labelSegment(ctx, lineA.x - 20, lineA.y - 10, "a", "#a78bfa");
  drawCenter(ctx, lineB, "#a78bfa", 7);
  labelSegment(ctx, lineB.x + 18, lineB.y - 10, "b", "#a78bfa");

  drawHeaderBox(ctx, [
    { text: `tests ${edges.length} polygon edges`, color: "#e2e8f0" },
    { text: firstHit ? `first hit: edge ${firstHit.index + 1}` : "first hit: none", color: hit ? "#c4b5fd" : "#cbd5e1" },
    { text: hit ? "only edge crossings count here" : "contained-without-crossing still returns false", color: hit ? "#fdba74" : "#cbd5e1" },
  ]);
  if (hit) drawStatusPill(ctx, width - 156, 18, "crossing!");
}

// ─── COLLISION: polygonCircle ────────────────────────────────────────────────

export function buildPolygonCircleScene(scene: PolyScene): SceneData {
  const { poly1, circle } = scene;
  const hit = polygonCircle({ vertices: poly1 }, circle);
  const edges = polygonEdges(poly1);
  const touching = edges.filter((edge) => lineCircle(edge, circle)).length;
  const centerInside = polygonPoint({ vertices: poly1 }, { x: circle.x, y: circle.y });
  const nearest = nearestEdge(poly1, { x: circle.x, y: circle.y });
  const primaryReason =
    touching > 0 ? "edge touch via lineCircle" :
      centerInside ? "center inside polygon" :
        "clear";
  return {
    call: `polygonCircle({ vertices }, ${formatCircleObject(circle)}) = ${hit}`,
    hint:
      "Drag the circle — or grab the polygon. The real function checks edges first with `lineCircle`, then falls back to the circle center being inside the polygon. The winning reason is surfaced live here.",
    readouts: [
      { label: "nearest edge distance", value: `${fmt(nearest.dist)} vs radius ${fmt(circle.radius)}` },
      { label: "edges touched", value: touching ? `yes (${touching})` : "no", tone: touching ? "live" : undefined },
      { label: "center inside polygon", value: centerInside ? "yes" : "no", tone: !touching && centerInside ? "live" : undefined },
      { label: "winning reason", value: primaryReason, tone: hit ? "live" : undefined },
      { label: "state", value: hit ? "touching!" : "clear", tone: hit ? "live" : undefined },
    ],
  };
}

export function drawPolygonCircleScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: PolyScene,
) {
  const { poly1, circle } = scene;
  const hit = polygonCircle({ vertices: poly1 }, circle);
  const edges = polygonEdges(poly1);
  const centerInside = polygonPoint({ vertices: poly1 }, { x: circle.x, y: circle.y });
  const nearest = nearestEdge(poly1, { x: circle.x, y: circle.y });
  const touchedEdges = edges.filter((edge) => lineCircle(edge, circle));
  const primaryReason =
    touchedEdges.length > 0 ? "edge touch via lineCircle" :
      centerInside ? "center inside polygon" :
        "clear";
  const color = hit ? "#f97316" : "#818cf8";

  drawBackdrop(ctx, width, height);
  drawPolygonShape(
    ctx,
    poly1,
    centerInside ? "#fb7185" : hit ? "#f97316" : "#a78bfa",
    centerInside ? "rgba(249, 115, 22, 0.2)" : "rgba(129, 140, 248, 0.1)",
  );

  edges.forEach((edge) => {
    const touched = touchedEdges.includes(edge);
    if (touched) {
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(edge.startPoint.x, edge.startPoint.y);
      ctx.lineTo(edge.endPoint.x, edge.endPoint.y);
      ctx.stroke();
    }
  });

  drawCircle(ctx, circle, color, "r");

  ctx.setLineDash([5, 5]);
  ctx.strokeStyle =
    touchedEdges.length > 0 ? "rgba(249, 115, 22, 0.9)" :
      centerInside ? "rgba(251, 146, 60, 0.9)" :
        "rgba(255, 255, 255, 0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(circle.x, circle.y);
  ctx.lineTo(nearest.point.x, nearest.point.y);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCenter(ctx, circle, color, 5);
  drawCenter(ctx, nearest.point, "#fde68a", 6);
  labelSegment(
    ctx,
    (circle.x + nearest.point.x) / 2,
    (circle.y + nearest.point.y) / 2 - 12,
    `d = ${fmt(nearest.dist)}`,
    touchedEdges.length > 0 ? "#fdba74" : centerInside ? "#fb923c" : "rgba(255,255,255,0.85)",
  );
  if (centerInside && touchedEdges.length === 0) {
    labelSegment(ctx, circle.x + 26, circle.y - 12, "center inside", "#fb923c");
  }

  drawHeaderBox(ctx, [
    { text: `nearest edge d = ${fmt(nearest.dist)} vs r = ${fmt(circle.radius)}`, color: "#e2e8f0" },
    {
      text:
        touchedEdges.length > 0
          ? `edge touch wins before the inside fallback`
          : centerInside
            ? "no edge touch, but center-inside still counts"
            : "no edge touch and center stays outside",
      color: hit ? "#fb923c" : "#cbd5e1",
    },
    { text: `winning reason: ${primaryReason}`, color: hit ? "#c4b5fd" : "#cbd5e1" },
  ]);
  if (hit) drawStatusPill(ctx, width - 156, 18, "touching!");
}

// ─── COLLISION: polygonPolygon / polygonToPolygon ────────────────────────────

export function buildPolygonPolygonScene(
  scene: PolyScene,
  fnName: "polygonPolygon" | "polygonToPolygon",
): SceneData {
  const { poly1, poly2 } = scene;
  const hit =
    fnName === "polygonToPolygon"
      ? polygonToPolygon(poly1, poly2)
      : polygonPolygon({ vertices: poly1 }, { vertices: poly2 });
  const crossings = polygonCrossings(poly1, poly2).length;
  const v1in2 = poly1.filter((v) => polygonPoint({ vertices: poly2 }, v)).length;
  const v2in1 = poly2.filter((v) => polygonPoint({ vertices: poly1 }, v)).length;
  const edgeOnlyMiss = fnName === "polygonToPolygon" && !hit && crossings > 0;
  const primaryReason =
    crossings > 0 ? "edge crossing found first" :
      v1in2 > 0 ? "poly1 corner inside poly2" :
        v2in1 > 0 ? "poly2 corner inside poly1" :
          "no overlap evidence";

  if (fnName === "polygonToPolygon") {
    return {
      call: `polygonToPolygon(poly1, poly2) = ${hit}`,
      hint:
        "Drag either polygon. This lighter test only asks whether any corner of one polygon sits inside the other — fast, but it can miss an edge-only crossing where no corner is contained. Watch the two readouts disagree.",
      readouts: [
        { label: "poly1 corners inside poly2", value: String(v1in2) },
        { label: "poly2 corners inside poly1", value: String(v2in1) },
        { label: "edge crossings (NOT tested here)", value: String(crossings) },
        { label: "verdict", value: edgeOnlyMiss ? "missed edge-only crossing" : hit ? "corner caught overlap" : "no contained corners" },
        { label: "state", value: hit ? "overlapping!" : "separated", tone: hit ? "live" : undefined },
      ],
    };
  }

  return {
    call: `polygonPolygon({ vertices: poly1 }, { vertices: poly2 }) = ${hit}`,
    hint:
      "Drag either polygon. This fuller test has a real order: edge crossings win first, then containment catches the cases with no crossed edges. The scene surfaces that first winning reason live.",
    readouts: [
      { label: "edge crossings", value: crossings ? `yes (${crossings})` : "no", tone: crossings ? "live" : undefined },
      { label: "poly1 corners in poly2", value: v1in2 ? `yes (${v1in2})` : "no", tone: !crossings && v1in2 ? "live" : undefined },
      { label: "poly2 corners in poly1", value: v2in1 ? `yes (${v2in1})` : "no", tone: !crossings && !v1in2 && v2in1 ? "live" : undefined },
      { label: "winning reason", value: primaryReason, tone: hit ? "live" : undefined },
      { label: "state", value: hit ? "overlapping!" : "separated", tone: hit ? "live" : undefined },
    ],
  };
}

export function drawPolygonPolygonScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: PolyScene,
  fnName: "polygonPolygon" | "polygonToPolygon",
) {
  const { poly1, poly2 } = scene;
  const hit =
    fnName === "polygonToPolygon"
      ? polygonToPolygon(poly1, poly2)
      : polygonPolygon({ vertices: poly1 }, { vertices: poly2 });
  const crossings = polygonCrossings(poly1, poly2);
  const contained1 = poly1.filter((v) => polygonPoint({ vertices: poly2 }, v));
  const contained2 = poly2.filter((v) => polygonPoint({ vertices: poly1 }, v));
  const edgeOnlyMiss = fnName === "polygonToPolygon" && !hit && crossings.length > 0;
  const primaryReason =
    crossings.length > 0 ? "edge crossing found first" :
      contained1.length > 0 ? "poly1 corner inside poly2" :
        contained2.length > 0 ? "poly2 corner inside poly1" :
          "no overlap evidence";

  drawBackdrop(ctx, width, height);
  drawPolygonShape(
    ctx,
    poly1,
    hit ? "#f97316" : "#818cf8",
    hit ? "rgba(249, 115, 22, 0.1)" : "rgba(129, 140, 248, 0.1)",
  );
  drawPolygonShape(
    ctx,
    poly2,
    hit ? "#fb7185" : "#a78bfa",
    hit ? "rgba(251, 113, 133, 0.12)" : "rgba(167, 139, 250, 0.1)",
  );

  // Highlight contained corners (the only thing polygonToPolygon looks at).
  contained1.forEach((v, index) => {
    const isPrimary = fnName === "polygonPolygon" && crossings.length === 0;
    drawCenter(ctx, v, isPrimary ? "#fde68a" : "rgba(253, 230, 138, 0.6)", isPrimary ? 6 : 5);
    if (fnName === "polygonToPolygon" || isPrimary) labelSegment(ctx, v.x, v.y - 14, `p1:${index + 1}`, "#fde68a");
  });
  contained2.forEach((v, index) => {
    const isPrimary = fnName === "polygonPolygon" && crossings.length === 0 && contained1.length === 0;
    drawCenter(ctx, v, isPrimary ? "#fde68a" : "rgba(253, 230, 138, 0.6)", isPrimary ? 6 : 5);
    if (fnName === "polygonToPolygon" || isPrimary) labelSegment(ctx, v.x, v.y - 14, `p2:${index + 1}`, "#fde68a");
  });

  // Mark edge crossings (what polygonPolygon adds on top).
  crossings.forEach((c, index) => {
    const isPrimary = fnName === "polygonPolygon" || edgeOnlyMiss;
    drawCenter(ctx, c, edgeOnlyMiss ? "#f97316" : isPrimary ? "#fb923c" : "rgba(251, 146, 60, 0.6)", isPrimary ? 6 : 5);
    if (edgeOnlyMiss || fnName === "polygonPolygon") labelSegment(ctx, c.x, c.y - 14, `x${index + 1}`, edgeOnlyMiss ? "#f97316" : "#fb923c");
  });

  labelSegment(ctx, polyCentroid(poly1).x, polyCentroid(poly1).y, "poly1", hit ? "#f97316" : "#818cf8");
  labelSegment(ctx, polyCentroid(poly2).x, polyCentroid(poly2).y, "poly2", hit ? "#fb7185" : "#a78bfa");

  drawHeaderBox(ctx, [
    {
      text: fnName === "polygonToPolygon" ? "corner-inside test" : "edge-cross + containment",
      color: "#e2e8f0",
    },
    ...(fnName === "polygonToPolygon"
      ? [{
        text: edgeOnlyMiss ? "edges cross, but this function misses that case" : hit ? "a corner landed inside, so this one succeeds" : "no corners landed inside",
        color: edgeOnlyMiss ? "#f97316" : hit ? "#fdba74" : "#cbd5e1",
      }]
      : [{
        text: `winning reason: ${primaryReason}`,
        color: hit ? (crossings.length > 0 ? "#fb923c" : "#fde68a") : "#cbd5e1",
      }]),
    { text: hit ? "overlapping!" : "separated", color: hit ? "#fdba74" : "#cbd5e1" },
  ]);
  if (hit) drawStatusPill(ctx, width - 156, 18, "overlapping!");
  if (edgeOnlyMiss) drawStatusPill(ctx, width - 176, 18, "missed here");
}
