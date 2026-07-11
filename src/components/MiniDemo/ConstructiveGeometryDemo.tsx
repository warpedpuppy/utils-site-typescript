import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Point } from "@utilspalooza/core";
import type { ConstructiveGeometryDemoDef, GeometryDemoKind } from "./constructiveGeometryDemos";
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

interface DemoDefaults {
  circles: CirclePair;
  points: PointPair;
  handles: HandlePair;
  polyScene: PolyScene;
}

function buildCollisionDefaults(kind: GeometryDemoKind, size: { width: number; height: number }): DemoDefaults {
  const cx = Math.round(size.width * 0.52);
  const cy = Math.round(size.height * 0.56);
  const base: DemoDefaults = {
    circles: {
      circle1: { x: cx - 42, y: cy - 2, radius: 46 },
      circle2: { x: cx + 42, y: cy + 8, radius: 42 },
    },
    points: {
      point1: { x: cx - 34, y: cy + 6 },
      point2: { x: cx + 34, y: cy - 8 },
    },
    handles: {
      a: { x: cx - 66, y: cy - 22 },
      b: { x: cx + 66, y: cy + 18 },
    },
    polyScene: {
      poly1: regularPolygon(cx - 28, cy - 4, 52, 5, -Math.PI / 2),
      poly2: regularPolygon(cx + 38, cy + 2, 46, 4, -Math.PI / 4),
      point: { x: cx - 18, y: cy + 8 },
      circle: { x: cx + 34, y: cy + 2, radius: 34 },
      lineA: { x: cx - 76, y: cy - 16 },
      lineB: { x: cx + 76, y: cy + 18 },
    },
  };

  switch (kind) {
    case "point-to-circle":
      base.points.point1 = { x: cx - 22, y: cy + 2 };
      base.circles.circle1 = { x: cx + 26, y: cy + 2, radius: 48 };
      break;
    case "point-to-rect":
      base.points.point1 = { x: cx - 24, y: cy + 6 };
      base.points.point2 = { x: cx + 28, y: cy + 2 };
      break;
    case "line-to-point":
      base.handles = {
        a: { x: cx - 74, y: cy - 18 },
        b: { x: cx + 56, y: cy + 18 },
      };
      base.points.point1 = { x: cx + 4, y: cy + 2 };
      break;
    case "circle-to-rect":
      base.circles.circle1 = { x: cx - 34, y: cy + 2, radius: 46 };
      base.points.point1 = { x: cx + 34, y: cy + 2 };
      break;
    case "rect-to-rect":
      base.points.point1 = { x: cx - 30, y: cy + 2 };
      base.points.point2 = { x: cx + 30, y: cy + 8 };
      break;
    case "line-to-circle":
      base.handles = {
        a: { x: cx - 78, y: cy - 18 },
        b: { x: cx + 54, y: cy + 16 },
      };
      base.circles.circle1 = { x: cx + 6, y: cy + 2, radius: 40 };
      break;
    case "line-to-line":
      base.handles = {
        a: { x: cx - 70, y: cy - 20 },
        b: { x: cx + 44, y: cy + 18 },
      };
      base.points.point1 = { x: cx - 48, y: cy + 20 };
      base.points.point2 = { x: cx + 42, y: cy - 24 };
      break;
    case "line-to-rect":
      base.handles = {
        a: { x: cx - 76, y: cy - 18 },
        b: { x: cx + 58, y: cy + 18 },
      };
      base.points.point1 = { x: cx + 10, y: cy + 2 };
      break;
    case "polygon-point":
    case "point-to-polygon":
      base.polyScene.poly1 = regularPolygon(cx + 10, cy, 54, 5, -Math.PI / 2);
      base.polyScene.point = { x: cx - 24, y: cy + 8 };
      break;
    case "rect-to-polygon":
      base.polyScene.poly1 = regularPolygon(cx - 10, cy, 52, 5, -Math.PI / 2);
      base.polyScene.point = { x: cx + 40, y: cy + 4 };
      break;
    case "polygon-line":
      base.polyScene.poly1 = regularPolygon(cx + 6, cy, 54, 5, -Math.PI / 2);
      base.polyScene.lineA = { x: cx - 80, y: cy - 16 };
      base.polyScene.lineB = { x: cx + 72, y: cy + 18 };
      break;
    case "polygon-circle":
      base.polyScene.poly1 = regularPolygon(cx - 12, cy, 52, 5, -Math.PI / 2);
      base.polyScene.circle = { x: cx + 42, y: cy + 2, radius: 34 };
      break;
    case "polygon-polygon":
    case "polygon-to-polygon":
      base.polyScene.poly1 = regularPolygon(cx - 34, cy - 2, 50, 5, -Math.PI / 2);
      base.polyScene.poly2 = regularPolygon(cx + 34, cy + 4, 44, 4, -Math.PI / 4);
      break;
    default:
      break;
  }

  return base;
}

function isCollisionKind(kind: GeometryDemoKind): boolean {
  return [
    "circle-to-circle",
    "circle-circle",
    "point-to-circle",
    "point-to-rect",
    "line-to-point",
    "circle-to-rect",
    "rect-to-rect",
    "line-to-circle",
    "line-to-line",
    "line-to-rect",
    "polygon-point",
    "point-to-polygon",
    "rect-to-polygon",
    "polygon-line",
    "polygon-circle",
    "polygon-polygon",
    "polygon-to-polygon",
  ].includes(kind);
}

export default function ConstructiveGeometryDemo({
  demo,
  height = 248,
}: ConstructiveGeometryDemoProps) {
  const initialDefaults = buildCollisionDefaults(demo.kind, { width: 480, height });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const [size, setSize] = useState({ width: 480, height });
  const [circles, setCircles] = useState<CirclePair>(initialDefaults.circles);
  const [points, setPoints] = useState<PointPair>(initialDefaults.points);
  const [handles, setHandles] = useState<HandlePair>(initialDefaults.handles);
  const [controls, setControls] = useState<RailControls>({
    scale: 1.5,
    lerp: 0.5,
    limit: 90,
    phase: 0.15,
    waveTime: 18,
  });
  const [polyScene, setPolyScene] = useState<PolyScene>(initialDefaults.polyScene);

  // Layout effect so the real container width is measured before first paint
  // — the 480 initial state is a pre-mount placeholder, never a minimum.
  useLayoutEffect(() => {
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

  useEffect(() => {
    if (!isCollisionKind(demo.kind)) return;
    const defaults = buildCollisionDefaults(demo.kind, size);
    setCircles(defaults.circles);
    setPoints(defaults.points);
    setHandles(defaults.handles);
    setPolyScene(defaults.polyScene);
  }, [demo.kind, size.height, size.width]);

  useEffect(() => {
    if (demo.kind !== "unit-circle-point" && demo.kind !== "sine-curve" && demo.kind !== "lerp-angle") {
      return;
    }
    const layout = unitCircleLayout(size.width, size.height);
    setHandles((current) => ({
      a: snapPointToCircle(current.a, layout),
      b: demo.kind === "lerp-angle" ? snapPointToCircle(current.b, layout) : current.b,
    }));
  }, [demo.kind, size.height, size.width]);

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
    applyDrag(point, drag);
  };

  // Shared by pointer drags and keyboard nudges: move whatever `drag`
  // describes so its anchor lands at (point − drag offset).
  const applyDrag = (point: Point, drag: DragState) => {
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

  // ── Keyboard access (Fable review §4.6) ──────────────────────────────────
  // Draggable parts are discovered by probing the canvas with the SAME
  // getDragState hit-test the pointer uses, so there is zero per-kind
  // keyboard knowledge to drift. Arrow keys nudge the active part through
  // applyDrag; Enter/Space cycles between parts.
  const [keyboardFocused, setKeyboardFocused] = useState(false);
  const [activeTargetId, setActiveTargetId] = useState<string | null>(null);
  const [keyInfo, setKeyInfo] = useState<{ label: string; count: number } | null>(null);

  interface KeyTarget {
    id: string;
    drag: DragState;
    anchor: Point;
  }

  const findKeyTargets = (): KeyTarget[] => {
    const found = new Map<string, KeyTarget>();
    // 6px grid comfortably undershoots every hit radius (≥14px).
    for (let y = 4; y < size.height; y += 6) {
      for (let x = 4; x < size.width; x += 6) {
        const drag = getDragState({ x, y }, demo.kind, circles, points, handles, controls, polyScene, size.width, size.height);
        if (!drag) continue;
        const id = "key" in drag ? `${drag.kind}:${drag.key}` : drag.kind;
        if (found.has(id)) continue;
        found.set(id, {
          id,
          drag,
          anchor: { x: x - drag.dx, y: "dy" in drag ? y - drag.dy : y },
        });
      }
    }
    return Array.from(found.values());
  };

  const targetLabel = (drag: DragState): string => {
    switch (drag.kind) {
      case "circle":
        return drag.key === "circle1" ? "circle 1" : "circle 2";
      case "point":
        return drag.key === "point1" ? "point 1" : "point 2";
      case "handle":
        return drag.key === "a" ? "handle A" : "handle B";
      case "rail":
        return `${drag.key} slider`;
      case "poly-point":
        return demo.kind === "rect-to-polygon" ? "the rectangle" : "the point";
      case "poly-circle":
        return "the circle";
      case "poly-handle":
        return drag.key === "lineA" ? "line end A" : "line end B";
      case "poly-translate":
        return drag.key === "poly1" ? "polygon 1" : "polygon 2";
    }
  };

  const syncKeyInfo = (targets: KeyTarget[], id: string | null) => {
    const active = targets.find((t) => t.id === id) ?? targets[0];
    setKeyInfo(active ? { label: targetLabel(active.drag), count: targets.length } : null);
  };

  const onCanvasFocus = () => {
    setKeyboardFocused(true);
    const targets = findKeyTargets();
    const id = targets.some((t) => t.id === activeTargetId)
      ? activeTargetId
      : targets[0]?.id ?? null;
    setActiveTargetId(id);
    syncKeyInfo(targets, id);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
    const targets = findKeyTargets();
    if (!targets.length) return;

    const activeIndex = Math.max(0, targets.findIndex((t) => t.id === activeTargetId));
    const active = targets[activeIndex];

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const next = targets[(activeIndex + 1) % targets.length];
      setActiveTargetId(next.id);
      syncKeyInfo(targets, next.id);
      return;
    }

    const step = event.shiftKey ? 24 : 6;
    let dx = 0;
    let dy = 0;
    if (event.key === "ArrowLeft") dx = -step;
    else if (event.key === "ArrowRight") dx = step;
    else if (event.key === "ArrowUp") dy = -step;
    else if (event.key === "ArrowDown") dy = step;
    else return;

    event.preventDefault();
    applyDrag(
      {
        x: active.anchor.x + active.drag.dx + dx,
        y: ("dy" in active.drag ? active.anchor.y + active.drag.dy : active.anchor.y) + dy,
      },
      active.drag,
    );
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
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDrag}
        onPointerLeave={stopDrag}
        onFocus={onCanvasFocus}
        onBlur={() => setKeyboardFocused(false)}
        onKeyDown={onKeyDown}
        aria-label={`Interactive ${demo.fnName} geometry demo. Drag the shapes with a pointer, or focus the canvas and use the arrow keys to move a part; Enter switches parts.`}
      />
      {keyboardFocused && keyInfo && (
        <p className="mini-demo__keyhint">
          Arrow keys move <strong>{keyInfo.label}</strong> (Shift = bigger steps)
          {keyInfo.count > 1 ? " · Enter or Space switches parts" : ""}
        </p>
      )}
    </div>
  );
}
