import { useEffect, useMemo, useRef, useState } from "react";
import { distance } from "@utilspalooza/core/Distance";
import { getTriangleData } from "@utilspalooza/core/GetTriangleData";
import { unitCirclePoint } from "@utilspalooza/core/UnitCirclePoint";
import { sineCurve } from "@utilspalooza/core/SineCurve";
import { sineWave } from "@utilspalooza/core/SineWave";
import { waveAmplitude } from "@utilspalooza/core/WaveAmplitude";
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
import "./MiniDemo.scss";

interface ConstructiveGeometryDemoProps {
  demo: ConstructiveGeometryDemoDef;
  height?: number;
}

interface CirclePair {
  circle1: Circle;
  circle2: Circle;
}

interface PointPair {
  point1: Point;
  point2: Point;
}

interface HandlePair {
  a: Point;
  b: Point;
}

interface RailControls {
  scale: number;
  lerp: number;
  limit: number;
  phase: number;
  waveTime: number;
}

type DragState =
  | { kind: "circle"; key: keyof CirclePair; dx: number; dy: number }
  | { kind: "point"; key: keyof PointPair; dx: number; dy: number }
  | { kind: "handle"; key: keyof HandlePair; dx: number; dy: number }
  | { kind: "rail"; key: keyof RailControls; dx: number };

interface ReadoutRow {
  label: string;
  value: string;
  tone?: "live";
}

interface SceneData {
  call: string;
  hint: string;
  readouts: ReadoutRow[];
}

const PAD = 18;

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
    }
  }, [circles, controls, demo, handles, origin, points]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.width * dpr;
    canvas.height = size.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    switch (demo.kind) {
      case "circle-to-circle":
      case "circle-circle":
        drawCircleScene(ctx, size.width, size.height, circles, scene.readouts[4]?.tone === "live");
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
    }
  }, [circles, controls, demo.kind, handles, origin, points, scene.readouts, size.height, size.width]);

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(event, canvasRef.current);
    if (!point) return;

    const drag = getDragState(point, demo.kind, circles, points, handles, controls, size.width, size.height);
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
        if ((demo.kind === "unit-circle-point" || demo.kind === "sine-curve") && drag.key === "a") {
          const layout = unitCircleLayout(size.width, size.height);
          setHandles((current) => ({
            ...current,
            a: snapPointToCircle(
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

function buildCircleScene(demo: ConstructiveGeometryDemoDef, circles: CirclePair): SceneData {
  const { circle1, circle2 } = circles;
  const centerDistance = distance(circle1, circle2);
  const triangle = getTriangleData(circle1, circle2);
  const sumRadius = circle1.radius + circle2.radius;
  const hit = demo.hitTest ? demo.hitTest(circle1, circle2) : false;

  return {
    call:
      demo.kind === "circle-circle"
        ? `${demo.fnName}(${formatCircleObject(circle1)}, ${formatCircleObject(circle2)}) = ${hit}`
        : `${demo.fnName}(${fmt(circle1.x)}, ${fmt(circle1.y)}, ${fmt(circle1.radius)}, ${fmt(circle2.x)}, ${fmt(circle2.y)}, ${fmt(circle2.radius)}) = ${hit}`,
    hint:
      "Drag either circle. The right triangle shows how the center-to-center distance is derived, then the demo compares that distance against r1 + r2.",
    readouts: [
      { label: "dx", value: fmtSigned(triangle.dx) },
      { label: "dy", value: fmtSigned(triangle.dy) },
      { label: "distance", value: `√(${fmtAbs(triangle.dx)}² + ${fmtAbs(triangle.dy)}²) = ${fmt(centerDistance)}` },
      { label: "compare", value: `${fmt(centerDistance)} ${centerDistance <= sumRadius ? "<=" : ">"} ${fmt(sumRadius)}` },
      { label: "state", value: hit ? "touching!" : "not touching yet", tone: hit ? "live" : undefined },
    ],
  };
}

function buildDistanceScene(points: PointPair): SceneData {
  const d = distance(points.point1, points.point2);
  const triangle = getTriangleData(points.point1, points.point2);
  return {
    call: `distance(${formatPoint(points.point1)}, ${formatPoint(points.point2)}) = ${fmt(d)}`,
    hint:
      "Drag either point. This is the simplest constructive-geometry cut: the horizontal run and vertical rise are free, so the only mystery left is the hypotenuse.",
    readouts: [
      { label: "dx", value: fmtSigned(triangle.dx) },
      { label: "dy", value: fmtSigned(triangle.dy) },
      { label: "distance", value: `√(${fmtAbs(triangle.dx)}² + ${fmtAbs(triangle.dy)}²) = ${fmt(d)}` },
    ],
  };
}

function buildUnitCirclePointScene(width: number, height: number, handle: Point): SceneData {
  const layout = unitCircleLayout(width, height);
  const angle = Math.atan2(handle.y - layout.center.y, handle.x - layout.center.x);
  const point = unitCirclePoint(layout.center.x, layout.center.y, layout.radius, angle);
  const dx = point.x - layout.center.x;
  const dy = point.y - layout.center.y;
  const sampleY = sineCurve(layout.center.y, layout.radius, 1, angle - Math.PI / 2);

  return {
    call: `unitCirclePoint(${fmt(layout.center.x)}, ${fmt(layout.center.y)}, ${fmt(layout.radius)}, ${fmt(angle)})`,
    hint:
      "Drag the point around the circle. Cosine is the horizontal share of the radius; sine is the vertical share. In canvas coordinates, positive y points downward, so positive sine moves the point down.",
    readouts: [
      { label: "angle", value: `${fmt(angle)} rad = ${fmt(radToDeg(angle))}°` },
      { label: "cos", value: fmt(point.cos) },
      { label: "sin", value: fmt(point.sin) },
      { label: "point", value: formatPoint({ x: point.x, y: point.y }) },
      { label: "x / y", value: `${fmtSigned(dx)} , ${fmtSigned(dy)}`, tone: "live" },
      { label: "same y via sineCurve", value: fmt(sampleY) },
    ],
  };
}

function buildSineWaveScene(width: number, height: number, handle: Point, phase: number): SceneData {
  const centerY = Math.round(height * 0.52);
  const originX = 48;
  const crestDx = Math.max(30, handle.x - originX);
  const wavelength = Math.max(60, crestDx * 4);
  const amplitude = Math.max(12, centerY - handle.y);
  const sampleX = Math.round(width * 0.58);
  const sampleY = sineWave(sampleX, centerY, amplitude, wavelength, phase);

  return {
    call: `sineWave(x, ${fmt(centerY)}, ${fmt(amplitude)}, ${fmt(wavelength)}, ${fmt(phase)})`,
    hint:
      "Drag the crest handle or the orange phase rail. The handle sets the wave's height and quarter-wavelength; phase shifts the whole oscillation left and right.",
    readouts: [
      { label: "centerY", value: fmt(centerY) },
      { label: "amplitude", value: fmt(amplitude) },
      { label: "wavelength", value: fmt(wavelength) },
      { label: "phase", value: fmt(phase) },
      { label: `y @ x=${fmt(sampleX)}`, value: fmt(sampleY), tone: "live" },
    ],
  };
}

function buildSineCurveScene(width: number, height: number, handle: Point): SceneData {
  const layout = unitCircleLayout(width, height);
  const angle = Math.atan2(handle.y - layout.center.y, handle.x - layout.center.x);
  const point = unitCirclePoint(layout.center.x, layout.center.y, layout.radius, angle);
  const value = sineCurve(layout.center.y, layout.radius, 1, angle);

  return {
    call: `sineCurve(${fmt(layout.center.y)}, ${fmt(layout.radius)}, 1, ${fmt(angle)}) = ${fmt(value)}`,
    hint:
      "Drag the point around the unit circle. `sineCurve()` is just baseline + sine(time) × amplitude, so using the circle angle as time gives the exact same y-position on the right.",
    readouts: [
      { label: "time", value: `${fmt(angle)} rad = ${fmt(radToDeg(angle))}°` },
      { label: "baseline", value: fmt(layout.center.y) },
      { label: "amplitude", value: fmt(layout.radius) },
      { label: "sin(time)", value: fmt(point.sin) },
      { label: "returned y", value: fmt(value), tone: "live" },
      { label: "matches point y", value: fmt(point.y) },
    ],
  };
}

function buildWaveAmplitudeScene(sample: Point, handles: HandlePair, time: number): SceneData {
  const sources = [handles.a, handles.b];
  const k = 0.05;
  const omega = 0.1;
  const r1 = distance(sample, handles.a);
  const r2 = distance(sample, handles.b);
  const a1 = Math.cos(k * r1 - omega * time);
  const a2 = Math.cos(k * r2 - omega * time);
  const value = waveAmplitude(sample.x, sample.y, sources, time, k, omega);

  return {
    call:
      `waveAmplitude(${fmt(sample.x)}, ${fmt(sample.y)}, [` +
      `${formatPoint(handles.a)}, ${formatPoint(handles.b)}], ${fmt(time)}, ${fmt(k)}, ${fmt(omega)}) = ${fmt(value)}`,
    hint:
      "Drag either source, drag the sample point, or scrub time. Each source contributes one cosine term based on its distance to the sample point; `waveAmplitude()` averages those terms into one interference value.",
    readouts: [
      { label: "sample", value: formatPoint(sample) },
      { label: "time", value: fmt(time) },
      { label: "r1 → cos(...)", value: `${fmt(r1)} → ${fmt(a1)}` },
      { label: "r2 → cos(...)", value: `${fmt(r2)} → ${fmt(a2)}` },
      { label: "average", value: fmt(value), tone: "live" },
    ],
  };
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

function drawCircleScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  circles: CirclePair,
  hit: boolean,
) {
  const { circle1, circle2 } = circles;
  const corner = { x: circle2.x, y: circle1.y };
  const dx = circle2.x - circle1.x;
  const dy = circle2.y - circle1.y;
  const dist = distance(circle1, circle2);
  const sumRadius = circle1.radius + circle2.radius;

  drawBackdrop(ctx, width, height);

  const circle1Color = hit ? "#f97316" : "#818cf8";
  const circle2Color = hit ? "#fb7185" : "#a78bfa";

  drawCircle(ctx, circle1, circle1Color, "r1");
  drawCircle(ctx, circle2, circle2Color, "r2");
  drawRightTriangle(ctx, circle1, circle2, corner, hit);
  drawCenter(ctx, circle1, circle1Color);
  drawCenter(ctx, circle2, circle2Color);
  drawCenter(ctx, corner, "rgba(125, 211, 252, 0.8)", 4);

  drawHeaderBox(ctx, [
    { text: `distance = ${fmt(dist)}`, color: "#e2e8f0" },
    { text: `compare against r1 + r2 = ${fmt(sumRadius)}`, color: hit ? "#fb923c" : "#cbd5e1" },
  ]);

  labelSegment(ctx, circle1.x + dx / 2, circle1.y - 12, `dx = ${fmtSigned(dx)}`, "rgba(96, 165, 250, 0.95)");
  labelSegment(ctx, corner.x + 12, circle1.y + dy / 2, `dy = ${fmtSigned(dy)}`, "rgba(125, 211, 252, 0.95)");
  labelSegment(
    ctx,
    circle1.x + dx / 2,
    circle1.y + dy / 2 - 16,
    `hyp = ${fmt(dist)}`,
    hit ? "rgba(249, 115, 22, 0.98)" : "rgba(255, 255, 255, 0.95)",
  );

  if (hit) {
    drawStatusPill(ctx, width - 156, 18, "touching!");
  }
}

function drawDistanceScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  points: PointPair,
) {
  const { point1, point2 } = points;
  const triangle = getTriangleData(point1, point2);
  const d = distance(point1, point2);
  const corner = { x: point2.x, y: point1.y };

  drawBackdrop(ctx, width, height);
  drawPoint(ctx, point1, "#818cf8", "p1");
  drawPoint(ctx, point2, "#fb7185", "p2");
  drawRightTriangle(ctx, point1, point2, corner, false);
  drawCenter(ctx, corner, "rgba(125, 211, 252, 0.8)", 4);

  drawHeaderBox(ctx, [{ text: `distance = ${fmt(d)}`, color: "#e2e8f0" }]);
  labelSegment(ctx, point1.x + triangle.dx / 2, point1.y - 12, `dx = ${fmtSigned(triangle.dx)}`, "rgba(96, 165, 250, 0.95)");
  labelSegment(ctx, corner.x + 12, point1.y + triangle.dy / 2, `dy = ${fmtSigned(triangle.dy)}`, "rgba(125, 211, 252, 0.95)");
  labelSegment(ctx, point1.x + triangle.dx / 2, point1.y + triangle.dy / 2 - 16, `hyp = ${fmt(d)}`, "rgba(255, 255, 255, 0.95)");
}

function drawUnitCirclePointScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  handle: Point,
) {
  const layout = unitCircleLayout(width, height);
  const angle = Math.atan2(handle.y - layout.center.y, handle.x - layout.center.x);
  const point = unitCirclePoint(layout.center.x, layout.center.y, layout.radius, angle);
  const corner = { x: point.x, y: layout.center.y };

  drawBackdrop(ctx, width, height);
  drawAxes(ctx, width, height, layout.center);
  drawUnitCircle(ctx, layout.center, layout.radius);
  drawVector(ctx, layout.center, point, "#818cf8", "r");
  drawComponentGuides(ctx, layout.center, point);
  drawCenter(ctx, layout.center, "#f8fafc", 5);
  drawCenter(ctx, point, "#fb7185", 7);
  drawCenter(ctx, corner, "rgba(125, 211, 252, 0.8)", 4);

  drawAngleArc(ctx, layout.center, point, 40, "rgba(249, 115, 22, 0.95)");
  drawHeaderBox(ctx, [
    { text: `cos = ${fmt(point.cos)}`, color: "#86efac" },
    { text: `sin = ${fmt(point.sin)}`, color: "#fb923c" },
  ]);

  labelSegment(
    ctx,
    layout.center.x + (point.x - layout.center.x) / 2,
    layout.center.y + 18,
    `x = ${fmtSigned(point.x - layout.center.x)}`,
    "rgba(134, 239, 172, 0.95)",
  );
  labelSegment(
    ctx,
    point.x + 18,
    layout.center.y + (point.y - layout.center.y) / 2,
    `y = ${fmtSigned(point.y - layout.center.y)}`,
    "rgba(251, 146, 60, 0.95)",
  );
  labelSegment(
    ctx,
    layout.center.x + 52,
    layout.center.y - 12,
    `${fmt(radToDeg(angle))}°`,
    "rgba(249, 115, 22, 0.98)",
  );
}

function drawSineWaveScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  handle: Point,
  phase: number,
) {
  const centerY = Math.round(height * 0.52);
  const originX = 48;
  const crestDx = Math.max(30, handle.x - originX);
  const wavelength = Math.max(60, crestDx * 4);
  const amplitude = Math.max(12, centerY - handle.y);
  const crestX = originX + wavelength / 4;
  const crestY = centerY - amplitude;
  const sampleX = Math.round(width * 0.58);
  const sampleY = sineWave(sampleX, centerY, amplitude, wavelength, phase);

  drawBackdrop(ctx, width, height);

  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(PAD, centerY);
  ctx.lineTo(width - PAD, centerY);
  ctx.stroke();

  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = "rgba(96, 165, 250, 0.9)";
  ctx.beginPath();
  ctx.moveTo(originX, centerY);
  ctx.lineTo(originX, crestY);
  ctx.stroke();

  ctx.strokeStyle = "rgba(125, 211, 252, 0.9)";
  ctx.beginPath();
  ctx.moveTo(originX, crestY);
  ctx.lineTo(crestX, crestY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = "#818cf8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = PAD; x <= width - PAD; x += 2) {
    const y = sineWave(x, centerY, amplitude, wavelength, phase);
    if (x === PAD) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  drawCenter(ctx, { x: crestX, y: crestY }, "#fb7185", 7);
  labelSegment(ctx, crestX + 18, crestY - 10, "crest", "#fb7185");

  drawCenter(ctx, { x: sampleX, y: sampleY }, "#f97316", 6);
  labelSegment(ctx, sampleX + 22, sampleY - 12, `y = ${fmt(sampleY)}`, "#f97316");

  labelSegment(ctx, originX + 18, centerY - amplitude / 2, `amp = ${fmt(amplitude)}`, "rgba(96, 165, 250, 0.95)");
  labelSegment(ctx, originX + wavelength / 8, crestY - 14, `λ/4 = ${fmt(wavelength / 4)}`, "rgba(125, 211, 252, 0.95)");

  drawRail(ctx, width, height, "phase", phase, -1, 1);
  drawHeaderBox(ctx, [
    { text: `phase = ${fmt(phase)}`, color: "#e2e8f0" },
    { text: `sample y = ${fmt(sampleY)}`, color: "#fdba74" },
  ]);
}

function drawSineCurveScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  handle: Point,
) {
  const layout = unitCircleLayout(width, height);
  const angle = Math.atan2(handle.y - layout.center.y, handle.x - layout.center.x);
  const point = unitCirclePoint(layout.center.x, layout.center.y, layout.radius, angle);
  const value = sineCurve(layout.center.y, layout.radius, 1, angle);
  const corner = { x: point.x, y: layout.center.y };
  const graphX = Math.round(width * 0.72);
  const graphLeft = Math.round(width * 0.5);
  const graphTop = layout.center.y - layout.radius;
  const graphBottom = layout.center.y + layout.radius;

  drawBackdrop(ctx, width, height);
  drawAxes(ctx, width, height, layout.center);
  drawUnitCircle(ctx, layout.center, layout.radius);
  drawVector(ctx, layout.center, point, "#818cf8", "r");
  drawComponentGuides(ctx, layout.center, point);
  drawCenter(ctx, layout.center, "#f8fafc", 5);
  drawCenter(ctx, point, "#fb7185", 7);
  drawCenter(ctx, corner, "rgba(125, 211, 252, 0.8)", 4);

  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(graphLeft, layout.center.y);
  ctx.lineTo(width - PAD, layout.center.y);
  ctx.stroke();

  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = "rgba(251, 146, 60, 0.85)";
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(graphX, point.y);
  ctx.stroke();

  ctx.strokeStyle = "rgba(96, 165, 250, 0.85)";
  ctx.beginPath();
  ctx.moveTo(graphX, graphTop);
  ctx.lineTo(graphX, graphBottom);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCenter(ctx, { x: graphX, y: value }, "#f97316", 7);
  labelSegment(ctx, graphX + 24, value - 10, `y = ${fmt(value)}`, "#f97316");
  labelSegment(ctx, graphX + 26, layout.center.y - 10, "baseline", "rgba(255,255,255,0.92)");
  labelSegment(ctx, graphX + 34, graphTop + 8, `amp = ${fmt(layout.radius)}`, "rgba(96, 165, 250, 0.95)");

  drawHeaderBox(ctx, [
    { text: `sin(time) = ${fmt(point.sin)}`, color: "#fb923c" },
    { text: `baseline + sin(time) * amplitude = ${fmt(value)}`, color: "#e2e8f0" },
  ]);

  labelSegment(
    ctx,
    layout.center.x + 52,
    layout.center.y - 12,
    `${fmt(radToDeg(angle))}°`,
    "rgba(249, 115, 22, 0.98)",
  );
}

function drawWaveAmplitudeScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  sample: Point,
  handles: HandlePair,
  time: number,
) {
  const sources = [handles.a, handles.b];
  const colors = ["#818cf8", "#fb7185"];
  const k = 0.05;
  const omega = 0.1;
  const value = waveAmplitude(sample.x, sample.y, sources, time, k, omega);
  const radii = sources.map((source) => distance(sample, source));
  const contributions = radii.map((radius) => Math.cos(k * radius - omega * time));
  const meter = {
    x: width - 54,
    top: 42,
    bottom: height - 52,
  };
  const meterMid = (meter.top + meter.bottom) / 2;
  const meterY = meterMid - value * ((meter.bottom - meter.top) / 2);

  drawBackdrop(ctx, width, height);

  sources.forEach((source, index) => {
    ctx.strokeStyle = `${colors[index]}66`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(source.x, source.y, radii[index], 0, Math.PI * 2);
    ctx.stroke();

    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = `${colors[index]}cc`;
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(sample.x, sample.y);
    ctx.stroke();
    ctx.setLineDash([]);

    drawCenter(ctx, source, colors[index], 7);
    labelSegment(ctx, source.x + 22, source.y - 10, `s${index + 1}`, colors[index]);
  });

  drawCenter(ctx, sample, "#f97316", 7);
  labelSegment(ctx, sample.x + 24, sample.y - 10, "sample", "#f97316");

  labelSegment(
    ctx,
    (handles.a.x + sample.x) / 2,
    (handles.a.y + sample.y) / 2 - 12,
    `r1 = ${fmt(radii[0])}`,
    colors[0],
  );
  labelSegment(
    ctx,
    (handles.b.x + sample.x) / 2,
    (handles.b.y + sample.y) / 2 + 16,
    `r2 = ${fmt(radii[1])}`,
    colors[1],
  );

  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(meter.x, meter.top);
  ctx.lineTo(meter.x, meter.bottom);
  ctx.stroke();

  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(meter.x - 18, meterMid);
  ctx.lineTo(meter.x + 18, meterMid);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCenter(ctx, { x: meter.x, y: meterY }, "#f97316", 7);
  labelSegment(ctx, meter.x - 10, meter.top - 6, "+1", "#f8fafc");
  labelSegment(ctx, meter.x - 8, meterMid - 8, "0", "#cbd5e1");
  labelSegment(ctx, meter.x - 10, meter.bottom + 4, "-1", "#f8fafc");
  labelSegment(ctx, meter.x - 44, meterY - 10, `amp = ${fmt(value)}`, "#f97316");

  drawRail(ctx, width, height, "waveTime", time, 0, 60);
  drawHeaderBox(ctx, [
    { text: `cos1 = ${fmt(contributions[0])}`, color: colors[0] },
    { text: `cos2 = ${fmt(contributions[1])}`, color: colors[1] },
    { text: `average = ${fmt(value)}`, color: "#fdba74" },
  ]);
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

function drawBackdrop(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let x = 24; x < width; x += 24) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 24; y < height; y += 24) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function drawAxes(ctx: CanvasRenderingContext2D, width: number, height: number, origin: Point) {
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(PAD, origin.y);
  ctx.lineTo(width - PAD, origin.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(origin.x, PAD);
  ctx.lineTo(origin.x, height - PAD);
  ctx.stroke();
}

function drawRightTriangle(
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  corner: Point,
  hit: boolean,
) {
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(96, 165, 250, 0.9)";
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(corner.x, corner.y);
  ctx.stroke();

  ctx.strokeStyle = "rgba(125, 211, 252, 0.9)";
  ctx.beginPath();
  ctx.moveTo(corner.x, corner.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.lineWidth = 3;
  ctx.strokeStyle = hit ? "rgba(249, 115, 22, 0.95)" : "rgba(255, 255, 255, 0.92)";
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

function drawHeaderBox(
  ctx: CanvasRenderingContext2D,
  lines: Array<{ text: string; color: string }>,
) {
  const width = Math.max(...lines.map((line) => ctx.measureText(line.text).width)) + 24;
  const height = 16 + lines.length * 18;
  ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
  ctx.fillRect(18, 14, width, height);
  ctx.font = "600 12px 'Space Mono', monospace";
  lines.forEach((line, index) => {
    ctx.fillStyle = line.color;
    ctx.fillText(line.text, 30, 33 + index * 18);
  });
}

function drawStatusPill(ctx: CanvasRenderingContext2D, x: number, y: number, text: string) {
  ctx.fillStyle = "rgba(249, 115, 22, 0.18)";
  ctx.fillRect(x, y, 136, 34);
  ctx.font = "700 14px 'Space Mono', monospace";
  ctx.fillStyle = "#fdba74";
  ctx.fillText(text, x + 24, y + 22);
}

function drawCircle(ctx: CanvasRenderingContext2D, circle: Circle, color: string, radiusLabel: string) {
  ctx.fillStyle = `${color}1f`;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.font = "600 12px 'Space Mono', monospace";
  ctx.fillStyle = color;
  ctx.fillText(`${radiusLabel} = ${fmt(circle.radius)}`, circle.x - circle.radius + 8, circle.y - circle.radius - 10);
}

function drawPoint(ctx: CanvasRenderingContext2D, point: Point, color: string, label: string) {
  drawCenter(ctx, point, color, 7);
  labelSegment(ctx, point.x + 18, point.y - 10, label, color);
}

function drawOrigin(ctx: CanvasRenderingContext2D, origin: Point) {
  drawCenter(ctx, origin, "#f8fafc", 5);
  labelSegment(ctx, origin.x + 20, origin.y - 10, "origin", "#f8fafc");
}

function drawVector(
  ctx: CanvasRenderingContext2D,
  origin: Point,
  handle: Point,
  color: string,
  label: string,
) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(handle.x, handle.y);
  ctx.stroke();

  const dx = handle.x - origin.x;
  const dy = handle.y - origin.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const arrowSize = 10;
  ctx.beginPath();
  ctx.moveTo(handle.x, handle.y);
  ctx.lineTo(handle.x - ux * arrowSize - uy * 5, handle.y - uy * arrowSize + ux * 5);
  ctx.lineTo(handle.x - ux * arrowSize + uy * 5, handle.y - uy * arrowSize - ux * 5);
  ctx.closePath();
  ctx.fill();

  drawCenter(ctx, handle, color, 7);
  labelSegment(ctx, handle.x + 16, handle.y - 10, label, color);
}

function drawComponentGuides(ctx: CanvasRenderingContext2D, origin: Point, handle: Point) {
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(96, 165, 250, 0.9)";
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(handle.x, origin.y);
  ctx.stroke();

  ctx.strokeStyle = "rgba(125, 211, 252, 0.9)";
  ctx.beginPath();
  ctx.moveTo(handle.x, origin.y);
  ctx.lineTo(handle.x, handle.y);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawUnitCircle(ctx: CanvasRenderingContext2D, origin: Point, radius: number) {
  ctx.strokeStyle = "rgba(249, 115, 22, 0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(origin.x, origin.y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawAngleArc(
  ctx: CanvasRenderingContext2D,
  origin: Point,
  handle: Point,
  radius: number,
  color: string,
) {
  const endAngle = Math.atan2(handle.y - origin.y, handle.x - origin.x);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(origin.x, origin.y, radius, 0, endAngle, endAngle < 0);
  ctx.stroke();
}

function drawAngleArcBetween(
  ctx: CanvasRenderingContext2D,
  origin: Point,
  a: Point,
  b: Point,
  radius: number,
  color: string,
) {
  const start = Math.atan2(a.y - origin.y, a.x - origin.x);
  let end = Math.atan2(b.y - origin.y, b.x - origin.x);
  while (end - start > Math.PI) end -= Math.PI * 2;
  while (end - start < -Math.PI) end += Math.PI * 2;

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(origin.x, origin.y, radius, start, end, end < start);
  ctx.stroke();
}

function drawParallelogram(ctx: CanvasRenderingContext2D, origin: Point, a: Point, b: Point) {
  const far = { x: a.x + (b.x - origin.x), y: a.y + (b.y - origin.y) };
  ctx.fillStyle = "rgba(249, 115, 22, 0.12)";
  ctx.strokeStyle = "rgba(249, 115, 22, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(a.x, a.y);
  ctx.lineTo(far.x, far.y);
  ctx.lineTo(b.x, b.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawRail(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  key: keyof RailControls,
  value: number,
  min: number,
  max: number,
) {
  const y = height - 26;
  const x0 = width - 164;
  const x1 = width - 28;
  const frac = (value - min) / (max - min);
  const x = x0 + frac * (x1 - x0);
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.lineTo(x1, y);
  ctx.stroke();
  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "600 12px 'Space Mono', monospace";
  ctx.fillStyle = "#fdba74";
  ctx.fillText(`${key}: ${fmt(value)}`, x0, y - 10);
}

function drawCenter(
  ctx: CanvasRenderingContext2D,
  point: { x: number; y: number },
  color: string,
  radius: number = 5,
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function labelSegment(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  color: string,
) {
  ctx.font = "600 12px 'Space Mono', monospace";
  const metrics = ctx.measureText(text);
  const w = metrics.width + 12;
  ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
  ctx.fillRect(x - w / 2, y - 12, w, 18);
  ctx.fillStyle = color;
  ctx.fillText(text, x - metrics.width / 2, y + 1);
}

function getDragState(
  point: Point,
  kind: ConstructiveGeometryDemoDef["kind"],
  circles: CirclePair,
  points: PointPair,
  handles: HandlePair,
  controls: RailControls,
  width: number,
  height: number,
): DragState | null {
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

  if (kind === "distance") {
    const keys: (keyof PointPair)[] = ["point2", "point1"];
    for (const key of keys) {
      const current = points[key];
      if (Math.hypot(point.x - current.x, point.y - current.y) <= 14) {
        return { kind: "point", key, dx: point.x - current.x, dy: point.y - current.y };
      }
    }
    return null;
  }

  if (kind === "unit-circle-point" || kind === "sine-curve") {
    const current = handles.a;
    if (Math.hypot(point.x - current.x, point.y - current.y) <= 14) {
      return { kind: "handle", key: "a", dx: point.x - current.x, dy: point.y - current.y };
    }
    return null;
  }

  if (
    kind === "vec-scale" ||
    kind === "vec-lerp" ||
    kind === "vec-limit" ||
    kind === "sine-wave" ||
    kind === "wave-amplitude"
  ) {
    const railKey: keyof RailControls =
      kind === "vec-scale"
        ? "scale"
        : kind === "vec-lerp"
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

  const keys: (keyof HandlePair)[] = ["b", "a"];
  for (const key of keys) {
    const current = handles[key];
    if (Math.hypot(point.x - current.x, point.y - current.y) <= 14) {
      return { kind: "handle", key, dx: point.x - current.x, dy: point.y - current.y };
    }
  }
  return null;
}

function getCanvasPoint(
  event: React.PointerEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement | null,
) {
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function clampCircle(circle: Circle, width: number, height: number): Circle {
  return {
    ...circle,
    x: clamp(circle.x, circle.radius + PAD, width - circle.radius - PAD),
    y: clamp(circle.y, circle.radius + PAD, height - circle.radius - PAD),
  };
}

function clampPoint(point: Point, width: number, height: number): Point {
  return {
    x: clamp(point.x, PAD, width - PAD),
    y: clamp(point.y, PAD, height - PAD),
  };
}

function vectorFromHandle(handle: Point, origin: Point): Vector {
  return {
    x: Math.round((handle.x - origin.x) * 10) / 10,
    y: Math.round((origin.y - handle.y) * 10) / 10,
  };
}

function handleFromVector(origin: Point, vector: Vector, scale: number): Point {
  return {
    x: origin.x + vector.x * scale,
    y: origin.y - vector.y * scale,
  };
}

function unitCircleLayout(width: number, height: number) {
  return {
    center: {
      x: Math.round(width * 0.28),
      y: Math.round(height * 0.58),
    },
    radius: Math.min(84, Math.round(width * 0.18), Math.round(height * 0.28)),
  };
}

function snapPointToCircle(point: Point, layout: ReturnType<typeof unitCircleLayout>): Point {
  const dx = point.x - layout.center.x;
  const dy = point.y - layout.center.y;
  const length = Math.hypot(dx, dy) || 1;
  return {
    x: Math.round(layout.center.x + (dx / length) * layout.radius),
    y: Math.round(layout.center.y + (dy / length) * layout.radius),
  };
}

function dotReading(dot: number, angle: number) {
  if (Math.abs(dot) < 0.001) return "perpendicular: no overlap";
  if (dot > 0) return `same-ish way (${fmt(radToDeg(angle))}° apart)`;
  return `opposed (${fmt(radToDeg(angle))}° apart)`;
}

function crossReading(cross: number) {
  if (Math.abs(cross) < 0.001) return "collinear / zero area";
  return cross > 0 ? "counter-clockwise turn" : "clockwise turn";
}

function railPosition(
  key: keyof RailControls,
  value: number,
  width: number,
  height: number,
) {
  const x0 = width - 164;
  const x1 = width - 28;
  const y = height - 26;
  const min = key === "scale" ? -2 : key === "lerp" ? 0 : key === "phase" ? -1 : 20;
  const max = key === "scale" ? 2 : key === "lerp" ? 1 : key === "phase" ? 1 : key === "waveTime" ? 60 : 140;
  const resolvedMin = key === "waveTime" ? 0 : min;
  const frac = (value - resolvedMin) / (max - resolvedMin);
  return { x: x0 + frac * (x1 - x0), y };
}

function railValueForPosition(
  key: keyof RailControls,
  x: number,
  _origin: Point,
  width: number,
) {
  const x0 = width - 164;
  const x1 = width - 28;
  const frac = clamp((x - x0) / (x1 - x0), 0, 1);
  if (key === "scale") return -2 + frac * 4;
  if (key === "lerp") return frac;
  if (key === "phase") return -1 + frac * 2;
  if (key === "waveTime") return frac * 60;
  return 20 + frac * 120;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatPoint(point: Point) {
  return `{ x: ${fmt(point.x)}, y: ${fmt(point.y)} }`;
}

function formatCircleObject(circle: Circle) {
  return `{ x: ${fmt(circle.x)}, y: ${fmt(circle.y)}, radius: ${fmt(circle.radius)} }`;
}

function formatVector(vector: Vector) {
  return `{ x: ${fmt(vector.x)}, y: ${fmt(vector.y)} }`;
}

function fmt(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function fmtSigned(value: number) {
  return `${value >= 0 ? "+" : ""}${fmt(value)}`;
}

function fmtAbs(value: number) {
  return fmt(Math.abs(value));
}

function radToDeg(value: number) {
  return (value * 180) / Math.PI;
}
