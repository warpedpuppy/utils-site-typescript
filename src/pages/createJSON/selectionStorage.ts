// Copy Code selection persistence + one-time legacy migration (Work Package 3C
// of the 2026-07-11 code review remediation).
//
// Storage schema v2: localStorage["functions"] holds a CSV of CATALOG keys
// (canonical @utilspalooza/core export names). Before v2 it held animation
// manifest keys ("ballBounce", "EasingAnimation", …); LEGACY_KEY_MAP converts
// those on first read, unknown keys are dropped, duplicates removed, and the
// migrated list is persisted with the schema-version marker so migration runs
// exactly once. Utilspalooza only ever touches its own keys — never
// localStorage.clear().

import { getCatalogEntry } from "./exportCatalog";

export const SELECTION_KEY = "functions";
export const SELECTION_SCHEMA_KEY = "functionsSchemaVersion";
export const SELECTION_SCHEMA_VERSION = "2";

// Old animation-manifest key → the catalog key(s) its formula wrapper
// provided (the registry's primaryCoreExport). Generated from
// src/registry ALL_RECORDS on 2026-07-11; a static literal so the Copy Code
// page doesn't have to import the whole registry just to migrate storage.
export const LEGACY_KEY_MAP: Record<string, string[]> = {
  ballBounce: ["ballBounce"],
  OrbitalMotionAnimation: ["sphereLighting"],
  LerpAnimation: ["lerp"],
  EasingAnimation: ["easeInOut"],
  SpringAnimation: ["springValue"],
  MoveObjectToDestinationPoint: ["moveAlongLine"],
  QuadraticBezierAnimation: ["quadraticBezier"],
  BezierCurves: ["deCasteljau"],
  SineCurveAnimation: ["sineCurve"],
  DeMystifySineCosine: ["unitCirclePoint"],
  MoveItemAroundCircle: ["findPointAroundCircle"],
  PointTowardsMovingPoint: ["getRotation"],
  DistributePointsAroundACircle: ["distributeAroundCircle"],
  VectorReflectAnimation: ["vecReflect"],
  VectorRotateAnimation: ["vecRotate"],
  AngleLerpAnimation: ["lerpAngle"],
  PointToCircleCollision: ["pointCircle"],
  PointToRectangle: ["polygonPoint"],
  RectToRect: ["polygonPolygon"],
  CirceToRectCollision: ["polygonCircle"],
  CircleToCircleCollision: ["circleCircle"],
  LineToCircleCollision: ["lineCircle"],
  LineToLineCollision: ["lineLine"],
  LineToPointCollision: ["linePoint"],
  LineToRectangleCollision: ["polygonLine"],
  PolygonToPolygonCollision: ["polygonPolygon"],
  CircleFieldCollision: ["circleCircle"],
  BallsBouncingAgainstEachOther: ["ballToBallBounce"],
  LerpScalarAnimation: ["lerp"],
  InverseLerpAnimation: ["inverseLerp"],
  MapRangeAnimation: ["mapRange"],
  ClampAnimation: ["clamp"],
  WrapAnimation: ["wrap"],
  PingPongAnimation: ["pingPong"],
  SmoothstepAnimation: ["smoothstep"],
  GetHalfwayPointOfLine: ["getPointOnLine"],
  DistanceBetweenTwoPoints: ["lineLength"],
  triangleDataFromLine: ["triangleDataFromLine"],
  Star: ["starVertices"],
  Polygon: ["createRect"],
  GetEquilateralTriangleVertices: ["equilateralTriangle"],
  CircleFromThreePointsAnimation: ["circleFromThreePoints"],
  CenterOnParentAnimation: ["centerOnParent"],
  FourierEpicycles: ["dft"],
  GameOfLife: ["gameOfLifeStep"],
  WaveInterference: ["waveAmplitude"],
  GravitationalLensing: ["lensDeflection"],
  OrbitalPrecession: ["grStep"],
  Murmuration: ["boidsStep"],
  Deg2RadAnimation: ["degToRad"],
  Rad2DegAnimation: ["radToDeg"],
  NumberWithCommasAnimation: ["numberWithCommas"],
  RandomIntegerAnimation: ["randomIntegerBetween"],
  RandomNumberAnimation: ["randomNumberBetween"],
  ColorLerpAnimation: ["lerpColorHsl"],
  ColorFamiliesAnimation: ["colorFamily"],
};

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function safeStorage(): StorageLike | null {
  // localStorage can be unavailable (SSR/prerender) or throw (privacy modes,
  // full quota). Selection persistence is a convenience — never crash for it.
  try {
    const probe = window.localStorage;
    probe.getItem(SELECTION_KEY);
    return probe;
  } catch {
    return null;
  }
}

function migrate(rawKeys: string[]): string[] {
  const migrated: string[] = [];
  for (const raw of rawKeys) {
    if (getCatalogEntry(raw)) {
      migrated.push(raw);
    } else if (raw in LEGACY_KEY_MAP) {
      migrated.push(...LEGACY_KEY_MAP[raw].filter((k) => getCatalogEntry(k)));
    }
    // Unknown keys are dropped.
  }
  return [...new Set(migrated)];
}

/** Read the current selection, migrating legacy storage exactly once. */
export function readSelection(storage: StorageLike | null = safeStorage()): string[] {
  if (!storage) return [];
  try {
    const raw = (storage.getItem(SELECTION_KEY) ?? "").split(",").filter(Boolean);
    if (storage.getItem(SELECTION_SCHEMA_KEY) === SELECTION_SCHEMA_VERSION) {
      // Already v2 — still drop anything unknown defensively, without writing.
      return raw.filter((k) => getCatalogEntry(k) !== undefined);
    }
    const migrated = migrate(raw);
    storage.setItem(SELECTION_KEY, migrated.join(","));
    storage.setItem(SELECTION_SCHEMA_KEY, SELECTION_SCHEMA_VERSION);
    return migrated;
  } catch {
    return [];
  }
}

/** Persist a selection of catalog keys. */
export function writeSelection(
  keys: string[],
  storage: StorageLike | null = safeStorage()
): void {
  if (!storage) return;
  try {
    storage.setItem(SELECTION_KEY, [...new Set(keys)].join(","));
    storage.setItem(SELECTION_SCHEMA_KEY, SELECTION_SCHEMA_VERSION);
  } catch {
    // Persistence is best-effort.
  }
}
