import type { Circle, Point } from "@utilspalooza/core";
import type { ConstructiveGeometryDemoDef } from "../constructiveGeometryDemos";

// Shared vocabulary for the constructive-geometry demos. These types used to
// live at the top of ConstructiveGeometryDemo.tsx; they moved here so each
// per-family scene file (circle, vectors, collision, polygon, …) and the shared
// harness can depend on them without importing the monolith.

export interface CirclePair {
  circle1: Circle;
  circle2: Circle;
}

export interface PointPair {
  point1: Point;
  point2: Point;
}

export interface HandlePair {
  a: Point;
  b: Point;
}

export interface RailControls {
  scale: number;
  lerp: number;
  limit: number;
  phase: number;
  waveTime: number;
}

// Polygon demos keep their own self-contained scene so they never disturb the
// shared circle/point/handle defaults the vector & collision cuts rely on.
export interface PolyScene {
  poly1: Point[];
  poly2: Point[];
  point: Point;
  circle: Circle;
  lineA: Point;
  lineB: Point;
}

export type DragState =
  | { kind: "circle"; key: keyof CirclePair; dx: number; dy: number }
  | { kind: "point"; key: keyof PointPair; dx: number; dy: number }
  | { kind: "handle"; key: keyof HandlePair; dx: number; dy: number }
  | { kind: "rail"; key: keyof RailControls; dx: number }
  | { kind: "poly-point"; dx: number; dy: number }
  | { kind: "poly-circle"; dx: number; dy: number }
  | { kind: "poly-handle"; key: "lineA" | "lineB"; dx: number; dy: number }
  | { kind: "poly-translate"; key: "poly1" | "poly2"; dx: number; dy: number };

export interface ReadoutRow {
  label: string;
  value: string;
  tone?: "live";
}

export interface SceneData {
  call: string;
  hint: string;
  readouts: ReadoutRow[];
}

// The bag of harness-owned state every scene may read. Individual scenes touch
// only the subset they need; the harness passes the whole thing so scenes stay
// declarative and the harness keeps zero per-scene knowledge.
export interface SceneInputs {
  circles: CirclePair;
  points: PointPair;
  handles: HandlePair;
  controls: RailControls;
  polyScene: PolyScene;
  origin: Point;
  size: { width: number; height: number };
  demo: ConstructiveGeometryDemoDef;
}

// The contract each per-family file implements. `kinds` lists the demo.kind
// values it handles (some families cover several via a mode arg). build/draw/
// hitTest are the three per-scene concerns the monolith kept in parallel
// switch statements.
export interface GeometryScene {
  kinds: string[];
  build(inputs: SceneInputs): SceneData;
  draw(ctx: CanvasRenderingContext2D, inputs: SceneInputs): void;
  hitTest(point: Point, inputs: SceneInputs): DragState | null;
}
