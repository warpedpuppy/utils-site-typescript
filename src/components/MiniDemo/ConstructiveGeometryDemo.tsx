import { useEffect, useMemo, useRef, useState } from "react";
import { distance } from "@utilspalooza/core/Distance";
import { polygonPoint } from "@utilspalooza/core/CollisionObjectAPI/PolygonPoint";
import { pointToPolygon } from "@utilspalooza/core/PointToPolygon";
import { rectToPolygon } from "@utilspalooza/core/RectToPolygon";
import { polygonLine } from "@utilspalooza/core/CollisionObjectAPI/PolygonLine";
import { polygonCircle } from "@utilspalooza/core/CollisionObjectAPI/PolygonCircle";
import { polygonPolygon } from "@utilspalooza/core/CollisionObjectAPI/PolygonPolygon";
import { polygonToPolygon } from "@utilspalooza/core/PolygonToPolygon";
import { lineLine } from "@utilspalooza/core/CollisionObjectAPI/LineLine";
import { lineCircle } from "@utilspalooza/core/CollisionObjectAPI/LineCircle";
import { getTriangleData } from "@utilspalooza/core/GetTriangleData";
import { unitCirclePoint } from "@utilspalooza/core/UnitCirclePoint";
import type { Circle, Point, Vector } from "@utilspalooza/core";
import type { ConstructiveGeometryDemoDef } from "./constructiveGeometryDemos";
import type {
  CirclePair,
  PointPair,
  HandlePair,
  RailControls,
  PolyScene,
  DragState,
  ReadoutRow,
  SceneData,
} from "./constructive-geometry/types";
import {
  PAD,
  RECT_HALF_W,
  RECT_HALF_H,
  RECT_POLY_HALF_W,
  RECT_POLY_HALF_H,
  LINE_POINT_THRESHOLD,
  regularPolygon,
  polygonEdges,
  polyCentroid,
  translatePolygonTo,
  rayCrossings,
  polygonCrossings,
  nearestEdge,
  drawPolygonShape,
  drawAabbRect,
  drawBackdrop,
  drawAxes,
  drawRightTriangle,
  drawHeaderBox,
  drawStatusPill,
  drawCircle,
  drawPoint,
  drawOrigin,
  drawVector,
  drawComponentGuides,
  drawUnitCircle,
  drawAngleArc,
  drawAngleArcBetween,
  drawParallelogram,
  drawRail,
  drawCenter,
  labelSegment,
  getCanvasPoint,
  clampCircle,
  clampPoint,
  vectorFromHandle,
  handleFromVector,
  unitCircleLayout,
  snapPointToCircle,
  dotReading,
  crossReading,
  railPosition,
  railValueForPosition,
  clamp,
  formatPoint,
  formatCircleObject,
  formatVector,
  fmt,
  fmtSigned,
  fmtAbs,
  radToDeg,
  normalizeCycleAngle,
  normalizeCycleFraction,
} from "./constructive-geometry/shared";
import { buildCircleScene, drawCircleScene } from "./constructive-geometry/circle";
import { buildDistanceScene, drawDistanceScene } from "./constructive-geometry/distance";
import {
  buildUnitCirclePointScene,
  buildSineWaveScene,
  buildSineCurveScene,
  buildWaveAmplitudeScene,
  drawUnitCirclePointScene,
  drawSineWaveScene,
  drawSineCurveScene,
  drawWaveAmplitudeScene,
} from "./constructive-geometry/trig";
import {
  buildVecScaleScene,
  buildVecMagnitudeScene,
  buildVecMagnitudeSquaredScene,
  buildVecNormalizeScene,
  buildVecAngleScene,
  buildVecPerpendicularScene,
  drawSingleVectorScene,
  drawScaleScene,
} from "./constructive-geometry/vectors-single";
import {
  buildVecAddScene,
  buildVecSubtractScene,
  buildVecDotScene,
  buildVecCrossScene,
  buildVecAngleBetweenScene,
  buildVecLerpScene,
  buildVecLimitScene,
  drawDualVectorResultScene,
  drawDualVectorScene,
  drawLerpScene,
  drawLimitScene,
} from "./constructive-geometry/vectors-dual";
import {
  buildGetRotationScene,
  drawGetRotationScene,
  buildLerpAngleScene,
  drawLerpAngleScene,
} from "./constructive-geometry/angles";
import {
  buildPointToCircleScene,
  drawPointToCircleScene,
  buildPointToRectScene,
  drawPointToRectScene,
  buildLineToPointScene,
  drawLineToPointScene,
  buildCircleToRectScene,
  drawCircleToRectScene,
  buildRectToRectScene,
  drawRectToRectScene,
  buildLineToCircleScene,
  drawLineToCircleScene,
  buildLineToLineScene,
  drawLineToLineScene,
  buildLineToRectScene,
  drawLineToRectScene,
} from "./constructive-geometry/collision-simple";
import "./MiniDemo.scss";

interface ConstructiveGeometryDemoProps {
  demo: ConstructiveGeometryDemoDef;
  height?: number;
}

export default function ConstructiveGeometryDemo({
  demo,
  height = 248,
}: ConstructiveGeometryDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const [size, setSize] = useState({ width: 480, height });
  const [circles, setCircles] = useState<CirclePair>({
    circle1: { x: 156, y: 124, radius: 72 },
    circle2: { x: 330, y: 164, radius: 56 },
  });
  const [points, setPoints] = useState<PointPair>({
    point1: { x: 150, y: 154 },
    point2: { x: 330, y: 84 },
  });
  const [handles, setHandles] = useState<HandlePair>({
    a: { x: 320, y: 98 },
    b: { x: 314, y: 176 },
  });
  const [controls, setControls] = useState<RailControls>({
    scale: 1.5,
    lerp: 0.5,
    limit: 90,
    phase: 0.15,
    waveTime: 18,
  });
  const [polyScene, setPolyScene] = useState<PolyScene>(() => ({
    poly1: regularPolygon(215, 118, 60, 5, -Math.PI / 2),
    poly2: regularPolygon(348, 128, 54, 4, -Math.PI / 4),
    point: { x: 100, y: 150 },
    circle: { x: 108, y: 120, radius: 38 },
    lineA: { x: 70, y: 72 },
    lineB: { x: 360, y: 182 },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const fit = () => {
      const nextWidth = canvas.clientWidth || 480;
      setSize({ width: nextWidth, height });
    };

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [height]);

  useEffect(() => {
    setCircles((current) => ({
      circle1: clampCircle(current.circle1, size.width, size.height),
      circle2: clampCircle(current.circle2, size.width, size.height),
    }));
    setPoints((current) => ({
      point1: clampPoint(current.point1, size.width, size.height),
      point2: clampPoint(current.point2, size.width, size.height),
    }));
    setHandles((current) => ({
      a: clampPoint(current.a, size.width, size.height),
      b: clampPoint(current.b, size.width, size.height),
    }));
  }, [size.height, size.width]);

  const origin = useMemo<Point>(
    () => ({ x: Math.round(size.width * 0.34), y: Math.round(size.height * 0.62) }),
    [size.height, size.width],
  );

  const scene = useMemo<SceneData>(() => {
    switch (demo.kind) {
      case "circle-to-circle":
      case "circle-circle":
        return buildCircleScene(demo, circles);
      case "distance":
        return buildDistanceScene(points);
      case "unit-circle-point":
        return buildUnitCirclePointScene(size.width, size.height, handles.a);
      case "sine-curve":
        return buildSineCurveScene(size.width, size.height, handles.a);
      case "sine-wave":
        return buildSineWaveScene(size.width, size.height, handles.a, controls.phase);
      case "wave-amplitude":
        return buildWaveAmplitudeScene(points.point1, handles, controls.waveTime);
      case "vec-add":
        return buildVecAddScene(origin, handles);
      case "vec-subtract":
        return buildVecSubtractScene(origin, handles);
      case "vec-scale":
        return buildVecScaleScene(origin, handles.a, controls.scale);
      case "vec-magnitude":
        return buildVecMagnitudeScene(origin, handles.a);
      case "vec-magnitude-squared":
        return buildVecMagnitudeSquaredScene(origin, handles.a);
      case "vec-normalize":
        return buildVecNormalizeScene(origin, handles.a);
      case "vec-angle":
        return buildVecAngleScene(origin, handles.a);
      case "vec-dot":
        return buildVecDotScene(origin, handles);
      case "vec-cross":
        return buildVecCrossScene(origin, handles);
      case "vec-angle-between":
        return buildVecAngleBetweenScene(origin, handles);
      case "vec-perpendicular":
        return buildVecPerpendicularScene(origin, handles.a);
      case "vec-lerp":
        return buildVecLerpScene(origin, handles, controls.lerp);
      case "vec-limit":
        return buildVecLimitScene(origin, handles.a, controls.limit);
      case "lerp-angle":
        return buildLerpAngleScene(demo, size, handles, controls.lerp);
      case "get-rotation":
        return buildGetRotationScene(points);
      case "point-to-circle":
        return buildPointToCircleScene(points, circles);
      case "point-to-rect":
        return buildPointToRectScene(points);
      case "line-to-point":
        return buildLineToPointScene(handles, points);
      case "circle-to-rect":
        return buildCircleToRectScene(circles, points);
      case "rect-to-rect":
        return buildRectToRectScene(points);
      case "line-to-circle":
        return buildLineToCircleScene(handles, circles);
      case "line-to-line":
        return buildLineToLineScene(handles, points);
      case "line-to-rect":
        return buildLineToRectScene(handles, points);
      case "polygon-point":
        return buildPolygonPointScene(polyScene);
      case "point-to-polygon":
        return buildPointToPolygonScene(polyScene);
      case "rect-to-polygon":
        return buildRectToPolygonScene(polyScene);
      case "polygon-line":
        return buildPolygonLineScene(polyScene);
      case "polygon-circle":
        return buildPolygonCircleScene(polyScene);
      case "polygon-polygon":
        return buildPolygonPolygonScene(polyScene, "polygonPolygon");
      case "polygon-to-polygon":
        return buildPolygonPolygonScene(polyScene, "polygonToPolygon");
    }
  }, [circles, controls, demo, handles, origin, points, polyScene, size]);

  // Resize the canvas buffer only when the logical size changes (not on every drag frame).
  // Setting canvas.width clears the canvas and resets ctx state; doing it every pointer-move
  // caused a visible stutter on every drag event.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.width * dpr;
    canvas.height = size.height * dpr;
  }, [size.width, size.height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Restore the DPR transform each draw (resize effect may have cleared it).
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    switch (demo.kind) {
      case "circle-to-circle":
      case "circle-circle":
        drawCircleScene(ctx, size.width, size.height, circles,
          !!(demo.hitTest?.(circles.circle1, circles.circle2)));
        break;
      case "distance":
        drawDistanceScene(ctx, size.width, size.height, points);
        break;
      case "unit-circle-point":
        drawUnitCirclePointScene(ctx, size.width, size.height, handles.a);
        break;
      case "sine-curve":
        drawSineCurveScene(ctx, size.width, size.height, handles.a);
        break;
      case "sine-wave":
        drawSineWaveScene(ctx, size.width, size.height, handles.a, controls.phase);
        break;
      case "wave-amplitude":
        drawWaveAmplitudeScene(ctx, size.width, size.height, points.point1, handles, controls.waveTime);
        break;
      case "vec-add":
        drawDualVectorResultScene(ctx, size.width, size.height, origin, handles, "add");
        break;
      case "vec-subtract":
        drawDualVectorResultScene(ctx, size.width, size.height, origin, handles, "subtract");
        break;
      case "vec-scale":
        drawScaleScene(ctx, size.width, size.height, origin, handles.a, controls.scale);
        break;
      case "vec-magnitude":
        drawSingleVectorScene(ctx, size.width, size.height, origin, handles.a, "magnitude");
        break;
      case "vec-magnitude-squared":
        drawSingleVectorScene(ctx, size.width, size.height, origin, handles.a, "magnitude-squared");
        break;
      case "vec-normalize":
        drawSingleVectorScene(ctx, size.width, size.height, origin, handles.a, "normalize");
        break;
      case "vec-angle":
        drawSingleVectorScene(ctx, size.width, size.height, origin, handles.a, "angle");
        break;
      case "vec-dot":
        drawDualVectorScene(ctx, size.width, size.height, origin, handles, "dot");
        break;
      case "vec-cross":
        drawDualVectorScene(ctx, size.width, size.height, origin, handles, "cross");
        break;
      case "vec-angle-between":
        drawDualVectorScene(ctx, size.width, size.height, origin, handles, "angle-between");
        break;
      case "vec-perpendicular":
        drawSingleVectorScene(ctx, size.width, size.height, origin, handles.a, "perpendicular");
        break;
      case "vec-lerp":
        drawLerpScene(ctx, size.width, size.height, origin, handles, controls.lerp);
        break;
      case "vec-limit":
        drawLimitScene(ctx, size.width, size.height, origin, handles.a, controls.limit);
        break;
      case "lerp-angle":
        drawLerpAngleScene(ctx, size.width, size.height, handles, controls.lerp);
        break;
      case "get-rotation":
        drawGetRotationScene(ctx, size.width, size.height, points);
        break;
      case "point-to-circle":
        drawPointToCircleScene(ctx, size.width, size.height, circles, points);
        break;
      case "point-to-rect":
        drawPointToRectScene(ctx, size.width, size.height, points);
        break;
      case "line-to-point":
        drawLineToPointScene(ctx, size.width, size.height, handles, points);
        break;
      case "circle-to-rect":
        drawCircleToRectScene(ctx, size.width, size.height, circles, points);
        break;
      case "rect-to-rect":
        drawRectToRectScene(ctx, size.width, size.height, points);
        break;
      case "line-to-circle":
        drawLineToCircleScene(ctx, size.width, size.height, handles, circles);
        break;
      case "line-to-line":
        drawLineToLineScene(ctx, size.width, size.height, handles, points);
        break;
      case "line-to-rect":
        drawLineToRectScene(ctx, size.width, size.height, handles, points);
        break;
      case "polygon-point":
        drawPolygonPointScene(ctx, size.width, size.height, polyScene);
        break;
      case "point-to-polygon":
        drawPointToPolygonScene(ctx, size.width, size.height, polyScene);
        break;
      case "rect-to-polygon":
        drawRectToPolygonScene(ctx, size.width, size.height, polyScene);
        break;
      case "polygon-line":
        drawPolygonLineScene(ctx, size.width, size.height, polyScene);
        break;
      case "polygon-circle":
        drawPolygonCircleScene(ctx, size.width, size.height, polyScene);
        break;
      case "polygon-polygon":
        drawPolygonPolygonScene(ctx, size.width, size.height, polyScene, "polygonPolygon");
        break;
      case "polygon-to-polygon":
        drawPolygonPolygonScene(ctx, size.width, size.height, polyScene, "polygonToPolygon");
        break;
    }
  }, [circles, controls, demo, handles, origin, points, polyScene, size.height, size.width]);

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(event, canvasRef.current);
    if (!point) return;

    const drag = getDragState(point, demo.kind, circles, points, handles, controls, polyScene, size.width, size.height);
    if (!drag) return;
    dragRef.current = drag;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const point = getCanvasPoint(event, canvasRef.current);
    if (!point) return;

    switch (drag.kind) {
      case "circle":
        setCircles((current) => ({
          ...current,
          [drag.key]: clampCircle(
            {
              ...current[drag.key],
              x: Math.round(point.x - drag.dx),
              y: Math.round(point.y - drag.dy),
            },
            size.width,
            size.height,
          ),
        }));
        break;
      case "point":
        setPoints((current) => ({
          ...current,
          [drag.key]: clampPoint(
            {
              x: Math.round(point.x - drag.dx),
              y: Math.round(point.y - drag.dy),
            },
            size.width,
            size.height,
          ),
        }));
        break;
      case "handle":
        // Handles on unit-circle-point, sine-curve, and lerp-angle all snap to the circle.
        if (demo.kind === "unit-circle-point" || demo.kind === "sine-curve" ||
            (demo.kind === "lerp-angle" && (drag.key === "a" || drag.key === "b"))) {
          const layout = unitCircleLayout(size.width, size.height);
          setHandles((current) => ({
            ...current,
            [drag.key]: snapPointToCircle(
              {
                x: Math.round(point.x - drag.dx),
                y: Math.round(point.y - drag.dy),
              },
              layout,
            ),
          }));
          break;
        }
        setHandles((current) => ({
          ...current,
          [drag.key]: clampPoint(
            {
              x: Math.round(point.x - drag.dx),
              y: Math.round(point.y - drag.dy),
            },
            size.width,
            size.height,
          ),
        }));
        break;
      case "rail":
        setControls((current) => ({
          ...current,
          [drag.key]: railValueForPosition(drag.key, point.x, origin, size.width),
        }));
        break;
      case "poly-point":
        setPolyScene((current) => ({
          ...current,
          point: clampPoint(
            { x: Math.round(point.x - drag.dx), y: Math.round(point.y - drag.dy) },
            size.width,
            size.height,
          ),
        }));
        break;
      case "poly-circle":
        setPolyScene((current) => ({
          ...current,
          circle: clampCircle(
            { ...current.circle, x: Math.round(point.x - drag.dx), y: Math.round(point.y - drag.dy) },
            size.width,
            size.height,
          ),
        }));
        break;
      case "poly-handle":
        setPolyScene((current) => ({
          ...current,
          [drag.key]: clampPoint(
            { x: Math.round(point.x - drag.dx), y: Math.round(point.y - drag.dy) },
            size.width,
            size.height,
          ),
        }));
        break;
      case "poly-translate":
        setPolyScene((current) => ({
          ...current,
          [drag.key]: translatePolygonTo(
            current[drag.key],
            { x: point.x - drag.dx, y: point.y - drag.dy },
            size.width,
            size.height,
          ),
        }));
        break;
    }
  };

  const stopDrag = (event?: React.PointerEvent<HTMLCanvasElement>) => {
    if (event && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  };

  return (
    <div className="mini-demo mini-demo--geometry">
      <div className="mini-demo__call">
        <code>{scene.call}</code>
      </div>
      <div className="mini-demo__geometry-readout">
        {scene.readouts.map((row) => (
          <div
            key={row.label}
            className={row.tone === "live" ? "mini-demo__touching is-live" : undefined}
          >
            <span className="mini-demo__readout-label">{row.label}</span>
            <code>{row.value}</code>
          </div>
        ))}
      </div>
      <p className="mini-demo__hint">{scene.hint}</p>
      <canvas
        ref={canvasRef}
        className="mini-demo__canvas mini-demo__canvas--draggable"
        style={{ height }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDrag}
        onPointerLeave={stopDrag}
        aria-label={`Interactive ${demo.fnName} geometry demo`}
      />
    </div>
  );
}

// ─── COLLISION: polygonPoint (ray casting) ───────────────────────────────────

function buildPolygonPointScene(scene: PolyScene): SceneData {
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

function drawPolygonPointScene(
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

function buildPointToPolygonScene(scene: PolyScene): SceneData {
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

function drawPointToPolygonScene(
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

function rectPolyChecks(scene: PolyScene) {
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

function buildRectToPolygonScene(scene: PolyScene): SceneData {
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

function drawRectToPolygonScene(
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

function buildPolygonLineScene(scene: PolyScene): SceneData {
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

function drawPolygonLineScene(
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

function buildPolygonCircleScene(scene: PolyScene): SceneData {
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

function drawPolygonCircleScene(
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

function buildPolygonPolygonScene(
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

function drawPolygonPolygonScene(
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

// ─── Polygon helpers ─────────────────────────────────────────────────────────

function getPolygonDragState(
  point: Point,
  kind: ConstructiveGeometryDemoDef["kind"],
  scene: PolyScene,
): DragState | null {
  if (kind === "polygon-point" || kind === "point-to-polygon") {
    if (Math.hypot(point.x - scene.point.x, point.y - scene.point.y) <= 14) {
      return { kind: "poly-point", dx: point.x - scene.point.x, dy: point.y - scene.point.y };
    }
    if (polygonPoint({ vertices: scene.poly1 }, point)) return polyTranslateDrag(point, "poly1", scene.poly1);
    return null;
  }

  if (kind === "rect-to-polygon") {
    // The rect is centered on scene.point; grab it if the pointer is inside, else translate poly1.
    if (
      point.x >= scene.point.x - RECT_POLY_HALF_W && point.x <= scene.point.x + RECT_POLY_HALF_W &&
      point.y >= scene.point.y - RECT_POLY_HALF_H && point.y <= scene.point.y + RECT_POLY_HALF_H
    ) {
      return { kind: "poly-point", dx: point.x - scene.point.x, dy: point.y - scene.point.y };
    }
    if (polygonPoint({ vertices: scene.poly1 }, point)) return polyTranslateDrag(point, "poly1", scene.poly1);
    return null;
  }

  if (kind === "polygon-line") {
    for (const key of (["lineB", "lineA"] as const)) {
      const h = scene[key];
      if (Math.hypot(point.x - h.x, point.y - h.y) <= 14) {
        return { kind: "poly-handle", key, dx: point.x - h.x, dy: point.y - h.y };
      }
    }
    if (polygonPoint({ vertices: scene.poly1 }, point)) return polyTranslateDrag(point, "poly1", scene.poly1);
    return null;
  }

  if (kind === "polygon-circle") {
    const c = scene.circle;
    if (Math.hypot(point.x - c.x, point.y - c.y) <= c.radius) {
      return { kind: "poly-circle", dx: point.x - c.x, dy: point.y - c.y };
    }
    if (polygonPoint({ vertices: scene.poly1 }, point)) return polyTranslateDrag(point, "poly1", scene.poly1);
    return null;
  }

  // polygon-polygon / polygon-to-polygon — poly2 sits on top, so grab it first.
  if (polygonPoint({ vertices: scene.poly2 }, point)) return polyTranslateDrag(point, "poly2", scene.poly2);
  if (polygonPoint({ vertices: scene.poly1 }, point)) return polyTranslateDrag(point, "poly1", scene.poly1);
  return null;
}

function polyTranslateDrag(point: Point, key: "poly1" | "poly2", verts: Point[]): DragState {
  const c = polyCentroid(verts);
  return { kind: "poly-translate", key, dx: point.x - c.x, dy: point.y - c.y };
}

function getDragState(
  point: Point,
  kind: ConstructiveGeometryDemoDef["kind"],
  circles: CirclePair,
  points: PointPair,
  handles: HandlePair,
  controls: RailControls,
  polyScene: PolyScene,
  width: number,
  height: number,
): DragState | null {
  if (
    kind === "polygon-point" ||
    kind === "point-to-polygon" ||
    kind === "rect-to-polygon" ||
    kind === "polygon-line" ||
    kind === "polygon-circle" ||
    kind === "polygon-polygon" ||
    kind === "polygon-to-polygon"
  ) {
    return getPolygonDragState(point, kind, polyScene);
  }

  if (kind === "circle-to-circle" || kind === "circle-circle") {
    const keys: (keyof CirclePair)[] = ["circle2", "circle1"];
    for (const key of keys) {
      const circle = circles[key];
      if (Math.hypot(point.x - circle.x, point.y - circle.y) <= circle.radius) {
        return { kind: "circle", key, dx: point.x - circle.x, dy: point.y - circle.y };
      }
    }
    return null;
  }

  if (kind === "distance" || kind === "get-rotation") {
    const keys: (keyof PointPair)[] = ["point2", "point1"];
    for (const key of keys) {
      const current = points[key];
      if (Math.hypot(point.x - current.x, point.y - current.y) <= 14) {
        return { kind: "point", key, dx: point.x - current.x, dy: point.y - current.y };
      }
    }
    return null;
  }

  if (kind === "point-to-circle") {
    const p = points.point1;
    if (Math.hypot(point.x - p.x, point.y - p.y) <= 14) {
      return { kind: "point", key: "point1", dx: point.x - p.x, dy: point.y - p.y };
    }
    const c = circles.circle1;
    if (Math.hypot(point.x - c.x, point.y - c.y) <= c.radius) {
      return { kind: "circle", key: "circle1", dx: point.x - c.x, dy: point.y - c.y };
    }
    return null;
  }

  if (kind === "point-to-rect") {
    const p = points.point1;
    if (Math.hypot(point.x - p.x, point.y - p.y) <= 14) {
      return { kind: "point", key: "point1", dx: point.x - p.x, dy: point.y - p.y };
    }
    const rc = points.point2;
    if (point.x >= rc.x - RECT_HALF_W && point.x <= rc.x + RECT_HALF_W &&
        point.y >= rc.y - RECT_HALF_H && point.y <= rc.y + RECT_HALF_H) {
      return { kind: "point", key: "point2", dx: point.x - rc.x, dy: point.y - rc.y };
    }
    return null;
  }

  if (kind === "line-to-point") {
    const p = points.point1;
    if (Math.hypot(point.x - p.x, point.y - p.y) <= 14) {
      return { kind: "point", key: "point1", dx: point.x - p.x, dy: point.y - p.y };
    }
    for (const key of (["b", "a"] as (keyof HandlePair)[])) {
      const h = handles[key];
      if (Math.hypot(point.x - h.x, point.y - h.y) <= 14) {
        return { kind: "handle", key, dx: point.x - h.x, dy: point.y - h.y };
      }
    }
    return null;
  }

  if (kind === "circle-to-rect") {
    const c = circles.circle1;
    if (Math.hypot(point.x - c.x, point.y - c.y) <= c.radius) {
      return { kind: "circle", key: "circle1", dx: point.x - c.x, dy: point.y - c.y };
    }
    const rc = points.point1;
    if (point.x >= rc.x - RECT_HALF_W && point.x <= rc.x + RECT_HALF_W &&
        point.y >= rc.y - RECT_HALF_H && point.y <= rc.y + RECT_HALF_H) {
      return { kind: "point", key: "point1", dx: point.x - rc.x, dy: point.y - rc.y };
    }
    return null;
  }

  if (kind === "rect-to-rect") {
    for (const key of (["point2", "point1"] as (keyof PointPair)[])) {
      const rc = points[key];
      if (point.x >= rc.x - RECT_HALF_W && point.x <= rc.x + RECT_HALF_W &&
          point.y >= rc.y - RECT_HALF_H && point.y <= rc.y + RECT_HALF_H) {
        return { kind: "point", key, dx: point.x - rc.x, dy: point.y - rc.y };
      }
    }
    return null;
  }

  if (kind === "line-to-circle") {
    for (const key of (["b", "a"] as (keyof HandlePair)[])) {
      const h = handles[key];
      if (Math.hypot(point.x - h.x, point.y - h.y) <= 14) {
        return { kind: "handle", key, dx: point.x - h.x, dy: point.y - h.y };
      }
    }
    const c = circles.circle1;
    if (Math.hypot(point.x - c.x, point.y - c.y) <= c.radius) {
      return { kind: "circle", key: "circle1", dx: point.x - c.x, dy: point.y - c.y };
    }
    return null;
  }

  if (kind === "line-to-line") {
    for (const key of (["point2", "point1"] as (keyof PointPair)[])) {
      const p = points[key];
      if (Math.hypot(point.x - p.x, point.y - p.y) <= 14) {
        return { kind: "point", key, dx: point.x - p.x, dy: point.y - p.y };
      }
    }
    for (const key of (["b", "a"] as (keyof HandlePair)[])) {
      const h = handles[key];
      if (Math.hypot(point.x - h.x, point.y - h.y) <= 14) {
        return { kind: "handle", key, dx: point.x - h.x, dy: point.y - h.y };
      }
    }
    return null;
  }

  if (kind === "line-to-rect") {
    for (const key of (["b", "a"] as (keyof HandlePair)[])) {
      const h = handles[key];
      if (Math.hypot(point.x - h.x, point.y - h.y) <= 14) {
        return { kind: "handle", key, dx: point.x - h.x, dy: point.y - h.y };
      }
    }
    const rc = points.point1;
    if (point.x >= rc.x - RECT_HALF_W && point.x <= rc.x + RECT_HALF_W &&
        point.y >= rc.y - RECT_HALF_H && point.y <= rc.y + RECT_HALF_H) {
      return { kind: "point", key: "point1", dx: point.x - rc.x, dy: point.y - rc.y };
    }
    return null;
  }

  if (kind === "unit-circle-point" || kind === "sine-curve") {
    // The visible, draggable dot is drawn at the ON-CIRCLE point derived from the
    // handle's angle — NOT at the raw handle (which starts inside the circle).
    // Hit-test against that same drawn point so clicking the dot actually grabs it.
    const layout = unitCircleLayout(width, height);
    const angle = Math.atan2(handles.a.y - layout.center.y, handles.a.x - layout.center.x);
    const dot = unitCirclePoint(layout.center.x, layout.center.y, layout.radius, angle);
    if (Math.hypot(point.x - dot.x, point.y - dot.y) <= 16) {
      return { kind: "handle", key: "a", dx: point.x - dot.x, dy: point.y - dot.y };
    }
    return null;
  }

  if (
    kind === "vec-scale" ||
    kind === "vec-lerp" ||
    kind === "vec-limit" ||
    kind === "sine-wave" ||
    kind === "wave-amplitude" ||
    kind === "lerp-angle"
  ) {
    const railKey: keyof RailControls =
      kind === "vec-scale"
        ? "scale"
        : kind === "vec-lerp" || kind === "lerp-angle"
          ? "lerp"
          : kind === "vec-limit"
            ? "limit"
            : kind === "sine-wave"
              ? "phase"
              : "waveTime";
    const rail = railPosition(railKey, controls[railKey], width, height);
    if (point.y >= rail.y - 14 && point.y <= rail.y + 14 && point.x >= rail.x - 14 && point.x <= rail.x + 14) {
      return { kind: "rail", key: railKey, dx: point.x - rail.x };
    }
  }

  if (kind === "wave-amplitude") {
    const current = points.point1;
    if (Math.hypot(point.x - current.x, point.y - current.y) <= 14) {
      return { kind: "point", key: "point1", dx: point.x - current.x, dy: point.y - current.y };
    }
  }

  if (kind === "sine-wave") {
    const current = handles.a;
    if (Math.hypot(point.x - current.x, point.y - current.y) <= 14) {
      return { kind: "handle", key: "a", dx: point.x - current.x, dy: point.y - current.y };
    }
    return null;
  }

  if (kind === "lerp-angle") {
    // Check b before a (consistent with other two-handle demos).
    const keys: (keyof HandlePair)[] = ["b", "a"];
    for (const key of keys) {
      const current = handles[key];
      if (Math.hypot(point.x - current.x, point.y - current.y) <= 14) {
        return { kind: "handle", key, dx: point.x - current.x, dy: point.y - current.y };
      }
    }
    return null;
  }

  const keys: (keyof HandlePair)[] = ["b", "a"];
  for (const key of keys) {
    const current = handles[key];
    if (Math.hypot(point.x - current.x, point.y - current.y) <= 14) {
      return { kind: "handle", key, dx: point.x - current.x, dy: point.y - current.y };
    }
  }
  return null;
}

