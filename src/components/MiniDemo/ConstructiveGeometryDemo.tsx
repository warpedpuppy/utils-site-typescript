import { useEffect, useMemo, useRef, useState } from "react";
import { distance } from "@utilspalooza/core/Distance";
import type { Point } from "@utilspalooza/core";
import type { ConstructiveGeometryDemoDef } from "./constructiveGeometryDemos";
import type {
  CirclePair,
  PointPair,
  HandlePair,
  RailControls,
  PolyScene,
  DragState,
  SceneData,
} from "./constructive-geometry/types";
import {
  regularPolygon,
  translatePolygonTo,
  getCanvasPoint,
  clampCircle,
  clampPoint,
  unitCircleLayout,
  snapPointToCircle,
  railValueForPosition,
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
import {
  buildPolygonPointScene,
  drawPolygonPointScene,
  buildPointToPolygonScene,
  drawPointToPolygonScene,
  buildRectToPolygonScene,
  drawRectToPolygonScene,
  buildPolygonLineScene,
  drawPolygonLineScene,
  buildPolygonCircleScene,
  drawPolygonCircleScene,
  buildPolygonPolygonScene,
  drawPolygonPolygonScene,
} from "./constructive-geometry/polygon";
import { getDragState } from "./constructive-geometry/drag";
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

