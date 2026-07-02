// Scene registry: one table keyed by demo.kind that replaces the two parallel
// build/draw switch statements the monolith used to carry. Each entry knows how
// to marshal the harness-owned SceneInputs bag into its family function's real
// argument list. Exhaustiveness is enforced at compile time by keying the record
// on GeometryDemoKind, so a missing or misspelled kind is a type error.
//
// hitTest is deliberately NOT in this table — its dispatch (getDragState in
// drag.ts) has intentional layered/fall-through logic across kinds that does not
// reduce to a flat per-kind lookup.
import type { GeometryDemoKind } from "../constructiveGeometryDemos";
import type { SceneData, SceneInputs } from "./types";
import { buildCircleScene, drawCircleScene } from "./circle";
import { buildDistanceScene, drawDistanceScene } from "./distance";
import {
  buildUnitCirclePointScene,
  buildSineWaveScene,
  buildSineCurveScene,
  buildWaveAmplitudeScene,
  drawUnitCirclePointScene,
  drawSineWaveScene,
  drawSineCurveScene,
  drawWaveAmplitudeScene,
} from "./trig";
import {
  buildVecScaleScene,
  buildVecMagnitudeScene,
  buildVecMagnitudeSquaredScene,
  buildVecNormalizeScene,
  buildVecAngleScene,
  buildVecPerpendicularScene,
  drawSingleVectorScene,
  drawScaleScene,
} from "./vectors-single";
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
} from "./vectors-dual";
import {
  buildGetRotationScene,
  drawGetRotationScene,
  buildLerpAngleScene,
  drawLerpAngleScene,
} from "./angles";
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
} from "./collision-simple";
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
} from "./polygon";

interface SceneEntry {
  build: (i: SceneInputs) => SceneData;
  draw: (ctx: CanvasRenderingContext2D, i: SceneInputs) => void;
}

const circleEntry: SceneEntry = {
  build: (i) => buildCircleScene(i.demo, i.circles),
  draw: (ctx, i) =>
    drawCircleScene(ctx, i.size.width, i.size.height, i.circles, !!(i.demo.hitTest?.(i.circles.circle1, i.circles.circle2))),
};

export const sceneRegistry: Record<GeometryDemoKind, SceneEntry> = {
  "circle-to-circle": circleEntry,
  "circle-circle": circleEntry,
  "distance": {
    build: (i) => buildDistanceScene(i.points),
    draw: (ctx, i) => drawDistanceScene(ctx, i.size.width, i.size.height, i.points),
  },
  "unit-circle-point": {
    build: (i) => buildUnitCirclePointScene(i.size.width, i.size.height, i.handles.a),
    draw: (ctx, i) => drawUnitCirclePointScene(ctx, i.size.width, i.size.height, i.handles.a),
  },
  "sine-curve": {
    build: (i) => buildSineCurveScene(i.size.width, i.size.height, i.handles.a),
    draw: (ctx, i) => drawSineCurveScene(ctx, i.size.width, i.size.height, i.handles.a),
  },
  "sine-wave": {
    build: (i) => buildSineWaveScene(i.size.width, i.size.height, i.handles.a, i.controls.phase),
    draw: (ctx, i) => drawSineWaveScene(ctx, i.size.width, i.size.height, i.handles.a, i.controls.phase),
  },
  "wave-amplitude": {
    build: (i) => buildWaveAmplitudeScene(i.points.point1, i.handles, i.controls.waveTime),
    draw: (ctx, i) => drawWaveAmplitudeScene(ctx, i.size.width, i.size.height, i.points.point1, i.handles, i.controls.waveTime),
  },
  "vec-add": {
    build: (i) => buildVecAddScene(i.origin, i.handles),
    draw: (ctx, i) => drawDualVectorResultScene(ctx, i.size.width, i.size.height, i.origin, i.handles, "add"),
  },
  "vec-subtract": {
    build: (i) => buildVecSubtractScene(i.origin, i.handles),
    draw: (ctx, i) => drawDualVectorResultScene(ctx, i.size.width, i.size.height, i.origin, i.handles, "subtract"),
  },
  "vec-scale": {
    build: (i) => buildVecScaleScene(i.origin, i.handles.a, i.controls.scale),
    draw: (ctx, i) => drawScaleScene(ctx, i.size.width, i.size.height, i.origin, i.handles.a, i.controls.scale),
  },
  "vec-magnitude": {
    build: (i) => buildVecMagnitudeScene(i.origin, i.handles.a),
    draw: (ctx, i) => drawSingleVectorScene(ctx, i.size.width, i.size.height, i.origin, i.handles.a, "magnitude"),
  },
  "vec-magnitude-squared": {
    build: (i) => buildVecMagnitudeSquaredScene(i.origin, i.handles.a),
    draw: (ctx, i) => drawSingleVectorScene(ctx, i.size.width, i.size.height, i.origin, i.handles.a, "magnitude-squared"),
  },
  "vec-normalize": {
    build: (i) => buildVecNormalizeScene(i.origin, i.handles.a),
    draw: (ctx, i) => drawSingleVectorScene(ctx, i.size.width, i.size.height, i.origin, i.handles.a, "normalize"),
  },
  "vec-angle": {
    build: (i) => buildVecAngleScene(i.origin, i.handles.a),
    draw: (ctx, i) => drawSingleVectorScene(ctx, i.size.width, i.size.height, i.origin, i.handles.a, "angle"),
  },
  "vec-dot": {
    build: (i) => buildVecDotScene(i.origin, i.handles),
    draw: (ctx, i) => drawDualVectorScene(ctx, i.size.width, i.size.height, i.origin, i.handles, "dot"),
  },
  "vec-cross": {
    build: (i) => buildVecCrossScene(i.origin, i.handles),
    draw: (ctx, i) => drawDualVectorScene(ctx, i.size.width, i.size.height, i.origin, i.handles, "cross"),
  },
  "vec-angle-between": {
    build: (i) => buildVecAngleBetweenScene(i.origin, i.handles),
    draw: (ctx, i) => drawDualVectorScene(ctx, i.size.width, i.size.height, i.origin, i.handles, "angle-between"),
  },
  "vec-perpendicular": {
    build: (i) => buildVecPerpendicularScene(i.origin, i.handles.a),
    draw: (ctx, i) => drawSingleVectorScene(ctx, i.size.width, i.size.height, i.origin, i.handles.a, "perpendicular"),
  },
  "vec-lerp": {
    build: (i) => buildVecLerpScene(i.origin, i.handles, i.controls.lerp),
    draw: (ctx, i) => drawLerpScene(ctx, i.size.width, i.size.height, i.origin, i.handles, i.controls.lerp),
  },
  "vec-limit": {
    build: (i) => buildVecLimitScene(i.origin, i.handles.a, i.controls.limit),
    draw: (ctx, i) => drawLimitScene(ctx, i.size.width, i.size.height, i.origin, i.handles.a, i.controls.limit),
  },
  "lerp-angle": {
    build: (i) => buildLerpAngleScene(i.demo, i.size, i.handles, i.controls.lerp),
    draw: (ctx, i) => drawLerpAngleScene(ctx, i.size.width, i.size.height, i.handles, i.controls.lerp),
  },
  "get-rotation": {
    build: (i) => buildGetRotationScene(i.points),
    draw: (ctx, i) => drawGetRotationScene(ctx, i.size.width, i.size.height, i.points),
  },
  "point-to-circle": {
    build: (i) => buildPointToCircleScene(i.points, i.circles),
    draw: (ctx, i) => drawPointToCircleScene(ctx, i.size.width, i.size.height, i.circles, i.points),
  },
  "point-to-rect": {
    build: (i) => buildPointToRectScene(i.points),
    draw: (ctx, i) => drawPointToRectScene(ctx, i.size.width, i.size.height, i.points),
  },
  "line-to-point": {
    build: (i) => buildLineToPointScene(i.handles, i.points),
    draw: (ctx, i) => drawLineToPointScene(ctx, i.size.width, i.size.height, i.handles, i.points),
  },
  "circle-to-rect": {
    build: (i) => buildCircleToRectScene(i.circles, i.points),
    draw: (ctx, i) => drawCircleToRectScene(ctx, i.size.width, i.size.height, i.circles, i.points),
  },
  "rect-to-rect": {
    build: (i) => buildRectToRectScene(i.points),
    draw: (ctx, i) => drawRectToRectScene(ctx, i.size.width, i.size.height, i.points),
  },
  "line-to-circle": {
    build: (i) => buildLineToCircleScene(i.handles, i.circles),
    draw: (ctx, i) => drawLineToCircleScene(ctx, i.size.width, i.size.height, i.handles, i.circles),
  },
  "line-to-line": {
    build: (i) => buildLineToLineScene(i.handles, i.points),
    draw: (ctx, i) => drawLineToLineScene(ctx, i.size.width, i.size.height, i.handles, i.points),
  },
  "line-to-rect": {
    build: (i) => buildLineToRectScene(i.handles, i.points),
    draw: (ctx, i) => drawLineToRectScene(ctx, i.size.width, i.size.height, i.handles, i.points),
  },
  "polygon-point": {
    build: (i) => buildPolygonPointScene(i.polyScene),
    draw: (ctx, i) => drawPolygonPointScene(ctx, i.size.width, i.size.height, i.polyScene),
  },
  "point-to-polygon": {
    build: (i) => buildPointToPolygonScene(i.polyScene),
    draw: (ctx, i) => drawPointToPolygonScene(ctx, i.size.width, i.size.height, i.polyScene),
  },
  "rect-to-polygon": {
    build: (i) => buildRectToPolygonScene(i.polyScene),
    draw: (ctx, i) => drawRectToPolygonScene(ctx, i.size.width, i.size.height, i.polyScene),
  },
  "polygon-line": {
    build: (i) => buildPolygonLineScene(i.polyScene),
    draw: (ctx, i) => drawPolygonLineScene(ctx, i.size.width, i.size.height, i.polyScene),
  },
  "polygon-circle": {
    build: (i) => buildPolygonCircleScene(i.polyScene),
    draw: (ctx, i) => drawPolygonCircleScene(ctx, i.size.width, i.size.height, i.polyScene),
  },
  "polygon-polygon": {
    build: (i) => buildPolygonPolygonScene(i.polyScene, "polygonPolygon"),
    draw: (ctx, i) => drawPolygonPolygonScene(ctx, i.size.width, i.size.height, i.polyScene, "polygonPolygon"),
  },
  "polygon-to-polygon": {
    build: (i) => buildPolygonPolygonScene(i.polyScene, "polygonToPolygon"),
    draw: (ctx, i) => drawPolygonPolygonScene(ctx, i.size.width, i.size.height, i.polyScene, "polygonToPolygon"),
  },
};

export function buildScene(i: SceneInputs): SceneData {
  return sceneRegistry[i.demo.kind].build(i);
}

export function drawScene(ctx: CanvasRenderingContext2D, i: SceneInputs): void {
  sceneRegistry[i.demo.kind].draw(ctx, i);
}
