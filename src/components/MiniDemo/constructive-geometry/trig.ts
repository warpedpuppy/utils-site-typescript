// Trig family (kinds: "unit-circle-point", "sine-wave", "sine-curve", "wave-amplitude").
// Moved verbatim from ConstructiveGeometryDemo.tsx (behavior-identical).
import { distance } from "@utilspalooza/core/Distance";
import { unitCirclePoint } from "@utilspalooza/core/UnitCirclePoint";
import { sineCurve } from "@utilspalooza/core/SineCurve";
import { sineWave } from "@utilspalooza/core/SineWave";
import { waveAmplitude } from "@utilspalooza/core/WaveAmplitude";
import type { Point } from "@utilspalooza/core";
import type { HandlePair, SceneData } from "./types";
import {
  PAD,
  drawBackdrop,
  drawAxes,
  drawUnitCircle,
  drawVector,
  drawComponentGuides,
  drawCenter,
  drawAngleArc,
  drawHeaderBox,
  labelSegment,
  drawRail,
  unitCircleLayout,
  normalizeCycleAngle,
  normalizeCycleFraction,
  radToDeg,
  fmt,
  fmtSigned,
  formatPoint,
} from "./shared";

export function buildUnitCirclePointScene(width: number, height: number, handle: Point): SceneData {
  const layout = unitCircleLayout(width, height);
  const angle = Math.atan2(handle.y - layout.center.y, handle.x - layout.center.x);
  const cycleAngle = normalizeCycleAngle(angle);
  const cycleFraction = cycleAngle / (Math.PI * 2);
  const point = unitCirclePoint(layout.center.x, layout.center.y, layout.radius, angle);
  const dx = point.x - layout.center.x;
  const dy = point.y - layout.center.y;
  const sampleY = sineCurve(layout.center.y, layout.radius, 1, angle - Math.PI / 2);

  return {
    call: `unitCirclePoint(${fmt(layout.center.x)}, ${fmt(layout.center.y)}, ${fmt(layout.radius)}, ${fmt(angle)})`,
    hint:
      "Drag the point around the circle. One angle gives you three linked facts at once: cosine is the horizontal radius share, sine is the vertical radius share, and that same angle is already a sample position on the 0→2π sine cycle.",
    readouts: [
      { label: "angle", value: `${fmt(angle)} rad = ${fmt(radToDeg(angle))}°` },
      { label: "cycle position", value: `${fmt(cycleAngle)} rad = ${fmt(cycleFraction * 100)}% of 2π` },
      { label: "cos", value: fmt(point.cos) },
      { label: "sin", value: fmt(point.sin) },
      { label: "x offset", value: `${fmt(point.cos)} × ${fmt(layout.radius)} = ${fmtSigned(dx)}` },
      { label: "y offset", value: `${fmt(point.sin)} × ${fmt(layout.radius)} = ${fmtSigned(dy)}`, tone: "live" },
      { label: "returned point", value: formatPoint({ x: point.x, y: point.y }) },
      { label: "same y on sine strip", value: fmt(sampleY) },
    ],
  };
}

export function buildSineWaveScene(width: number, height: number, handle: Point, phase: number): SceneData {
  const centerY = Math.round(height * 0.52);
  const originX = 48;
  const crestDx = Math.max(30, handle.x - originX);
  const wavelength = Math.max(60, crestDx * 4);
  const amplitude = Math.max(12, centerY - handle.y);
  const sampleX = Math.round(width * 0.58);
  const sampleY = sineWave(sampleX, centerY, amplitude, wavelength, phase);
  const cycleFraction = normalizeCycleFraction(sampleX / wavelength + phase);
  const cycleAngle = cycleFraction * Math.PI * 2;
  const offset = sampleY - centerY;

  return {
    call: `sineWave(x, ${fmt(centerY)}, ${fmt(amplitude)}, ${fmt(wavelength)}, ${fmt(phase)})`,
    hint:
      "Drag the crest handle or the orange phase rail. This is the same sine story as `sineCurve()`, except the cycle is spread across x-distance: every wavelength repeats one full 0→2π oscillation.",
    readouts: [
      { label: "centerY", value: fmt(centerY) },
      { label: "amplitude", value: fmt(amplitude) },
      { label: "wavelength", value: fmt(wavelength) },
      { label: "phase", value: fmt(phase) },
      { label: "cycle position", value: `${fmt(cycleFraction * wavelength)} px = ${fmt(cycleFraction * 100)}% of λ = ${fmt(cycleAngle)} rad` },
      { label: "sin(cycle) × amplitude", value: `${fmt(Math.sin(cycleAngle))} × ${fmt(amplitude)} = ${fmtSigned(offset)}` },
      { label: `y @ x=${fmt(sampleX)}`, value: `${fmt(centerY)} + ${fmtSigned(offset)} = ${fmt(sampleY)}`, tone: "live" },
    ],
  };
}

export function buildSineCurveScene(width: number, height: number, handle: Point): SceneData {
  const layout = unitCircleLayout(width, height);
  const angle = Math.atan2(handle.y - layout.center.y, handle.x - layout.center.x);
  const cycleAngle = normalizeCycleAngle(angle);
  const cycleFraction = cycleAngle / (Math.PI * 2);
  const point = unitCirclePoint(layout.center.x, layout.center.y, layout.radius, angle);
  const value = sineCurve(layout.center.y, layout.radius, 1, angle);

  return {
    call: `sineCurve(${fmt(layout.center.y)}, ${fmt(layout.radius)}, 1, ${fmt(angle)}) = ${fmt(value)}`,
    hint:
      "Drag the same circle point as before. Nothing new is hiding here: `sineCurve()` just takes that sine height, scales it by amplitude, and lays the motion out across a full 0→2π cycle.",
    readouts: [
      { label: "time", value: `${fmt(angle)} rad = ${fmt(radToDeg(angle))}°` },
      { label: "cycle position", value: `${fmt(cycleAngle)} rad = ${fmt(cycleFraction * 100)}% of 2π` },
      { label: "baseline", value: fmt(layout.center.y) },
      { label: "amplitude", value: fmt(layout.radius) },
      { label: "sin(time)", value: fmt(point.sin) },
      { label: "sin × amplitude", value: `${fmt(point.sin)} × ${fmt(layout.radius)} = ${fmtSigned(point.y - layout.center.y)}` },
      { label: "returned y", value: `${fmt(layout.center.y)} + ${fmtSigned(point.y - layout.center.y)} = ${fmt(value)}`, tone: "live" },
      { label: "same circle height", value: fmt(point.y) },
    ],
  };
}

export function buildWaveAmplitudeScene(sample: Point, handles: HandlePair, time: number): SceneData {
  const sources = [handles.a, handles.b];
  const k = 0.05;
  const omega = 0.1;
  const r1 = distance(sample, handles.a);
  const r2 = distance(sample, handles.b);
  const p1 = normalizeCycleAngle(k * r1 - omega * time);
  const p2 = normalizeCycleAngle(k * r2 - omega * time);
  const a1 = Math.cos(k * r1 - omega * time);
  const a2 = Math.cos(k * r2 - omega * time);
  const value = waveAmplitude(sample.x, sample.y, sources, time, k, omega);

  return {
    call:
      `waveAmplitude(${fmt(sample.x)}, ${fmt(sample.y)}, [` +
      `${formatPoint(handles.a)}, ${formatPoint(handles.b)}], ${fmt(time)}, ${fmt(k)}, ${fmt(omega)}) = ${fmt(value)}`,
    hint:
      "Drag either source, drag the sample point, or scrub time. Each source turns distance into its own cosine contribution; `waveAmplitude()` does not pick one winner, it averages those live terms into the final interference value.",
    readouts: [
      { label: "sample", value: formatPoint(sample) },
      { label: "time", value: fmt(time) },
      { label: "r1 → phase → cos(...)", value: `${fmt(r1)} → ${fmt(p1)} rad → ${fmt(a1)}` },
      { label: "r2 → phase → cos(...)", value: `${fmt(r2)} → ${fmt(p2)} rad → ${fmt(a2)}` },
      { label: "average", value: `(${fmt(a1)} + ${fmt(a2)}) / 2 = ${fmt(value)}`, tone: "live" },
    ],
  };
}

export function drawUnitCirclePointScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  handle: Point,
) {
  const layout = unitCircleLayout(width, height);
  const angle = Math.atan2(handle.y - layout.center.y, handle.x - layout.center.x);
  const cycleAngle = normalizeCycleAngle(angle);
  const cycleFraction = cycleAngle / (Math.PI * 2);
  const point = unitCirclePoint(layout.center.x, layout.center.y, layout.radius, angle);
  const corner = { x: point.x, y: layout.center.y };
  const stripLeft = Math.round(width * 0.54);
  const stripRight = width - PAD;
  const stripWidth = stripRight - stripLeft;
  const stripX = stripLeft + stripWidth * cycleFraction;
  const stripCenterY = layout.center.y;
  const stripTop = stripCenterY - layout.radius;
  const stripBottom = stripCenterY + layout.radius;

  drawBackdrop(ctx, width, height);
  drawAxes(ctx, width, height, layout.center);
  drawUnitCircle(ctx, layout.center, layout.radius);
  drawVector(ctx, layout.center, point, "#818cf8", "r");
  drawComponentGuides(ctx, layout.center, point);
  drawCenter(ctx, layout.center, "#f8fafc", 5);
  drawCenter(ctx, corner, "rgba(125, 211, 252, 0.8)", 4);

  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(stripLeft, stripCenterY);
  ctx.lineTo(stripRight, stripCenterY);
  ctx.stroke();

  ctx.strokeStyle = "rgba(129, 140, 248, 0.92)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 64; i += 1) {
    const t = i / 64;
    const x = stripLeft + stripWidth * t;
    const theta = t * Math.PI * 2;
    const y = sineCurve(layout.center.y, layout.radius, 1, theta);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = "rgba(251, 146, 60, 0.85)";
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(stripX, point.y);
  ctx.stroke();

  ctx.strokeStyle = "rgba(96, 165, 250, 0.85)";
  ctx.beginPath();
  ctx.moveTo(stripX, stripTop);
  ctx.lineTo(stripX, stripBottom);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCenter(ctx, { x: stripX, y: point.y }, "#f97316", 7);

  drawAngleArc(ctx, layout.center, point, 40, "rgba(249, 115, 22, 0.95)");
  // Two lines only: a 3-line box reaches down into the circle's upper arc at the
  // standard 248px height and covers the draggable point's travel. The "same
  // angle on the sine strip" idea is already carried by the readouts + the strip.
  drawHeaderBox(ctx, [
    { text: `cos = ${fmt(point.cos)}`, color: "#86efac" },
    { text: `sin = ${fmt(point.sin)}`, color: "#fb923c" },
  ]);

  labelSegment(
    ctx,
    layout.center.x + (point.x - layout.center.x) / 2,
    layout.center.y + 18,
    `x = cos(θ) × r = ${fmtSigned(point.x - layout.center.x)}`,
    "rgba(134, 239, 172, 0.95)",
  );
  labelSegment(
    ctx,
    point.x + 18,
    layout.center.y + (point.y - layout.center.y) / 2,
    `y = sin(θ) × r = ${fmtSigned(point.y - layout.center.y)}`,
    "rgba(251, 146, 60, 0.95)",
  );
  labelSegment(
    ctx,
    layout.center.x + 52,
    layout.center.y - 12,
    `${fmt(radToDeg(angle))}°`,
    "rgba(249, 115, 22, 0.98)",
  );
  labelSegment(ctx, stripX + 28, point.y - 10, `same y`, "#f97316");
  labelSegment(ctx, stripLeft + 16, stripBottom + 18, "0", "rgba(226, 232, 240, 0.9)");
  labelSegment(ctx, stripLeft + stripWidth / 2, stripBottom + 18, "π", "rgba(226, 232, 240, 0.9)");
  labelSegment(ctx, stripRight - 16, stripBottom + 18, "2π", "rgba(226, 232, 240, 0.9)");

  // Draw the draggable point LAST so the header box and labels can never occlude
  // it. On short canvases the header box overlaps the circle's upper arc, and
  // when the point was drawn early it hid behind the box and became ungrabbable.
  drawCenter(ctx, point, "#fb7185", 7);
}

export function drawSineWaveScene(
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
  const cycleFraction = normalizeCycleFraction(sampleX / wavelength + phase);
  const cycleAngle = cycleFraction * Math.PI * 2;
  const stripLeft = Math.max(originX + 12, width - 220);
  const stripRight = width - PAD;
  const stripWidth = stripRight - stripLeft;
  const stripY = 44;
  const stripAmplitude = 14;
  const stripCenterY = stripY + 22;
  const stripX = stripLeft + stripWidth * cycleFraction;
  const stripSampleY = stripCenterY + Math.sin(cycleFraction * Math.PI * 2) * stripAmplitude;

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
  labelSegment(ctx, sampleX + 36, sampleY - 12, `same y = ${fmt(sampleY)}`, "#f97316");

  labelSegment(ctx, originX + 18, centerY - amplitude / 2, `amp = ${fmt(amplitude)}`, "rgba(96, 165, 250, 0.95)");
  labelSegment(ctx, originX + wavelength / 8, crestY - 14, `λ/4 = ${fmt(wavelength / 4)}`, "rgba(125, 211, 252, 0.95)");

  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(stripLeft, stripCenterY);
  ctx.lineTo(stripRight, stripCenterY);
  ctx.stroke();

  ctx.strokeStyle = "rgba(196, 181, 253, 0.95)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i <= 64; i += 1) {
    const t = i / 64;
    const x = stripLeft + stripWidth * t;
    const y = stripCenterY + Math.sin(t * Math.PI * 2) * stripAmplitude;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = "rgba(249, 115, 22, 0.9)";
  ctx.beginPath();
  ctx.moveTo(sampleX, sampleY);
  ctx.lineTo(stripX, stripCenterY + Math.sin(cycleFraction * Math.PI * 2) * stripAmplitude);
  ctx.stroke();

  ctx.strokeStyle = "rgba(125, 211, 252, 0.9)";
  ctx.beginPath();
  ctx.moveTo(stripX, stripY - 6);
  ctx.lineTo(stripX, stripY + 48);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCenter(ctx, { x: stripX, y: stripSampleY }, "#f97316", 5);
  labelSegment(ctx, stripX + 28, stripSampleY - 10, "same cycle point", "#f97316");
  labelSegment(ctx, stripLeft + 16, stripY - 10, "0", "rgba(226, 232, 240, 0.9)");
  labelSegment(ctx, stripLeft + stripWidth / 2, stripY - 10, "λ/2", "rgba(226, 232, 240, 0.9)");
  labelSegment(ctx, stripRight - 12, stripY - 10, "λ", "rgba(226, 232, 240, 0.9)");

  drawRail(ctx, width, height, "phase", phase, -1, 1);
  drawHeaderBox(ctx, [
    { text: `phase = ${fmt(phase)}`, color: "#e2e8f0" },
    { text: `x lands ${fmt(cycleFraction * 100)}% through one wavelength = ${fmt(cycleAngle)} rad`, color: "#c4b5fd" },
    { text: `that repeated sine sample gives y = ${fmt(sampleY)}`, color: "#fdba74" },
  ]);
}

export function drawSineCurveScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  handle: Point,
) {
  const layout = unitCircleLayout(width, height);
  const angle = Math.atan2(handle.y - layout.center.y, handle.x - layout.center.x);
  const cycleAngle = normalizeCycleAngle(angle);
  const cycleFraction = cycleAngle / (Math.PI * 2);
  const point = unitCirclePoint(layout.center.x, layout.center.y, layout.radius, angle);
  const value = sineCurve(layout.center.y, layout.radius, 1, angle);
  const corner = { x: point.x, y: layout.center.y };
  const graphLeft = Math.round(width * 0.5);
  const graphRight = width - PAD;
  const graphWidth = graphRight - graphLeft;
  const graphX = Math.round(graphLeft + graphWidth * cycleFraction);
  const graphTop = layout.center.y - layout.radius;
  const graphBottom = layout.center.y + layout.radius;

  drawBackdrop(ctx, width, height);
  drawAxes(ctx, width, height, layout.center);
  drawUnitCircle(ctx, layout.center, layout.radius);
  drawVector(ctx, layout.center, point, "#818cf8", "r");
  drawComponentGuides(ctx, layout.center, point);
  drawCenter(ctx, layout.center, "#f8fafc", 5);
  drawCenter(ctx, corner, "rgba(125, 211, 252, 0.8)", 4);

  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(graphLeft, layout.center.y);
  ctx.lineTo(graphRight, layout.center.y);
  ctx.stroke();

  ctx.strokeStyle = "rgba(129, 140, 248, 0.92)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 64; i += 1) {
    const t = i / 64;
    const x = graphLeft + graphWidth * t;
    const theta = t * Math.PI * 2;
    const y = sineCurve(layout.center.y, layout.radius, 1, theta);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
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
  labelSegment(ctx, graphX + 36, value - 10, `same y = ${fmt(value)}`, "#f97316");
  labelSegment(ctx, graphX + 26, layout.center.y - 10, "baseline", "rgba(255,255,255,0.92)");
  labelSegment(ctx, graphX + 34, graphTop + 8, `amp = ${fmt(layout.radius)}`, "rgba(96, 165, 250, 0.95)");
  labelSegment(ctx, graphLeft + 20, graphBottom + 18, "0", "rgba(226, 232, 240, 0.9)");
  labelSegment(ctx, graphLeft + graphWidth / 2, graphBottom + 18, "π", "rgba(226, 232, 240, 0.9)");
  labelSegment(ctx, graphRight - 16, graphBottom + 18, "2π", "rgba(226, 232, 240, 0.9)");

  // Two lines only (see unit-circle-point note): keep the input and the result;
  // the "unwraps to X rad" restatement is already in the readouts + strip.
  drawHeaderBox(ctx, [
    { text: `sin(time) = ${fmt(point.sin)}`, color: "#fb923c" },
    { text: `baseline + sin(time) × amplitude = ${fmt(value)}`, color: "#e2e8f0" },
  ]);

  labelSegment(
    ctx,
    layout.center.x + 52,
    layout.center.y - 12,
    `${fmt(radToDeg(angle))}°`,
    "rgba(249, 115, 22, 0.98)",
  );
  labelSegment(ctx, point.x + 26, point.y - 34, "circle height", "#fb923c");

  // Draw the draggable point LAST so the header box and labels can never occlude
  // it (same fix as the unit-circle-point scene — shared layout, shared bug).
  drawCenter(ctx, point, "#fb7185", 7);
}

export function drawWaveAmplitudeScene(
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
  const phases = radii.map((radius) => normalizeCycleAngle(k * radius - omega * time));
  const contributions = radii.map((radius) => Math.cos(k * radius - omega * time));
  const meter = {
    x: width - 54,
    top: 42,
    bottom: height - 52,
  };
  const meterMid = (meter.top + meter.bottom) / 2;
  const meterY = meterMid - value * ((meter.bottom - meter.top) / 2);
  const contributionYs = contributions.map((contribution) =>
    meterMid - contribution * ((meter.bottom - meter.top) / 2),
  );
  const stripLeft = Math.max(width - 214, 250);
  const stripRight = width - 84;
  const stripWidth = stripRight - stripLeft;
  const stripRows = [76, 118];

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

  stripRows.forEach((rowY, index) => {
    const phaseFraction = phases[index] / (Math.PI * 2);
    const stripX = stripLeft + stripWidth * phaseFraction;
    const stripSampleY = rowY - Math.cos(phases[index]) * 16;

    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(stripLeft, rowY);
    ctx.lineTo(stripRight, rowY);
    ctx.stroke();

    ctx.strokeStyle = `${colors[index]}ee`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 48; i += 1) {
      const t = i / 48;
      const x = stripLeft + stripWidth * t;
      const y = rowY - Math.cos(t * Math.PI * 2) * 16;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = `${colors[index]}bb`;
    ctx.beginPath();
    ctx.moveTo(stripX, rowY - 24);
    ctx.lineTo(stripX, rowY + 24);
    ctx.stroke();
    ctx.setLineDash([]);

    drawCenter(ctx, { x: stripX, y: stripSampleY }, colors[index], 5);
    labelSegment(ctx, stripLeft - 28, rowY - 4, `s${index + 1}`, colors[index]);
    labelSegment(ctx, stripX, rowY - 32, `${fmt(contributions[index])}`, colors[index]);
  });

  labelSegment(ctx, stripLeft + 12, 52, "0", "rgba(226, 232, 240, 0.9)");
  labelSegment(ctx, stripLeft + stripWidth / 2, 52, "π", "rgba(226, 232, 240, 0.9)");
  labelSegment(ctx, stripRight - 12, 52, "2π", "rgba(226, 232, 240, 0.9)");

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
  contributionYs.forEach((y, index) => {
    ctx.strokeStyle = `${colors[index]}cc`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(meter.x - 16, y);
    ctx.lineTo(meter.x + 16, y);
    ctx.stroke();
    labelSegment(ctx, meter.x - 42, y - 8, `c${index + 1}`, colors[index]);
  });
  labelSegment(ctx, meter.x - 10, meter.top - 6, "+1", "#f8fafc");
  labelSegment(ctx, meter.x - 8, meterMid - 8, "0", "#cbd5e1");
  labelSegment(ctx, meter.x - 10, meter.bottom + 4, "-1", "#f8fafc");
  labelSegment(ctx, meter.x - 44, meterY - 10, `avg = ${fmt(value)}`, "#f97316");

  drawRail(ctx, width, height, "waveTime", time, 0, 60);
  drawHeaderBox(ctx, [
    { text: `phase1 = ${fmt(phases[0])} rad → cos1 = ${fmt(contributions[0])}`, color: colors[0] },
    { text: `phase2 = ${fmt(phases[1])} rad → cos2 = ${fmt(contributions[1])}`, color: colors[1] },
    { text: `average = (${fmt(contributions[0])} + ${fmt(contributions[1])}) / 2 = ${fmt(value)}`, color: "#fdba74" },
  ]);
}
