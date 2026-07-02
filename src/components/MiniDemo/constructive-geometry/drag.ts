// Drag dispatch: hit-testing a pointer-down against a scene's draggable objects.
// Moved verbatim from ConstructiveGeometryDemo.tsx (behavior-identical).
// getDragState is the public entry point the component calls; the two polygon
// helpers are internal to this module.
import { polygonPoint } from "@utilspalooza/core/CollisionObjectAPI/PolygonPoint";
import { unitCirclePoint } from "@utilspalooza/core/UnitCirclePoint";
import type { Point } from "@utilspalooza/core";
import type { ConstructiveGeometryDemoDef } from "../constructiveGeometryDemos";
import type {
  CirclePair,
  PointPair,
  HandlePair,
  RailControls,
  PolyScene,
  DragState,
} from "./types";
import {
  RECT_HALF_W,
  RECT_HALF_H,
  RECT_POLY_HALF_W,
  RECT_POLY_HALF_H,
  polyCentroid,
  unitCircleLayout,
  railPosition,
} from "./shared";

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

export function getDragState(
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
