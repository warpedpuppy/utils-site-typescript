import { useEffect, useMemo, useRef, useState } from "react";
import { lerpAngle, shortestAngleBetween, wrapAngle } from "@utilspalooza/core/AngleInterpolation";
import { circleToRect } from "@utilspalooza/core/CircleToRect";
import { distance } from "@utilspalooza/core/Distance";
import { lineToCircle } from "@utilspalooza/core/LineToCircle";
import { lineToLine } from "@utilspalooza/core/LineToLine";
import { lineToPoint } from "@utilspalooza/core/LineToPoint";
import { lineToRect } from "@utilspalooza/core/LineToRect";
import { pointToCircle } from "@utilspalooza/core/PointToCircle";
import { pointToRect } from "@utilspalooza/core/PointToRect";
import { rectToRect } from "@utilspalooza/core/RectToRect";
import { polygonPoint } from "@utilspalooza/core/CollisionObjectAPI/PolygonPoint";
import { pointToPolygon } from "@utilspalooza/core/PointToPolygon";
import { rectToPolygon } from "@utilspalooza/core/RectToPolygon";
import { polygonLine } from "@utilspalooza/core/CollisionObjectAPI/PolygonLine";
import { polygonCircle } from "@utilspalooza/core/CollisionObjectAPI/PolygonCircle";
import { polygonPolygon } from "@utilspalooza/core/CollisionObjectAPI/PolygonPolygon";
import { polygonToPolygon } from "@utilspalooza/core/PolygonToPolygon";
import { lineLine } from "@utilspalooza/core/CollisionObjectAPI/LineLine";
import { lineCircle } from "@utilspalooza/core/CollisionObjectAPI/LineCircle";
import { getRotation } from "@utilspalooza/core/GetRotation";
import { getTriangleData } from "@utilspalooza/core/GetTriangleData";
import { unitCirclePoint } from "@utilspalooza/core/UnitCirclePoint";
import {
  vecAdd,
  vecAngle,
  vecAngleBetween,
  vecCross,
  vecDot,
  vecLerp,
  vecLimit,
  vecMagnitude,
  vecMagnitudeSquared,
  vecNormalize,
  vecPerpendicular,
  vecScale,
  vecSubtract,
} from "@utilspalooza/core/Vec2";
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

function buildVecAddScene(origin: Point, handles: HandlePair): SceneData {
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

function buildVecSubtractScene(origin: Point, handles: HandlePair): SceneData {
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

function buildVecScaleScene(origin: Point, handle: Point, scale: number): SceneData {
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

function buildVecMagnitudeScene(origin: Point, handle: Point): SceneData {
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

function buildVecMagnitudeSquaredScene(origin: Point, handle: Point): SceneData {
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

function buildVecNormalizeScene(origin: Point, handle: Point): SceneData {
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

function buildVecAngleScene(origin: Point, handle: Point): SceneData {
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

function buildVecDotScene(origin: Point, handles: HandlePair): SceneData {
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

function buildVecCrossScene(origin: Point, handles: HandlePair): SceneData {
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

function buildVecAngleBetweenScene(origin: Point, handles: HandlePair): SceneData {
  const a = vectorFromHandle(handles.a, origin);
  const b = vectorFromHandle(handles.b, origin);
  const angle = vecAngleBetween(a, b);
  return {
    call: `vecAngleBetween(${formatVector(a)}, ${formatVector(b)}) = ${fmt(angle)} rad`,
    hint:
      "Drag either vector. This one answers the pure turning question between them: no sign, no direction test, just the smallest unsigned angle from one to the other.",
    readouts: [
      { label: "a", value: formatVector(a) },
      { label: "b", value: formatVector(b) },
      { label: "angle", value: `${fmt(angle)} rad = ${fmt(radToDeg(angle))}°` },
    ],
  };
}

function buildVecPerpendicularScene(origin: Point, handle: Point): SceneData {
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

function buildVecLerpScene(origin: Point, handles: HandlePair, t: number): SceneData {
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

function buildVecLimitScene(origin: Point, handle: Point, max: number): SceneData {
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

function drawSingleVectorScene(
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
    drawVector(ctx, origin, handleFromVector(origin, normalized, 64), "#fb7185", "unit");
  } else if (focus === "perpendicular") {
    drawHeaderBox(ctx, [{ text: `perpendicular = 90° turn`, color: "#e2e8f0" }]);
    drawVector(ctx, origin, handleFromVector(origin, perpendicular, 0.75), "#fb7185", "⊥");
    drawAngleArcBetween(ctx, origin, handle, handleFromVector(origin, perpendicular, 0.75), 42, "rgba(249, 115, 22, 0.95)");
  } else {
    drawHeaderBox(ctx, [{ text: `θ = ${fmt(radians)} rad = ${fmt(radToDeg(radians))}°`, color: "#e2e8f0" }]);
    drawAngleArc(ctx, origin, handle, origin.x + 54, "rgba(249, 115, 22, 0.95)");
    labelSegment(ctx, origin.x + 52, origin.y - 10, `θ = ${fmt(radToDeg(radians))}°`, "rgba(249, 115, 22, 0.98)");
  }
}

function drawDualVectorResultScene(
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
  drawVector(ctx, origin, resultHandle, "#f97316", focus === "add" ? "a+b" : "a-b");
  drawOrigin(ctx, origin);

  drawHeaderBox(ctx, [{ text: `${focus === "add" ? "result" : "difference"} = ${formatVector(result)}`, color: "#e2e8f0" }]);
}

function drawDualVectorScene(
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
    drawHeaderBox(ctx, [{ text: `angle = ${fmt(angle)} rad = ${fmt(radToDeg(angle))}°`, color: "#e2e8f0" }]);
  }

  labelSegment(ctx, handles.a.x + 18, handles.a.y - 10, "a", "#818cf8");
  labelSegment(ctx, handles.b.x + 18, handles.b.y - 10, "b", "#fb7185");
}

function drawScaleScene(
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
  drawVector(ctx, origin, handleFromVector(origin, scaled, 1), "#f97316", "scaled");
  drawOrigin(ctx, origin);
  drawRail(ctx, width, height, "scale", scale, -2, 2);
  drawHeaderBox(ctx, [{ text: `scale = ${fmt(scale)}`, color: "#e2e8f0" }]);
}

function drawLerpScene(
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
  drawVector(ctx, origin, lerpHandle, "#f97316", "lerp");
  drawOrigin(ctx, origin);
  drawRail(ctx, width, height, "lerp", t, 0, 1);
  drawHeaderBox(ctx, [{ text: `t = ${fmt(t)}`, color: "#e2e8f0" }]);
}

function drawLimitScene(
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
  drawVector(ctx, origin, handleFromVector(origin, limited, 1), "#f97316", "limited");
  drawOrigin(ctx, origin);
  drawRail(ctx, width, height, "limit", max, 20, 140);
  drawHeaderBox(ctx, [{ text: `max = ${fmt(max)}`, color: "#e2e8f0" }]);
}

function buildGetRotationScene(points: PointPair): SceneData {
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

function drawGetRotationScene(
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

function buildLerpAngleScene(
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

function drawLerpAngleScene(
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
  drawVector(ctx, center, lerpedPt, "#f97316", `t=${fmt(t)}`);

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

// ─── COLLISION: pointToCircle ────────────────────────────────────────────────

function buildPointToCircleScene(points: PointPair, circles: CirclePair): SceneData {
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

function drawPointToCircleScene(
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

function buildPointToRectScene(points: PointPair): SceneData {
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

function drawPointToRectScene(
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

function buildLineToPointScene(handles: HandlePair, points: PointPair): SceneData {
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

function drawLineToPointScene(
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

function buildCircleToRectScene(circles: CirclePair, points: PointPair): SceneData {
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

function drawCircleToRectScene(
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

function buildRectToRectScene(points: PointPair): SceneData {
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

function drawRectToRectScene(
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

function buildLineToCircleScene(handles: HandlePair, circles: CirclePair): SceneData {
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

function drawLineToCircleScene(
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

function buildLineToLineScene(handles: HandlePair, points: PointPair): SceneData {
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

function drawLineToLineScene(
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

function buildLineToRectScene(handles: HandlePair, points: PointPair): SceneData {
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

function drawLineToRectScene(
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

