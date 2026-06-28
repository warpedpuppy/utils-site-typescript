import { circleToCircle } from "@utilspalooza/core/CircleToCircle";
import { circleCircle } from "@utilspalooza/core/CollisionObjectAPI/CircleCircle";
import type { Circle } from "@utilspalooza/core";

export type GeometryDemoKind =
  | "circle-to-circle"
  | "circle-circle"
  | "distance"
  | "unit-circle-point"
  | "sine-curve"
  | "sine-wave"
  | "wave-amplitude"
  | "vec-add"
  | "vec-subtract"
  | "vec-scale"
  | "vec-magnitude"
  | "vec-magnitude-squared"
  | "vec-normalize"
  | "vec-angle"
  | "vec-dot"
  | "vec-cross"
  | "vec-angle-between"
  | "vec-perpendicular"
  | "vec-lerp"
  | "vec-limit"
  | "lerp-angle"
  | "get-rotation"
  | "point-to-circle"
  | "point-to-rect"
  | "line-to-point"
  | "circle-to-rect"
  | "rect-to-rect"
  | "line-to-circle"
  | "line-to-line"
  | "line-to-rect"
  | "polygon-point"
  | "polygon-line"
  | "polygon-circle"
  | "polygon-polygon"
  | "polygon-to-polygon";

export interface ConstructiveGeometryDemoDef {
  kind: GeometryDemoKind;
  fnName: string;
  hitTest?: (circle1: Circle, circle2: Circle) => boolean;
}

export const CONSTRUCTIVE_GEOMETRY_DEMOS: Partial<Record<string, ConstructiveGeometryDemoDef>> = {
  circleToCircle: {
    kind: "circle-to-circle",
    fnName: "circleToCircle",
    hitTest: (circle1, circle2) =>
      circleToCircle(circle1.x, circle1.y, circle1.radius, circle2.x, circle2.y, circle2.radius),
  },
  circleCircle: {
    kind: "circle-circle",
    fnName: "circleCircle",
    hitTest: circleCircle,
  },
  distance: {
    kind: "distance",
    fnName: "distance",
  },
  unitCirclePoint: {
    kind: "unit-circle-point",
    fnName: "unitCirclePoint",
  },
  sineCurve: {
    kind: "sine-curve",
    fnName: "sineCurve",
  },
  sineWave: {
    kind: "sine-wave",
    fnName: "sineWave",
  },
  waveAmplitude: {
    kind: "wave-amplitude",
    fnName: "waveAmplitude",
  },
  vecAdd: {
    kind: "vec-add",
    fnName: "vecAdd",
  },
  vecSubtract: {
    kind: "vec-subtract",
    fnName: "vecSubtract",
  },
  vecScale: {
    kind: "vec-scale",
    fnName: "vecScale",
  },
  vecMagnitude: {
    kind: "vec-magnitude",
    fnName: "vecMagnitude",
  },
  vecMagnitudeSquared: {
    kind: "vec-magnitude-squared",
    fnName: "vecMagnitudeSquared",
  },
  vecNormalize: {
    kind: "vec-normalize",
    fnName: "vecNormalize",
  },
  vecAngle: {
    kind: "vec-angle",
    fnName: "vecAngle",
  },
  vecDot: {
    kind: "vec-dot",
    fnName: "vecDot",
  },
  vecCross: {
    kind: "vec-cross",
    fnName: "vecCross",
  },
  vecAngleBetween: {
    kind: "vec-angle-between",
    fnName: "vecAngleBetween",
  },
  vecPerpendicular: {
    kind: "vec-perpendicular",
    fnName: "vecPerpendicular",
  },
  vecLerp: {
    kind: "vec-lerp",
    fnName: "vecLerp",
  },
  vecLimit: {
    kind: "vec-limit",
    fnName: "vecLimit",
  },
  lerpAngle: {
    kind: "lerp-angle",
    fnName: "lerpAngle",
  },
  shortestAngleBetween: {
    kind: "lerp-angle",
    fnName: "shortestAngleBetween",
  },
  wrapAngle: {
    kind: "lerp-angle",
    fnName: "wrapAngle",
  },
  getRotation: {
    kind: "get-rotation",
    fnName: "getRotation",
  },
  pointToCircle: {
    kind: "point-to-circle",
    fnName: "pointToCircle",
  },
  pointToRect: {
    kind: "point-to-rect",
    fnName: "pointToRect",
  },
  lineToPoint: {
    kind: "line-to-point",
    fnName: "lineToPoint",
  },
  circleToRect: {
    kind: "circle-to-rect",
    fnName: "circleToRect",
  },
  rectToRect: {
    kind: "rect-to-rect",
    fnName: "rectToRect",
  },
  lineToCircle: {
    kind: "line-to-circle",
    fnName: "lineToCircle",
  },
  lineToLine: {
    kind: "line-to-line",
    fnName: "lineToLine",
  },
  lineToRect: {
    kind: "line-to-rect",
    fnName: "lineToRect",
  },
  polygonPoint: {
    kind: "polygon-point",
    fnName: "polygonPoint",
  },
  polygonLine: {
    kind: "polygon-line",
    fnName: "polygonLine",
  },
  polygonCircle: {
    kind: "polygon-circle",
    fnName: "polygonCircle",
  },
  polygonPolygon: {
    kind: "polygon-polygon",
    fnName: "polygonPolygon",
  },
  polygonToPolygon: {
    kind: "polygon-to-polygon",
    fnName: "polygonToPolygon",
  },
};
