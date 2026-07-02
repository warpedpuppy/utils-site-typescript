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
import { buildScene, drawScene } from "./constructive-geometry/registry";
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

  const scene = useMemo<SceneData>(
    () => buildScene({ circles, points, handles, controls, polyScene, origin, size, demo }),
    [circles, controls, demo, handles, origin, points, polyScene, size],
  );

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

    drawScene(ctx, { circles, points, handles, controls, polyScene, origin, size, demo });
  }, [circles, controls, demo, handles, origin, points, polyScene, size]);

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

