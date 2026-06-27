import { CodePenPayload } from "./codepen";
import { ballBounce } from "../../pages/createJSON/formulas/animation/BallBounce";
import { ballToBallBounce } from "../../pages/createJSON/formulas/animation/BallToBallBounce";
import { lerp } from "../../pages/createJSON/formulas/animation/Lerp";
import {
  linear,
  easeIn,
  easeOut,
  easeInOut,
} from "@utilspalooza/core/Easing";
import { quadraticBezier } from "../../pages/createJSON/formulas/animation/QuadraticBezier";
import { DistributeAroundCircle } from "../../pages/createJSON/formulas/animation/DistributeAroundCircle";
import { getRotation } from "../../pages/createJSON/formulas/animation/GetRotation";
import { findPointAroundCircle } from "@utilspalooza/core/FindPointAroundCircle";
import { sineCurve } from "@utilspalooza/core/SineCurve";
import { unitCirclePoint } from "@utilspalooza/core/UnitCirclePoint";
import { pointToCircle } from "@utilspalooza/core/PointToCircle";
import { circleToCircle } from "@utilspalooza/core/CircleToCircle";
import { circleToRect } from "@utilspalooza/core/CircleToRect";
import { lineToCircle } from "@utilspalooza/core/LineToCircle";
import { lineToLine } from "@utilspalooza/core/LineToLine";
import { lineToPoint } from "@utilspalooza/core/LineToPoint";
import { lineLine as lineLineFn } from "@utilspalooza/core/CollisionObjectAPI/LineLine";
import { polygonToPolygon } from "@utilspalooza/core/PolygonToPolygon";
import { polygonLine as polygonLineFn } from "@utilspalooza/core/CollisionObjectAPI/PolygonLine";
import { getPointOnLine } from "@utilspalooza/core/GetPointOnLine";
import { getTriangleData } from "@utilspalooza/core/GetTriangleData";
import { starVertices } from "@utilspalooza/core/Star";
import { drawEquilateralTriangle } from "./pen-snippets";
import { drawEquilateralTriangle as drawEquilateralTriangleAnimation } from "../../core-animations/EquilateralTriangle";
import { equilateralTriangle } from "@utilspalooza/core/EquilateralTriangle";
import { circleFromThreePoints } from "@utilspalooza/core/CircleFromThreePoints";
import { deCasteljau } from "@utilspalooza/core/DeCasteljau";
import { drawBezierCurves } from "../../core-animations/BezierCurves";
import { dft } from "@utilspalooza/core/DFT";
import { heartPath, drawFourierEpicycles } from "../../core-animations/FourierEpicycles";
import { gameOfLifeStep } from "@utilspalooza/core/GameOfLife";
import { drawGameOfLife } from "../../core-animations/GameOfLife";
import { drawWaveInterference } from "../../core-animations/WaveInterference";
import { drawGravitationalLensing } from "../../core-animations/GravitationalLensing";
import { newtonAccel, grAccel, drawOrbitalPrecession } from "../../core-animations/OrbitalPrecession";
import { lineLength } from "@utilspalooza/core/LineLength";
import { moveAlongLine } from "@utilspalooza/core/MoveAlongLine";
import { SphereLighting } from "../../pages/createJSON/formulas/animation/OrbitalMotion";
import { radToDeg as radToDegFn } from "@utilspalooza/core/RadToDeg";
import { drawCenterOnParent } from "../../core-animations/CenterOnParentAnimation";
import { drawDegreesToRadians } from "../../core-animations/DegToRadAnimation";
import { drawRadiansToDegrees } from "../../core-animations/Rad2DegAnimation";
import { drawFormatNumberWithCommas } from "../../core-animations/NumberWithCommasAnimation";
import { drawRandomIntegerBetween } from "../../core-animations/RandomIntegerAnimation";
import { drawRandomNumberBetween } from "../../core-animations/RandomNumberAnimation";
import { sierpinskiMidpoints, drawSierpinski } from "../../core-animations/Sierpinski";
import { createKlimtSwirls, drawKlimt } from "../../core-animations/Klimt";
import {
  hslToRgb,
  lerpColor as lerpColorFn,
  lerpColorHsl,
  rgbToCss,
  rgbToHsl,
} from "@utilspalooza/core/Color";
import {
  vecNormalize,
  vecPerpendicular,
  vecReflect,
  vecRotate,
} from "@utilspalooza/core/Vec2";
import {
  lerpAngle,
  shortestAngleBetween,
  wrapAngle,
} from "@utilspalooza/core/AngleInterpolation";
import { drawRainbowBall } from "../../core-animations/BallBounce";
import { drawBallBall } from "../../core-animations/BallBall";
import { drawLerp } from "../../core-animations/Lerp";
import { drawEasing } from "../../core-animations/Easing";
import { drawQuadraticBezier } from "../../core-animations/QuadraticBezier";
import { drawDistributeAroundCircle } from "../../core-animations/DistributeAroundCircle";
import { drawMoveToDestination } from "../../core-animations/MoveToDestination";
import { drawPointTowards } from "../../core-animations/PointTowards";
import { drawSineCurve } from "../../core-animations/SineCurve";
import { drawDeMystifySineCosine } from "../../core-animations/DeMystifySineCosine";
import { springValue, criticalDamping } from "@utilspalooza/core/Animate";
import { drawSpring } from "../../core-animations/Spring";
import { drawColorLerp } from "../../core-animations/ColorLerp";
import { drawColorFamily } from "../../core-animations/ColorFamilies";
import { drawVectorReflect } from "../../core-animations/VectorReflect";
import { drawVectorRotate } from "../../core-animations/VectorRotate";
import { drawAngleLerp } from "../../core-animations/AngleLerp";
import { drawBird } from "../../core-animations/Murmuration";
import { drawOrbitalMotion } from "../../core-animations/OrbitalMotion";
import { drawMoveItemAroundCircle } from "../../core-animations/MoveItemAroundCircle";
import { drawGetPointOnLine } from "../../core-animations/GetPointOnLine";
import { drawLineLength } from "../../core-animations/LineLength";
import { drawPolygon } from "../../core-animations/Polygon";
import { drawStar } from "../../core-animations/Star";
import { drawCircleFromThreePoints } from "../../core-animations/CircleFromThreePoints";
import { drawTriangleDataFromLine } from "../../core-animations/TriangleDataFromLine";
import { drawCircleToCircle } from "../../core-animations/CircleToCircle";
import { pointCircle as pointCircleFn } from "@utilspalooza/core/CollisionObjectAPI/PointCircle";
import { drawPointToCircle } from "../../core-animations/PointToCircle";
import { drawLineToCircle } from "../../core-animations/LineToCircle";
import { drawLineToLine } from "../../core-animations/LineToLine";
import { drawLineToPoint } from "../../core-animations/LineToPoint";
import { drawLineToRectangle } from "../../core-animations/LineToRect";
import { drawPointToRectangle } from "../../core-animations/PointToRect";
import { drawRectToRect } from "../../core-animations/RectToRect";
import { drawCircleToRectangle } from "../../core-animations/CircleToRect";
import { drawPolygonToPolygon } from "../../core-animations/PolygonToPolygonCollision";
import { polygonPoint } from "../../pages/createJSON/formulas/collision-detection/PolygonCollision";

export interface ExamplePen {
  group: string;
  key: string;
  label: string;
  blurb: string;
  payload: CodePenPayload;
}

const FULLSCREEN_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 100%; height: 100%; overflow: hidden; background: #0a0a0f; }
canvas { display: block; width: 100vw; height: 100vh; }
#controls {
  position: fixed; top: 12px; left: 12px;
  display: flex; flex-wrap: wrap; gap: 12px; align-items: center;
  background: rgba(8, 8, 18, 0.9);
  border: 1px solid rgba(150, 180, 255, 0.3);
  border-radius: 8px; padding: 8px 14px;
  font-family: monospace; font-size: 12px; color: #d8e2ff;
}
#controls label { display: flex; gap: 6px; align-items: center; }
#controls input[type=range] { width: 90px; }
#controls button {
  background: rgba(120, 160, 255, 0.14);
  border: 1px solid rgba(150, 180, 255, 0.4);
  color: #d8e2ff; padding: 4px 10px; border-radius: 4px;
  cursor: pointer; font-family: inherit; font-size: 12px;
}`;

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATIONS (11 pens)
// ─────────────────────────────────────────────────────────────────────────────

// ── Ball Bounce ──────────────────────────────────────────────────────────────
const BALL_BOUNCE_HTML = `<canvas id="canvas"></canvas>`;
const BALL_BOUNCE_JS = `${ballBounce.keyFunction.toString()}

${drawRainbowBall.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state: staggered rainbow stream from a fixed object pool ─────────────────
const RESTITUTION = 0.88;  // bounciness (0–1): higher = springier
const SPAWN_INTERVAL = 16; // frames between staggered entries
const MAX_BALLS = 40;      // object-pool cap: never instantiate beyond this
let balls = [], spawnCounter = 0, spawnIndex = 0;

function resetBall(ball) {
  const hue = (spawnIndex * 47) % 360;
  const radius = 14 + Math.random() * 8;
  ball.x = canvas.width * (0.08 + Math.random() * 0.84);
  ball.y = radius + Math.random() * 20;
  ball.vx = (Math.random() - 0.5) * 6;
  ball.vy = 1 + Math.random() * 2;
  ball.radius = radius;
  ball.hue = hue;
  ball.settled = false;
  ball.restFrames = 0;
  spawnIndex++;
}

function spawnOrRecycle() {
  if (balls.length < MAX_BALLS) {
    const ball = { x: 0, y: 0, vx: 0, vy: 0, radius: 0, hue: 0, settled: false, restFrames: 0 };
    resetBall(ball);
    balls.push(ball);
    return;
  }
  // At the cap: take one from the floor — the one that's rested longest.
  let target = null;
  for (const b of balls) {
    if (b.settled && (target === null || b.restFrames > target.restFrames)) target = b;
  }
  if (target) resetBall(target);
}

ctx.fillStyle = 'rgb(10, 8, 20)';
ctx.fillRect(0, 0, canvas.width, canvas.height);
for (let i = 0; i < 4; i++) spawnOrRecycle();

function draw() {
  // Trails: fade the previous frame instead of clearing it.
  ctx.fillStyle = 'rgba(10, 8, 20, 0.22)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (++spawnCounter >= SPAWN_INTERVAL) { spawnCounter = 0; spawnOrRecycle(); }

  const stage = { width: canvas.width, height: canvas.height };
  for (const ball of balls) {
    if (!ball.settled) {
      ballBounce(ball, stage, RESTITUTION);
      const onFloor = ball.y >= stage.height - ball.radius - 0.5;
      if (onFloor) ball.vx *= 0.9;
      if (onFloor && Math.abs(ball.vy) < 1.4 && Math.abs(ball.vx) < 0.5) {
        ball.settled = true;
        ball.y = stage.height - ball.radius;
        ball.vy = 0;
        ball.vx = 0;
      }
    } else {
      ball.restFrames++;
    }
    drawRainbowBall(ctx, ball);
  }

  requestAnimationFrame(draw);
}

draw();`;

// ── Balls Bouncing Against Each Other ────────────────────────────────────────
const BALLS_BOUNCING_HTML = `<canvas id="canvas"></canvas>`;
const BALLS_BOUNCING_JS = `${ballToBallBounce.keyFunction.toString()}
const ballToBallBouncePhysics = ballToBallBounce;

${drawBallBall.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
function spawnBalls() {
  let n = Math.max(5, Math.floor(canvas.width * canvas.height / 20000));
  return Array.from({ length: n }, (_, i) => {
    let radius = Math.random() * 40 + 10;
    return {
      x: Math.random() * (canvas.width - 2 * radius) + radius,
      y: Math.random() * (canvas.height - 2 * radius) + radius,
      radius,
      vx: 1,
      vy: 1,
      h: (i % 6) * 60,
      s: 70,
      l: 55,
    };
  });
}

let balls = spawnBalls();

function draw() {
  drawBallBall(ctx, balls, canvas.width, canvas.height, ballToBallBouncePhysics);
  requestAnimationFrame(draw);
}

draw();`;

// ── Orbital Motion ───────────────────────────────────────────────────────────
const ORBITAL_MOTION_HTML = `<canvas id="canvas"></canvas>`;
const ORBITAL_MOTION_JS = `// ─── the core algorithm ─────────────────────────────────────────────────────
${findPointAroundCircle.toString()}

const SphereLighting = {
  keyFunction: ${SphereLighting.keyFunction.toString()}
};

${drawOrbitalMotion.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let pct = 0;
let sunRadius = 60;
let orbiterRadius = 22;
let orbitRadius = 180;

function draw() {
  drawOrbitalMotion(
    ctx,
    canvas.width,
    canvas.height,
    pct,
    sunRadius,
    orbiterRadius,
    orbitRadius,
    findPointAroundCircle,
    SphereLighting.keyFunction
  );
  pct = (pct + 0.15) % 100;
  requestAnimationFrame(draw);
}

draw();`;

// ── lerp ─────────────────────────────────────────────────────────────────────
const LERP_HTML = `<canvas id="canvas"></canvas>
<div id="controls">
  <label>speed <input type="range" id="speed" min="0.01" max="0.1" step="0.01" value="0.05"></label>
</div>`;
const LERP_JS = `${lerp.keyFunction.toString()}

${drawLerp.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let target = { x: 0, y: 0 };
let follower = { x: 0, y: 0 };
let lerpFactor = 0.08;

function init() {
  target.x = canvas.width / 2 + 100;
  target.y = canvas.height / 2;
  follower.x = 50;
  follower.y = canvas.height / 2;
}

function draw() {
  target.x = canvas.width / 2 + Math.sin(Date.now() * 0.0005) * 150;
  target.y = canvas.height / 2 + Math.cos(Date.now() * 0.0003) * 100;

  follower.x = lerp(follower.x, target.x, lerpFactor);
  follower.y = lerp(follower.y, target.y, lerpFactor);

  drawLerp(ctx, target, follower, lerpFactor, canvas.width, canvas.height);

  requestAnimationFrame(draw);
}

document.getElementById('speed').addEventListener('input', e => {
  lerpFactor = parseFloat(e.target.value);
});

init();
draw();`;

// ── Easing Functions ────────────────────────────────────────────────────────
const EASING_HTML = `<canvas id="canvas"></canvas>`;
const EASING_JS = `// ─── easing functions ──────────────────────────────────────────────────────
function linear(t) { return t; }
function easeInQuad(t) { return t * t; }
function easeOutQuad(t) { return t * (2 - t); }
function easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function easeOutElastic(t) {
  if (t === 0 || t === 1) return t;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}
function easeOutBounce(t) {
  const n1 = 7.5625, d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  else return n1 * (t -= 2.625 / d1) * t + 0.984375;
}

const PERIOD_MS = 2800;
const PAUSE_MS = 500;
const TRACKS = [
  { name: 'linear', ease: linear, color: '#94a3b8' },
  { name: 'ease-in-quad', ease: easeInQuad, color: '#60a5fa' },
  { name: 'ease-out-quad', ease: easeOutQuad, color: '#34d399' },
  { name: 'ease-in-out-quad', ease: easeInOutQuad, color: '#a78bfa' },
  { name: 'ease-out-elastic', ease: easeOutElastic, color: '#f472b6' },
  { name: 'ease-out-bounce', ease: easeOutBounce, color: '#fb923c' }
];

${drawEasing.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  drawEasing(ctx, canvas.width, canvas.height);
  requestAnimationFrame(draw);
}

draw();`;

// ── Quadratic Bézier ────────────────────────────────────────────────────────
const QUADRATIC_BEZIER_HTML = `<canvas id="canvas"></canvas>`;
const QUADRATIC_BEZIER_JS = `${quadraticBezier.keyFunction.toString()}

${drawQuadraticBezier.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
const HANDLE_RADIUS = 14;
const HIT_SLOP = 6;
let p0 = { x: canvas.width * 0.2, y: canvas.height * 0.7 };
let p1 = { x: canvas.width * 0.5, y: canvas.height * 0.2 };
let p2 = { x: canvas.width * 0.8, y: canvas.height * 0.7 };
let dragTarget = null;

function pointDistance(p1, p2) {
  const dx = p2.x - p1.x, dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function draw() {
  drawQuadraticBezier(ctx, p0, p1, p2, dragTarget, quadraticBezier);
  requestAnimationFrame(draw);
}

canvas.addEventListener('pointerdown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  if (pointDistance({ x: mx, y: my }, p0) < HANDLE_RADIUS + HIT_SLOP) {
    dragTarget = 'p0';
  } else if (pointDistance({ x: mx, y: my }, p1) < HANDLE_RADIUS + HIT_SLOP) {
    dragTarget = 'p1';
  } else if (pointDistance({ x: mx, y: my }, p2) < HANDLE_RADIUS + HIT_SLOP) {
    dragTarget = 'p2';
  }
});

canvas.addEventListener('pointermove', (e) => {
  if (!dragTarget) return;
  const rect = canvas.getBoundingClientRect();
  const point = dragTarget === 'p0' ? p0 : dragTarget === 'p1' ? p1 : p2;
  point.x = e.clientX - rect.left;
  point.y = e.clientY - rect.top;
});

canvas.addEventListener('pointerup', () => {
  dragTarget = null;
});

draw();`;

// ── Find Points on a Circle ─────────────────────────────────────────────────
const FIND_POINTS_CIRCLE_HTML = `<canvas id="canvas"></canvas>
<div id="controls">
  <label>progress: <input type="range" id="progress" min="0" max="100" step="1" value="0"></label>
</div>`;
const FIND_POINTS_CIRCLE_JS = `${findPointAroundCircle.toString()}

${drawMoveItemAroundCircle.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let i = 0;

function draw() {
  drawMoveItemAroundCircle(
    ctx,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width,
    canvas.height,
    i,
    findPointAroundCircle
  );
  i += 0.5;
  if (i > 100) i = 0;
  requestAnimationFrame(draw);
}

document.getElementById('progress').addEventListener('input', e => {
  i = parseInt(e.target.value);
});

draw();`;

// ── Move Object to Changing Point ───────────────────────────────────────────
const MOVE_TO_DESTINATION_HTML = `<canvas id="canvas"></canvas>`;
const MOVE_TO_DESTINATION_JS = `${moveAlongLine.toString()}
${getRotation.keyFunction.toString()}
${drawMoveToDestination.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let dot = { x: canvas.width * 0.5, y: canvas.height * 0.5 };
let dotNew = { x: canvas.width * 0.7, y: canvas.height * 0.5 };
let arrowPoint = { x: canvas.width * 0.5 - 50, y: canvas.height * 0.5 - 25 };
let ratio = 0;
const img = new Image();

function chooseDestination() {
  ratio = 0;
  dotNew = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height
  };
}

function draw() {
  drawMoveToDestination(ctx, canvas, dot, dotNew, arrowPoint, ratio, img);
  ratio += 0.0001;
  requestAnimationFrame(draw);
}

img.addEventListener('load', () => {
  chooseDestination();
  setInterval(chooseDestination, 2000);
  draw();
});
img.src = '/bmps/arrow.png';`;

// ── Point Object Towards Another ────────────────────────────────────────────
const POINT_TOWARDS_HTML = `<canvas id="canvas"></canvas>`;
const POINT_TOWARDS_JS = `${getRotation.keyFunction.toString()}
function pointsAroundCircle(circleCenter, i, radius, numElements) {
  const x = circleCenter.x + radius * Math.cos((2 * Math.PI * i) / numElements);
  const y = circleCenter.y + radius * Math.sin((2 * Math.PI * i) / numElements);
  return { x, y };
}
${drawPointTowards.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let i = 0;
const img = new Image();

function draw() {
  drawPointTowards(ctx, canvas.width, canvas.height, i, img);
  i += 0.5;
  if (i > 360) i = 0;
  requestAnimationFrame(draw);
}

img.addEventListener('load', draw);
img.src = '/bmps/arrow.png';`;

// ── Sine Curve ──────────────────────────────────────────────────────────────
const SINE_CURVE_HTML = `<canvas id="canvas"></canvas><div id="controls">
  <label>starting value: <input type="range" id="starting" min="0" max="200" value="0"></label>
  <label>differential: <input type="range" id="differential" min="0" max="200" value="200"></label>
  <label>speed: <input type="range" id="speed" min="0.0005" max="0.05" step="0.005" value="0.005"></label>
</div>`;
const SINE_CURVE_JS = `${sineCurve.toString()}

${drawSineCurve.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let startValue = 0;
let differential = 200;
let speed = 0.005;

function draw() {
  drawSineCurve(ctx, canvas.width, canvas.height, startValue, differential, speed, sineCurve);
  requestAnimationFrame(draw);
}

document.getElementById('starting').addEventListener('input', e => {
  startValue = parseFloat(e.target.value);
});
document.getElementById('differential').addEventListener('input', e => {
  differential = parseFloat(e.target.value);
});
document.getElementById('speed').addEventListener('input', e => {
  speed = parseFloat(e.target.value);
});

draw();`;

// ── Demystify Sine & Cosine ────────────────────────────────────────────────
const DEMYSTIFY_SINE_COSINE_HTML = `<canvas id="canvas"></canvas>`;
const DEMYSTIFY_SINE_COSINE_JS = `${unitCirclePoint.toString()}

${radToDegFn.toString()}

${drawDeMystifySineCosine.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  drawDeMystifySineCosine(
    ctx,
    canvas.width,
    canvas.height,
    null,
    unitCirclePoint,
    radToDeg
  );
  requestAnimationFrame(draw);
}

draw();`;

// ─────────────────────────────────────────────────────────────────────────────
// COLLISION DETECTION (10 pens)
// ─────────────────────────────────────────────────────────────────────────────

const POINT_CIRCLE_HTML = `<canvas id="canvas"></canvas>`;
const POINT_CIRCLE_JS = `// ─── the core algorithm ─────────────────────────────────────────────────────
${sineCurve.toString()}
${pointCircleFn.toString()}

${drawPointToCircle.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  drawPointToCircle(
    ctx,
    canvas.width,
    canvas.height,
    performance.now(),
    sineCurve,
    pointCircle
  );
  requestAnimationFrame(draw);
}

draw();`;

const POINT_RECT_HTML = `<canvas id="canvas"></canvas>`;
const POINT_RECT_JS = `// ─── the core algorithms ───────────────────────────────────────────────────
${sineCurve.toString()}

${polygonPoint.keyFunction.toString()}

${lineLength.toString()}

${getRotation.keyFunction.toString()}

function createRect(width, height, angle = 0, options = { rotate: false, rotateSpeed: 1000, clockwise: true }) {
  const vertices = [];
  let x = width / 2;
  let y = height / 2;
  const center = { x: 0, y: 0 };
  const dist = lineLength({ startPoint: center, endPoint: { x, y } });
  const atan2 = getRotation(center, { x, y });
  const rotate = options.rotate ?? false;
  const rotateSpeed = options.rotateSpeed ?? 1000;
  const clockwise = options.clockwise ?? true;
  const rotateQ = rotate ? options.time / rotateSpeed : 0;
  const spinDirection = clockwise ? [-rotateQ, rotateQ] : [rotateQ, -rotateQ];
  x = -dist * Math.cos(atan2 + angle + spinDirection[0]);
  y = dist * Math.sin(atan2 + angle + spinDirection[0]);
  vertices.push({ x, y });
  x = dist * Math.cos(atan2 - angle + spinDirection[1]);
  y = dist * Math.sin(atan2 - angle + spinDirection[1]);
  vertices.push({ x, y });
  x = dist * Math.cos(atan2 + angle + spinDirection[0]);
  y = -dist * Math.sin(atan2 + angle + spinDirection[0]);
  vertices.push({ x, y });
  x = -dist * Math.cos(atan2 - angle + spinDirection[1]);
  y = -dist * Math.sin(atan2 - angle + spinDirection[1]);
  vertices.push({ x, y });
  return { vertices };
}

${drawPointToRectangle.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  drawPointToRectangle(
    ctx,
    canvas.width,
    canvas.height,
    performance.now(),
    sineCurve,
    polygonPoint,
    createRect
  );

  requestAnimationFrame(draw);
}

draw();`;

const CIRCLE_CIRCLE_HTML = `<canvas id="canvas"></canvas>`;
const CIRCLE_CIRCLE_JS = `// ─── the core algorithm ─────────────────────────────────────────────────────
${circleToCircle.toString()}

${drawCircleToCircle.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let cx = canvas.width / 2, cy = canvas.height / 2;
  let c1x = cx, c1y = cy, c1r = 100;
  let c2x = cx + Math.sin(Date.now() * 0.001) * 200;
  let c2y = cy + Math.sin(Date.now() * 0.0008) * 150;
  let c2r = 100;

  let hit = circleToCircle(c1x, c1y, c1r, c2x, c2y, c2r);
  drawCircleToCircle(
    ctx,
    { x: c1x, y: c1y, radius: c1r },
    { x: c2x, y: c2y, radius: c2r },
    hit,
    canvas.width,
    performance.now()
  );

  requestAnimationFrame(draw);
}

draw();`;

const CIRCLE_RECT_HTML = `<canvas id="canvas"></canvas>`;
const CIRCLE_RECT_JS = `// ─── the core algorithms ───────────────────────────────────────────────────
${sineCurve.toString()}

${pointCircleFn.toString()}

function linePoint(line, point, buffer = 0.1) {
  const d1 = Math.hypot(point.x - line.startPoint.x, point.y - line.startPoint.y);
  const d2 = Math.hypot(point.x - line.endPoint.x, point.y - line.endPoint.y);
  const lineLen = lineLength(line);
  return d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer;
}

${lineLength.toString()}

function lineCircle(line, circle) {
  let inside1 = pointCircle(line.startPoint, circle);
  let inside2 = pointCircle(line.endPoint, circle);
  if (inside1 || inside2) return true;

  let len = lineLength(line);
  let dot =
    ((circle.x - line.startPoint.x) * (line.endPoint.x - line.startPoint.x) +
      (circle.y - line.startPoint.y) * (line.endPoint.y - line.startPoint.y)) /
    Math.pow(len, 2);

  let closestX =
    line.startPoint.x + dot * (line.endPoint.x - line.startPoint.x);
  let closestY =
    line.startPoint.y + dot * (line.endPoint.y - line.startPoint.y);

  let onSegment = linePoint(line, { x: closestX, y: closestY });
  if (!onSegment) return false;

  let tempLine = {
    startPoint: { x: closestX, y: closestY },
    endPoint: { x: circle.x, y: circle.y },
  };
  let distance = lineLength(tempLine);

  if (distance <= circle.radius) return true;
  return false;
}

${polygonPoint.keyFunction.toString()}

function polygonCircle(polygon, circle) {
  let next = 0;
  const { vertices } = polygon;
  for (let current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next === vertices.length) next = 0;

    let startPoint = vertices[current];
    let endPoint = vertices[next];
    let line = { startPoint, endPoint };
    let collision = lineCircle(line, circle);
    if (collision) return true;
  }

  let centerInside = polygonPoint(polygon, {
    x: circle.x,
    y: circle.y,
  });
  if (centerInside) return true;

  return false;
}

${getRotation.keyFunction.toString()}

function createRect(width, height, angle = 0, options = { rotate: false, rotateSpeed: 1000, clockwise: true }) {
  const vertices = [];
  let x = width / 2;
  let y = height / 2;
  const center = { x: 0, y: 0 };
  const dist = lineLength({ startPoint: center, endPoint: { x, y } });
  const atan2 = getRotation(center, { x, y });
  const rotate = options.rotate ?? false;
  const rotateSpeed = options.rotateSpeed ?? 1000;
  const clockwise = options.clockwise ?? true;
  const rotateQ = rotate ? options.time / rotateSpeed : 0;
  const spinDirection = clockwise ? [-rotateQ, rotateQ] : [rotateQ, -rotateQ];
  x = -dist * Math.cos(atan2 + angle + spinDirection[0]);
  y = dist * Math.sin(atan2 + angle + spinDirection[0]);
  vertices.push({ x, y });
  x = dist * Math.cos(atan2 - angle + spinDirection[1]);
  y = dist * Math.sin(atan2 - angle + spinDirection[1]);
  vertices.push({ x, y });
  x = dist * Math.cos(atan2 + angle + spinDirection[0]);
  y = -dist * Math.sin(atan2 + angle + spinDirection[0]);
  vertices.push({ x, y });
  x = -dist * Math.cos(atan2 - angle + spinDirection[1]);
  y = -dist * Math.sin(atan2 - angle + spinDirection[1]);
  vertices.push({ x, y });
  return { vertices };
}

${drawCircleToRectangle.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  drawCircleToRectangle(
    ctx,
    canvas.width,
    canvas.height,
    performance.now(),
    sineCurve,
    polygonCircle,
    createRect
  );

  requestAnimationFrame(draw);
}

draw();`;

const LINE_CIRCLE_HTML = `<canvas id="canvas"></canvas>`;
const LINE_CIRCLE_JS = `// ─── the core algorithm ─────────────────────────────────────────────────────
${lineToCircle.toString()}

${drawLineToCircle.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let centerX = canvas.width / 2, centerY = canvas.height / 2;

  // Static circle
  let cx = centerX, cy = centerY, cr = 100;

  // Moving and rotating line
  let lineAngle = Date.now() * 0.003;
  let lineCx = centerX + Math.sin(Date.now() * 0.0005) * 150;
  let lineCy = centerY;
  const lineLen = 50;
  let x1 = lineCx + Math.cos(lineAngle) * lineLen;
  let y1 = lineCy + Math.sin(lineAngle) * lineLen;
  let x2 = lineCx - Math.cos(lineAngle) * lineLen;
  let y2 = lineCy - Math.sin(lineAngle) * lineLen;

  let hit = lineToCircle(x1, y1, x2, y2, cx, cy, cr);
  drawLineToCircle(
    ctx,
    { startPoint: { x: x1, y: y1 }, endPoint: { x: x2, y: y2 } },
    { x: cx, y: cy, radius: cr },
    hit,
    canvas.width / 2,
    performance.now()
  );

  requestAnimationFrame(draw);
}

draw();`;

const LINE_LINE_HTML = `<canvas id="canvas"></canvas>`;
const LINE_LINE_JS = `// ─── the core algorithm ─────────────────────────────────────────────────────
${lineToLine.toString()}

${drawLineToLine.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let centerX = canvas.width / 2, centerY = canvas.height / 2;

  // Static horizontal line (blue)
  let x1 = centerX - 100, y1 = centerY;
  let x2 = centerX + 100, y2 = centerY;

  // Moving and rotating line (red)
  let angle1 = Date.now() * 0.003;
  let x3 = centerX + Math.sin(Date.now() * 0.0005) * 150;
  let y3 = centerY;
  const len = 100;
  let x3a = x3 + Math.cos(angle1) * len;
  let y3a = y3 + Math.sin(angle1) * len;
  let x3b = x3 - Math.cos(angle1) * len;
  let y3b = y3 - Math.sin(angle1) * len;

  let hit = lineToLine(x1, y1, x2, y2, x3a, y3a, x3b, y3b);
  drawLineToLine(
    ctx,
    { startPoint: { x: x3a, y: y3a }, endPoint: { x: x3b, y: y3b } },
    { startPoint: { x: x1, y: y1 }, endPoint: { x: x2, y: y2 } },
    hit,
    canvas.width / 2,
    performance.now()
  );

  requestAnimationFrame(draw);
}

draw();`;

const LINE_POINT_HTML = `<canvas id="canvas"></canvas>`;
const LINE_POINT_JS = `// ─── the core algorithm ─────────────────────────────────────────────────────
${lineToPoint.toString()}

${drawLineToPoint.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let centerX = canvas.width / 2, centerY = canvas.height / 2;
  let x1 = centerX - 150, y1 = centerY;
  let x2 = centerX + 150, y2 = centerY;
  let px = centerX + Math.sin(Date.now() * 0.001) * 150;
  let py = centerY + Math.sin(Date.now() * 0.0008) * 150;

  const line = {
    startPoint: { x: x1, y: y1 },
    endPoint: { x: x2, y: y2 },
  };
  const point = { x: px, y: py };
  let hit = lineToPoint(x1, y1, x2, y2, px, py, 20);
  drawLineToPoint(ctx, line, point, 5, hit, canvas.width);

  requestAnimationFrame(draw);
}

draw();`;

const LINE_RECT_HTML = `<canvas id="canvas"></canvas>`;
const LINE_RECT_JS = `// ─── the core algorithm ─────────────────────────────────────────────────────
${lineLineFn.toString()}

function polygonLine(polygon, line) {
  let next = 0;
  const vertices = polygon.vertices;
  for (let current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next === vertices.length) next = 0;
    const tempLine = {
      startPoint: { x: vertices[current].x, y: vertices[current].y },
      endPoint: { x: vertices[next].x, y: vertices[next].y },
    };
    if (lineLine(line, tempLine).hit) return true;
  }
  return false;
}

${lineLength.toString()}

${getRotation.keyFunction.toString()}

function createRect(width, height, angle = 0, options = { rotate: false, rotateSpeed: 1000, clockwise: true }) {
  const vertices = [];
  let x = width / 2;
  let y = height / 2;
  const center = { x: 0, y: 0 };
  const dist = lineLength({ startPoint: center, endPoint: { x, y } });
  const atan2 = getRotation(center, { x, y });
  const rotate = options.rotate ?? false;
  const rotateSpeed = options.rotateSpeed ?? 1000;
  const clockwise = options.clockwise ?? true;
  const time = options.time ?? 0;
  const rotateQ = rotate ? time / rotateSpeed : 0;
  const spinDirection = clockwise ? [-rotateQ, rotateQ] : [rotateQ, -rotateQ];
  x = -dist * Math.cos(atan2 + angle + spinDirection[0]);
  y = dist * Math.sin(atan2 + angle + spinDirection[0]);
  vertices.push({ x, y });
  x = dist * Math.cos(atan2 - angle + spinDirection[1]);
  y = dist * Math.sin(atan2 - angle + spinDirection[1]);
  vertices.push({ x, y });
  x = dist * Math.cos(atan2 + angle + spinDirection[0]);
  y = -dist * Math.sin(atan2 + angle + spinDirection[0]);
  vertices.push({ x, y });
  x = -dist * Math.cos(atan2 - angle + spinDirection[1]);
  y = -dist * Math.sin(atan2 - angle + spinDirection[1]);
  vertices.push({ x, y });
  return { vertices };
}

${drawLineToRectangle.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();
let rotate1 = 0;

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let centerX = canvas.width / 2, centerY = canvas.height / 2;
  const rect = createRect(100, 100, 0, {
    rotate: true,
    rotateSpeed: 2000,
    time: performance.now(),
  });
  rect.vertices.forEach((vertex) => {
    vertex.x += centerX;
    vertex.y += centerY;
  });

  let x1 = centerX + Math.sin(Date.now() * 0.0005) * 150;
  let y1 = centerY;
  const lineLen = 100;
  let x2 = x1 + lineLen * Math.cos(2 * Math.PI * (rotate1 / 360));
  let y2 = y1 + lineLen * Math.sin(2 * Math.PI * (rotate1 / 360));
  let x3 = x1 - lineLen * Math.cos(2 * Math.PI * (rotate1 / 360));
  let y3 = y1 - lineLen * Math.sin(2 * Math.PI * (rotate1 / 360));
  rotate1++;
  if (rotate1 > 360) rotate1 = 0;

  const line = {
    startPoint: { x: x2, y: y2 },
    endPoint: { x: x3, y: y3 },
  };
  let hit = polygonLine(rect, line);
  drawLineToRectangle(ctx, rect, line, hit, canvas.width, performance.now());

  requestAnimationFrame(draw);
}

draw();`;

const RECT_RECT_HTML = `<canvas id="canvas"></canvas>`;
const RECT_RECT_JS = `// ─── the core algorithms ───────────────────────────────────────────────────
${sineCurve.toString()}

${lineLineFn.toString()}

function polygonLine(polygon, line) {
  let next = 0;
  const { vertices } = polygon;
  for (let current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next === vertices.length) next = 0;

    let x3 = vertices[current].x;
    let y3 = vertices[current].y;
    let x4 = vertices[next].x;
    let y4 = vertices[next].y;

    let tempLine = {
      startPoint: { x: x3, y: y3 },
      endPoint: { x: x4, y: y4 },
    };
    let hit = lineLine(line, tempLine).hit;
    if (hit) return true;
  }

  return false;
}

${polygonPoint.keyFunction.toString()}

function polygonPolygon(polygon1, polygon2) {
  let next = 0;
  const { vertices } = polygon1;
  for (let current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next === vertices.length) next = 0;

    let startPoint = vertices[current];
    let endPoint = vertices[next];
    let line = { startPoint, endPoint };

    let collision = polygonLine(polygon2, line);
    if (collision) return true;

    collision = polygonPoint(polygon1, polygon2.vertices[0]);
    if (collision) return true;
  }

  return false;
}

${lineLength.toString()}

${getRotation.keyFunction.toString()}

function createRect(width, height, angle = 0, options = { rotate: false, rotateSpeed: 1000, clockwise: true }) {
  const vertices = [];
  let x = width / 2;
  let y = height / 2;
  const center = { x: 0, y: 0 };
  const dist = lineLength({ startPoint: center, endPoint: { x, y } });
  const atan2 = getRotation(center, { x, y });
  const rotate = options.rotate ?? false;
  const rotateSpeed = options.rotateSpeed ?? 1000;
  const clockwise = options.clockwise ?? true;
  const rotateQ = rotate ? options.time / rotateSpeed : 0;
  const spinDirection = clockwise ? [-rotateQ, rotateQ] : [rotateQ, -rotateQ];
  x = -dist * Math.cos(atan2 + angle + spinDirection[0]);
  y = dist * Math.sin(atan2 + angle + spinDirection[0]);
  vertices.push({ x, y });
  x = dist * Math.cos(atan2 - angle + spinDirection[1]);
  y = dist * Math.sin(atan2 - angle + spinDirection[1]);
  vertices.push({ x, y });
  x = dist * Math.cos(atan2 + angle + spinDirection[0]);
  y = -dist * Math.sin(atan2 + angle + spinDirection[0]);
  vertices.push({ x, y });
  x = -dist * Math.cos(atan2 - angle + spinDirection[1]);
  y = -dist * Math.sin(atan2 - angle + spinDirection[1]);
  vertices.push({ x, y });
  return { vertices };
}

${drawRectToRect.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  drawRectToRect(
    ctx,
    canvas.width,
    canvas.height,
    performance.now(),
    sineCurve,
    polygonPolygon,
    createRect
  );

  requestAnimationFrame(draw);
}

draw();`;

const POLYGON_POLYGON_HTML = `<canvas id="canvas"></canvas>`;
const POLYGON_POLYGON_JS = `// ─── the core algorithms ───────────────────────────────────────────────────
${sineCurve.toString()}

${lineLineFn.toString()}

function polygonLine(polygon, line) {
  let next = 0;
  const { vertices } = polygon;
  for (let current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next === vertices.length) next = 0;

    let x3 = vertices[current].x;
    let y3 = vertices[current].y;
    let x4 = vertices[next].x;
    let y4 = vertices[next].y;

    let tempLine = {
      startPoint: { x: x3, y: y3 },
      endPoint: { x: x4, y: y4 },
    };
    let hit = lineLine(line, tempLine).hit;
    if (hit) return true;
  }

  return false;
}

${polygonPoint.keyFunction.toString()}

function polygonPolygon(polygon1, polygon2) {
  let next = 0;
  const { vertices } = polygon1;
  for (let current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next === vertices.length) next = 0;

    let startPoint = vertices[current];
    let endPoint = vertices[next];
    let line = { startPoint, endPoint };

    let collision = polygonLine(polygon2, line);
    if (collision) return true;

    collision = polygonPoint(polygon1, polygon2.vertices[0]);
    if (collision) return true;
  }

  return false;
}

${starVertices.toString()}

${drawPolygonToPolygon.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  drawPolygonToPolygon(
    ctx,
    canvas.width,
    canvas.height,
    performance.now(),
    sineCurve,
    polygonPolygon,
    starVertices
  );

  requestAnimationFrame(draw);
}

draw();`;

// ── spring (damped harmonic motion) ──────────────────────────────────────────
const SPRING_HTML = `<canvas id="canvas"></canvas>
<div id="controls">
  <label>stiffness <input type="range" id="stiffness" min="40" max="400" step="10" value="170"></label>
</div>`;
const SPRING_JS = `// ─── the core algorithm ─────────────────────────────────────────────────────
${springValue.toString()}

${criticalDamping.toString()}

// ─── the drawing ────────────────────────────────────────────────────────────
${drawSpring.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state: three springs, same stiffness, different damping ─────────────────
let stiffness = 170;
let time = 0;
let target = 0;
let under = { value: canvas.width * 0.15, velocity: 0 };
let critical = { value: canvas.width * 0.15, velocity: 0 };
let over = { value: canvas.width * 0.15, velocity: 0 };

function draw() {
  const deltaSeconds = 1 / 60;
  time += deltaSeconds;

  const left = canvas.width * 0.3;
  const right = canvas.width * 0.75;
  target = Math.floor(time / 2.2) % 2 === 0 ? right : left;

  const critDamp = criticalDamping(stiffness);
  under = springValue(under, target, { stiffness, damping: critDamp * 0.25, deltaSeconds });
  critical = springValue(critical, target, { stiffness, damping: critDamp, deltaSeconds });
  over = springValue(over, target, { stiffness, damping: critDamp * 2.5, deltaSeconds });

  const h = canvas.height;
  drawSpring(ctx, canvas.width, h, target, [
    { y: h * 0.3, pos: under.value, color: '#ef4444', label: 'underdamped — bounces' },
    { y: h * 0.55, pos: critical.value, color: '#34d399', label: 'critically damped — no overshoot' },
    { y: h * 0.8, pos: over.value, color: '#6366f1', label: 'overdamped — sluggish' },
  ]);

  requestAnimationFrame(draw);
}

document.getElementById('stiffness').addEventListener('input', e => {
  stiffness = parseFloat(e.target.value);
});

draw();`;

const SIMPLE_EQUATION_PENS: ExamplePen[] = [
  {
    group: "Simple Useful Equations",
    key: "center-on-parent",
    label: "Center on Parent",
    blurb: "Compute the x/y offset that centers a child rectangle inside a parent.",
    payload: {
      title: "Center on Parent",
      description: "Center a child box by subtracting its size from the parent size and halving the remainder.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `${drawCenterOnParent.toString()}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();
function loop() {
  drawCenterOnParent(ctx, canvas.width, canvas.height, performance.now() * 0.001);
  requestAnimationFrame(loop);
}
loop();`,
      editors: "001",
    },
  },
  {
    group: "Simple Useful Equations",
    key: "degrees-to-radians",
    label: "Degrees to Radians",
    blurb: "Convert familiar degree angles into the radians JavaScript trig functions expect.",
    payload: {
      title: "Degrees to Radians",
      description: "JavaScript trig uses radians, so 180 degrees becomes PI radians.",
      html: `<canvas id="canvas"></canvas><div id="controls"><label>degrees <input id="deg" type="range" min="0" max="360" value="45"></label></div>`,
      css: FULLSCREEN_CSS,
      js: `${drawDegreesToRadians.toString()}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const slider = document.getElementById('deg');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();
function loop() {
  drawDegreesToRadians(ctx, canvas.width, canvas.height, Number(slider.value));
  requestAnimationFrame(loop);
}
loop();`,
      editors: "001",
    },
  },
  {
    group: "Simple Useful Equations",
    key: "radians-to-degrees",
    label: "Radians to Degrees",
    blurb: "Convert radian values back into readable degrees.",
    payload: {
      title: "Radians to Degrees",
      description: "Radians are the natural unit for trig; degrees are often easier to read.",
      html: `<canvas id="canvas"></canvas><div id="controls"><label>radians <input id="rad" type="range" min="0" max="6.283" step="0.001" value="0.785"></label></div>`,
      css: FULLSCREEN_CSS,
      js: `${drawRadiansToDegrees.toString()}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const slider = document.getElementById('rad');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();
function loop() {
  drawRadiansToDegrees(ctx, canvas.width, canvas.height, Number(slider.value));
  requestAnimationFrame(loop);
}
loop();`,
      editors: "001",
    },
  },
  {
    group: "Simple Useful Equations",
    key: "format-number-with-commas",
    label: "Format Number with Commas",
    blurb: "Format large numbers into readable thousands groups.",
    payload: {
      title: "Format Number with Commas",
      description: "A tiny formatting helper for making large values scan quickly.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `${drawFormatNumberWithCommas.toString()}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();
function loop() {
  drawFormatNumberWithCommas(ctx, canvas.width, canvas.height, performance.now());
  requestAnimationFrame(loop);
}
loop();`,
      editors: "001",
    },
  },
  {
    group: "Simple Useful Equations",
    key: "random-integer-between",
    label: "Random Integer Between",
    blurb: "Roll inclusive integer values inside a min/max range.",
    payload: {
      title: "Random Integer Between",
      description: "Generate whole numbers with inclusive lower and upper bounds.",
      html: `<canvas id="canvas"></canvas><div id="controls"><button id="roll">roll</button></div>`,
      css: FULLSCREEN_CSS,
      js: `${drawRandomIntegerBetween.toString()}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let values = [];
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();
function randomIntegerBetween(min, max) { max++; return Math.floor(Math.random() * (max - min) + min); }
function roll() { values = Array.from({ length: 28 }, () => randomIntegerBetween(1, 6)); drawRandomIntegerBetween(ctx, canvas.width, canvas.height, values); }
document.getElementById('roll').addEventListener('click', roll);
roll();`,
      editors: "001",
    },
  },
  {
    group: "Simple Useful Equations",
    key: "random-number-between",
    label: "Random Number Between",
    blurb: "Generate floating-point random values inside a min/max range.",
    payload: {
      title: "Random Number Between",
      description: "Generate decimal values greater than or equal to min and less than max.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `${drawRandomNumberBetween.toString()}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let samples = [];
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();
function randomNumberBetween(min, max) { return Math.random() * (max - min) + min; }
ctx.fillStyle = '#0a0a0f';
ctx.fillRect(0, 0, canvas.width, canvas.height);
function loop() {
  if (samples.length > 160) samples.shift();
  samples.push(randomNumberBetween(20, canvas.width - 20));
  drawRandomNumberBetween(ctx, canvas.width, canvas.height, samples);
  requestAnimationFrame(loop);
}
loop();`,
      editors: "001",
    },
  },
];

const COLOR_AND_VECTOR_PENS: ExamplePen[] = [
  {
    group: "Useful Little Things",
    key: "color-lerp",
    label: "Color Lerp (RGB vs HSL)",
    blurb: "Compare straight RGB blending with hue-aware HSL blending.",
    payload: {
      title: "Color Lerp — RGB vs HSL",
      description: "RGB interpolation can pass through gray; HSL interpolation travels around the color wheel.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `function lerp(a, b, t) { return a + (b - a) * t; }
function rgbToHsl(rgb) {
  const rn = rgb.r / 255;
  const gn = rgb.g / 255;
  const bn = rgb.b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h, s: s * 100, l: l * 100 };
}
function hslToRgb(hsl) {
  const sn = hsl.s / 100;
  const ln = hsl.l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hp = ((((hsl.h % 360) + 360) % 360)) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0, g1 = 0, b1 = 0;
  if (hp < 1) [r1, g1, b1] = [c, x, 0];
  else if (hp < 2) [r1, g1, b1] = [x, c, 0];
  else if (hp < 3) [r1, g1, b1] = [0, c, x];
  else if (hp < 4) [r1, g1, b1] = [0, x, c];
  else if (hp < 5) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  const m = ln - c / 2;
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}
function lerpColor(a, b, t) {
  return {
    r: lerp(a.r, b.r, t),
    g: lerp(a.g, b.g, t),
    b: lerp(a.b, b.b, t),
  };
}
function lerpColorHsl(a, b, t) {
  const ha = rgbToHsl(a);
  const hb = rgbToHsl(b);
  const dh = ((((hb.h - ha.h) % 360) + 540) % 360) - 180;
  return hslToRgb({
    h: ha.h + dh * t,
    s: lerp(ha.s, hb.s, t),
    l: lerp(ha.l, hb.l, t),
  });
}
function rgbToCss(rgb) {
  return 'rgb(' + Math.round(rgb.r) + ', ' + Math.round(rgb.g) + ', ' + Math.round(rgb.b) + ')';
}
${drawColorLerp.toString()}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();
const a = { r: 37, g: 99, b: 235 };
const b = { r: 250, g: 204, b: 21 };
const rgbStops = [], hslStops = [];
for (let i = 0; i < 64; i++) {
  const t = i / 63;
  rgbStops.push(rgbToCss(lerpColor(a, b, t)));
  hslStops.push(rgbToCss(lerpColorHsl(a, b, t)));
}
function draw() {
  const t = (Math.sin(performance.now() * 0.001) + 1) / 2;
  drawColorLerp(ctx, rgbStops, hslStops, t, canvas.width, canvas.height);
  requestAnimationFrame(draw);
}
draw();`,
      editors: "001",
    },
  },
  {
    group: "Useful Little Things",
    key: "color-families",
    label: "Color Families",
    blurb: "Generate ordered palettes from named slices of the hue wheel.",
    payload: {
      title: "Color Families",
      description: "Pick a named hue family and generate a coherent palette from that slice of the color wheel.",
      html: `<canvas id="canvas"></canvas><div id="controls"><label>family <select id="family"><option>all</option><option>red</option><option>orange</option><option>yellow</option><option>green</option><option>cyan</option><option>blue</option><option>purple</option><option>pink</option></select></label></div>`,
      css: FULLSCREEN_CSS,
      js: `${hslToRgb.toString()}
${rgbToCss.toString()}
${drawColorFamily.toString()}

const HUE_FAMILIES = { all: [0, 360], red: [-12, 18], orange: [18, 45], yellow: [45, 70], green: [80, 160], cyan: [160, 200], blue: [200, 250], purple: [255, 290], pink: [300, 345] };
function colorFamily(family, count) {
  const range = HUE_FAMILIES[family] || HUE_FAMILIES.all;
  const out = [];
  for (let i = 0; i < count; i++) {
    const f = count <= 1 ? 0.5 : i / (count - 1);
    const h = range[0] + f * (range[1] - range[0]);
    out.push(hslToRgb({ h, s: 72, l: 50 + Math.sin(f * Math.PI) * 16 }));
  }
  return out;
}
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const select = document.getElementById('family');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; draw(); }
window.addEventListener('resize', resize);
resize();
select.addEventListener('change', draw);
function draw() {
  const family = select.value;
  const colors = colorFamily(family, 36).map(rgbToCss);
  drawColorFamily(ctx, colors, family, canvas.width, canvas.height, 90);
}`,
      editors: "001",
    },
  },
  {
    group: "Math & Physics",
    key: "vector-reflection",
    label: "Vector Reflection",
    blurb: "Reflect an incoming vector across a wall normal.",
    payload: {
      title: "Vector Reflection",
      description: "A bounce is the incoming vector reflected across the surface normal.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `${vecNormalize.toString()}
${vecPerpendicular.toString()}
${vecReflect.toString()}
function drawArrow(ctx, fromX, fromY, toX, toY, color, label) {
  const ang = Math.atan2(toY - fromY, toX - fromX);
  const head = 11;
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(fromX, fromY); ctx.lineTo(toX, toY); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - head * Math.cos(ang - Math.PI / 6), toY - head * Math.sin(ang - Math.PI / 6));
  ctx.lineTo(toX - head * Math.cos(ang + Math.PI / 6), toY - head * Math.sin(ang + Math.PI / 6));
  ctx.closePath(); ctx.fill();
  if (label) { ctx.font = 'bold 12px monospace'; ctx.fillText(label, toX + 8, toY - 8); }
}
${drawVectorReflect.toString()}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();
const incoming = vecNormalize({ x: 1, y: 0.55 });
function draw() {
  const wallAngle = performance.now() * 0.001;
  const wallDir = { x: Math.cos(wallAngle), y: Math.sin(wallAngle) };
  const normal = vecNormalize(vecPerpendicular(wallDir));
  const reflected = vecReflect(incoming, normal);
  drawVectorReflect(ctx, canvas.width / 2, canvas.height / 2, incoming, normal, reflected, wallDir, canvas.width, canvas.height);
  requestAnimationFrame(draw);
}
draw();`,
      editors: "001",
    },
  },
  {
    group: "Math & Physics",
    key: "vector-rotation",
    label: "Vector Rotation",
    blurb: "Rotate a shape by passing every point through vecRotate.",
    payload: {
      title: "Vector Rotation",
      description: "Rotation remixes each point's x and y with sine and cosine.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `${vecRotate.toString()}
${drawVectorRotate.toString()}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();
const basePoints = Array.from({ length: 9 }, (_, i) => {
  const a = (Math.PI * 2 * i) / 9;
  const r = i % 2 ? 82 : 150;
  return { x: Math.cos(a) * r, y: Math.sin(a) * r };
});
function draw() {
  drawVectorRotate(
    ctx,
    canvas.width / 2,
    canvas.height / 2,
    basePoints,
    performance.now() * 0.001,
    canvas.width,
    canvas.height,
    vecRotate
  );
  requestAnimationFrame(draw);
}
draw();`,
      editors: "001",
    },
  },
  {
    group: "Math & Physics",
    key: "angle-lerp-shortest-turn",
    label: "Angle Lerp",
    blurb: "Show why angles need shortest-path interpolation instead of raw lerp.",
    payload: {
      title: "Angle Lerp — Shortest Turn",
      description: "350 degrees to 10 degrees is a short hop, not an almost-full spin.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `${wrapAngle.toString()}
${shortestAngleBetween.toString()}
${lerpAngle.toString()}
function drawDial(ctx, cx, cy, r, angle, color, label) {
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = color; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color; ctx.font = 'bold 13px monospace'; ctx.textAlign = 'center'; ctx.fillText(label, cx, cy + r + 28); ctx.textAlign = 'left';
}
${drawAngleLerp.toString()}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();
const startAngle = 350 * Math.PI / 180;
const targetAngle = 10 * Math.PI / 180;
function draw() {
  const t = (Math.sin(performance.now() * 0.001) + 1) / 2;
  const naive = startAngle + (targetAngle - startAngle) * t;
  const smart = lerpAngle(startAngle, targetAngle, t);
  drawAngleLerp(ctx, canvas.width, canvas.height, naive, smart, startAngle, targetAngle, t);
  requestAnimationFrame(draw);
}
draw();`,
      editors: "001",
    },
  },
  {
    group: "Math & Physics",
    key: "murmuration",
    label: "Murmuration",
    blurb: "A lightweight flocking sketch using the same bird renderer as the Examples animation.",
    payload: {
      title: "Murmuration",
      description: "Many small triangles steer toward a wandering target, creating a flock-like smear.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `${drawBird.toString()}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();
const birds = Array.from({ length: 180 }, () => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: Math.random() * 2 - 1, vy: Math.random() * 2 - 1 }));
function draw() {
  const t = performance.now() * 0.00035;
  const target = { x: canvas.width / 2 + Math.cos(t * 3.1) * canvas.width * 0.25, y: canvas.height / 2 + Math.sin(t * 2.7) * canvas.height * 0.25 };
  ctx.fillStyle = 'rgba(10,10,18,0.18)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#d8e2ff';
  for (const b of birds) {
    b.vx += (target.x - b.x) * 0.00008 + (Math.random() - 0.5) * 0.05;
    b.vy += (target.y - b.y) * 0.00008 + (Math.random() - 0.5) * 0.05;
    const m = Math.hypot(b.vx, b.vy) || 1;
    if (m > 3.4) { b.vx = b.vx / m * 3.4; b.vy = b.vy / m * 3.4; }
    b.x = (b.x + b.vx + canvas.width) % canvas.width;
    b.y = (b.y + b.vy + canvas.height) % canvas.height;
    drawBird(ctx, b.x, b.y, Math.atan2(b.vy, b.vx), 4);
  }
  requestAnimationFrame(draw);
}
ctx.fillStyle = '#0a0a12';
ctx.fillRect(0, 0, canvas.width, canvas.height);
draw();`,
      editors: "001",
    },
  },
];

const PRETTY_AND_FRACTAL_PENS: ExamplePen[] = [
  {
    group: "Math & Physics",
    key: "sierpinski",
    label: "Sierpinski Triangle",
    blurb: "Recursively remove middle triangles to reveal a classic fractal.",
    payload: {
      title: "Sierpinski Triangle",
      description: "Each triangle splits into three smaller triangles; repeat and the fractal appears.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `${sierpinskiMidpoints.toString()}

${drawSierpinski.toString()}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

const state = {
  triangles: [{ radius: canvas.height / 4, phase: 0, ratio: 0, hasSpawned: false }],
  rotation: 0
};
function loop() {
  drawSierpinski(ctx, canvas.width, canvas.height, state);
  requestAnimationFrame(loop);
}
loop();`,
      editors: "001",
    },
  },
  {
    group: "Pretty Things",
    key: "glitter",
    label: "Glitter",
    blurb: "A standalone glitter field inspired by the Examples effect.",
    payload: {
      title: "Glitter",
      description: "A dense field of gold particles and rotating beams.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();
const dots = Array.from({ length: 650 }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, s: Math.random() * 2.2 + 0.3, a: Math.random() * 0.35 + 0.08 }));
function draw() {
  const t = performance.now() * 0.001;
  ctx.fillStyle = '#170425'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save(); ctx.translate(canvas.width / 2, canvas.height / 2); ctx.globalCompositeOperation = 'lighter';
  for (const d of dots) {
    const x = d.x * canvas.width * 0.43 + Math.cos(t + d.y * 8) * 40;
    const y = d.y * canvas.height * 0.43 + Math.sin(t * 0.8 + d.x * 8) * 40;
    ctx.globalAlpha = d.a; ctx.fillStyle = '#ffee5c'; ctx.beginPath(); ctx.arc(x, y, d.s, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 0.045; ctx.strokeStyle = '#ffee5c'; ctx.lineWidth = 2;
  for (let i = 0; i < 90; i++) { ctx.rotate(0.17); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(canvas.width * 0.45 * (0.4 + Math.sin(t + i) * 0.3), 0); ctx.stroke(); }
  ctx.restore(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  requestAnimationFrame(draw);
}
draw();`,
      editors: "001",
    },
  },
  {
    group: "Pretty Things",
    key: "pretty-ring",
    label: "Pretty Ring",
    blurb: "A layered glowing ring of orbiting particles.",
    payload: {
      title: "Pretty Ring",
      description: "Layered particles orbit around the center with small wobbling offsets.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();
const colors = ['#446996', '#2d4264', '#0b482a', '#888136', '#633321'];
function draw() {
  const t = performance.now() * 0.0005;
  ctx.fillStyle = '#02050b'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save(); ctx.translate(canvas.width / 2, canvas.height / 2); ctx.rotate(t); ctx.globalCompositeOperation = 'lighter';
  const base = Math.min(canvas.width, canvas.height) * 0.26;
  for (let i = 0; i < 720; i++) {
    const a = i / 720 * Math.PI * 2;
    const layer = i % 3 - 1;
    const r = base + layer * 28 + Math.sin(t * 8 + i) * 12;
    ctx.fillStyle = colors[i % colors.length];
    ctx.globalAlpha = 0.55;
    ctx.beginPath(); ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 2.4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  requestAnimationFrame(draw);
}
draw();`,
      editors: "001",
    },
  },
  {
    group: "Pretty Things",
    key: "sparklies",
    label: "Sparklies",
    blurb: "Small firework bursts with fading jewel-toned particles.",
    payload: {
      title: "Sparklies",
      description: "A field of looping firework bursts.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();
const bursts = Array.from({ length: 24 }, () => makeBurst());
function makeBurst() { return { x: Math.random() * canvas.width, y: Math.random() * canvas.height, age: Math.random() * 120, life: 90 + Math.random() * 90, hue: Math.random() * 360 }; }
function draw() {
  ctx.fillStyle = 'rgba(2,3,9,0.28)'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < bursts.length; i++) {
    const b = bursts[i]; b.age++;
    const p = b.age / b.life;
    if (p >= 1) { bursts[i] = makeBurst(); continue; }
    for (let j = 0; j < 18; j++) {
      const a = j / 18 * Math.PI * 2;
      const d = p * 95;
      ctx.globalAlpha = 1 - p;
      ctx.fillStyle = 'hsl(' + (b.hue + j * 18) + ', 90%, 65%)';
      ctx.beginPath(); ctx.arc(b.x + Math.cos(a) * d, b.y + Math.sin(a) * d, 2.2, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  requestAnimationFrame(draw);
}
draw();`,
      editors: "001",
    },
  },
  {
    group: "Pretty Things",
    key: "klimt",
    label: "Klimt-Inspired Swirls",
    blurb: "Gold-toned ornamental ribbons and mosaic-like marks.",
    payload: {
      title: "Klimt-Inspired Swirls",
      description: "Curving gold ribbons with jewel accents, loosely inspired by Klimt ornament.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `${createKlimtSwirls.toString()}

${drawKlimt.toString()}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

const swirls = createKlimtSwirls(canvas.width, canvas.height);
function loop() {
  drawKlimt(ctx, canvas.width, canvas.height, swirls);
  requestAnimationFrame(loop);
}
loop();`,
      editors: "001",
    },
  },
];

export const EXAMPLE_PENS: ExamplePen[] = [
  ...SIMPLE_EQUATION_PENS,
  ...COLOR_AND_VECTOR_PENS,
  ...PRETTY_AND_FRACTAL_PENS,
  {
    group: "Math & Physics",
    key: "spring-damped-harmonic",
    label: "Spring (Damped Harmonic Motion)",
    blurb:
      "Three balls chase a target with the same stiffness but different damping — underdamped bounces, critically damped snaps, overdamped crawls.",
    payload: {
      title: "Spring — Damped Harmonic Motion",
      description:
        "A mass-on-a-spring (Hooke's law + damping). Same stiffness, three damping ratios: underdamped overshoots and bounces, critically damped is the fastest approach with no overshoot, overdamped is sluggish.",
      html: SPRING_HTML,
      css: FULLSCREEN_CSS,
      js: SPRING_JS,
      editors: "001",
    },
  },
  {
    group: "Animations",
    key: "ball-bounce",
    label: "Ball Bounce",
    blurb:
      "Rainbow waves of balls fall with gravity, bounce and lose energy, then settle — with motion trails.",
    payload: {
      title: "Ball Bounce",
      description:
        "A rainbow wave of balls falls with gravity and bounces with realistic energy loss; once they settle, a fresh wave drops in. Trails come from fading each frame.",
      html: BALL_BOUNCE_HTML,
      css: FULLSCREEN_CSS,
      js: BALL_BOUNCE_JS,
      editors: "001",
    },
  },
  {
    group: "Animations",
    key: "balls-bouncing-against-each-other",
    label: "Balls Bouncing Against Each Other",
    blurb:
      "Multiple balls collide with each other and the walls, using spring forces.",
    payload: {
      title: "Balls Bouncing Against Each Other",
      description:
        "Watch multiple balls bounce off each other using spring-based collision.",
      html: BALLS_BOUNCING_HTML,
      css: FULLSCREEN_CSS,
      js: BALLS_BOUNCING_JS,
      editors: "001",
    },
  },
  {
    group: "Animations",
    key: "ball-orbiting-a-sun",
    label: "Ball Orbiting a Sun",
    blurb:
      "A ball orbits a sun using gravitational attraction, drawn as a spiral.",
    payload: {
      title: "Orbital Motion",
      description:
        "A ball orbits a sun using gravitational force — scale up the mass for a solar system.",
      html: ORBITAL_MOTION_HTML,
      css: FULLSCREEN_CSS,
      js: ORBITAL_MOTION_JS,
      editors: "001",
    },
  },
  {
    group: "Animations",
    key: "lerp-smooth-follow",
    label: "lerp (Smooth Follow)",
    blurb:
      "Linear interpolation: smoothly follow a target by always moving a fraction of the way there.",
    payload: {
      title: "lerp — Linear Interpolation",
      description:
        "Smoothly follow a target using linear interpolation (a + (b-a)*t).",
      html: LERP_HTML,
      css: FULLSCREEN_CSS,
      js: LERP_JS,
      editors: "001",
    },
  },
  {
    group: "Animations",
    key: "easing-functions",
    label: "Easing Functions",
    blurb:
      "Compare different easing curves to smooth out motion in an animation.",
    payload: {
      title: "Easing Functions",
      description:
        "Easing functions shape the motion curve — linear, ease-in, ease-out, ease-in-out.",
      html: EASING_HTML,
      css: FULLSCREEN_CSS,
      js: EASING_JS,
      editors: "001",
    },
  },
  {
    group: "Animations",
    key: "quadratic-bezier-curve",
    label: "Quadratic Bézier Curve",
    blurb:
      "A curve controlled by three points: two endpoints and one control point in between.",
    payload: {
      title: "Quadratic Bézier Curve",
      description:
        "A smooth curve defined by three points using the quadratic Bézier formula.",
      html: QUADRATIC_BEZIER_HTML,
      css: FULLSCREEN_CSS,
      js: QUADRATIC_BEZIER_JS,
      editors: "001",
    },
  },
  {
    group: "Animations",
    key: "find-points-on-a-circle",
    label: "Find Points on a Circle",
    blurb: "Distribute points evenly around a circle using trigonometry.",
    payload: {
      title: "Find Points on a Circle",
      description:
        "Distribute n points around a circle: x = cx + r·cos(angle), y = cy + r·sin(angle).",
      html: FIND_POINTS_CIRCLE_HTML,
      css: FULLSCREEN_CSS,
      js: FIND_POINTS_CIRCLE_JS,
      editors: "001",
    },
  },
  {
    group: "Animations",
    key: "move-to-changing-point",
    label: "Move Object to Changing Point",
    blurb:
      "Smoothly move toward a target that changes position, following at a fixed speed.",
    payload: {
      title: "Move to Destination",
      description:
        "Move toward a target point at a constant speed using vector normalization.",
      html: MOVE_TO_DESTINATION_HTML,
      css: FULLSCREEN_CSS,
      js: MOVE_TO_DESTINATION_JS,
      editors: "001",
    },
  },
  {
    group: "Animations",
    key: "point-object-towards-another",
    label: "Point Object Towards Another",
    blurb: "Rotate an arrow to always face a moving target using atan2.",
    payload: {
      title: "Point Towards",
      description: "Make an object point toward another using atan2(dy, dx).",
      html: POINT_TOWARDS_HTML,
      css: FULLSCREEN_CSS,
      js: POINT_TOWARDS_JS,
      editors: "001",
    },
  },
  {
    group: "Animations",
    key: "sine-curve",
    label: "Sine Curve",
    blurb:
      "A flowing sine wave that changes over time, showing the core of oscillation.",
    payload: {
      title: "Sine Curve",
      description: "A simple sine wave that scrolls across the canvas.",
      html: SINE_CURVE_HTML,
      css: FULLSCREEN_CSS,
      js: SINE_CURVE_JS,
      editors: "001",
    },
  },
  {
    group: "Animations",
    key: "demystify-sine-and-cosine",
    label: "Demystify Sine & Cosine",
    blurb:
      "A unit-circle triangle that shows cosine shrinking horizontally while sine grows vertically.",
    payload: {
      title: "Demystify Sine & Cosine",
      description:
        "See sine and cosine as adjacent and opposite over a shared radius in the top-right quarter of a circle.",
      html: DEMYSTIFY_SINE_COSINE_HTML,
      css: FULLSCREEN_CSS,
      js: DEMYSTIFY_SINE_COSINE_JS,
      editors: "001",
    },
  },
  {
    group: "Collision Detection",
    key: "point-to-circle-collision",
    label: "Point to Circle",
    blurb: "Detect when a moving point enters a circle.",
    payload: {
      title: "Point to Circle",
      description:
        "Simplest collision: distance from point to center <= radius.",
      html: POINT_CIRCLE_HTML,
      css: FULLSCREEN_CSS,
      js: POINT_CIRCLE_JS,
      editors: "001",
    },
  },
  {
    group: "Collision Detection",
    key: "point-to-rectangle-collision",
    label: "Point to Rectangle",
    blurb: "Detect when a moving point enters a rotating rectangle.",
    payload: {
      title: "Point to Rectangle",
      description:
        "Point-in-polygon collision against a spinning rectangle.",
      html: POINT_RECT_HTML,
      css: FULLSCREEN_CSS,
      js: POINT_RECT_JS,
      editors: "001",
    },
  },
  {
    group: "Collision Detection",
    key: "circle-to-circle-collision",
    label: "Circle to Circle",
    blurb: "Detect when two circles collide using distance between centers.",
    payload: {
      title: "Circle to Circle",
      description: "Distance between centers <= sum of radii.",
      html: CIRCLE_CIRCLE_HTML,
      css: FULLSCREEN_CSS,
      js: CIRCLE_CIRCLE_JS,
      editors: "001",
    },
  },
  {
    group: "Collision Detection",
    key: "circle-to-rectangle-collision",
    label: "Circle to Rectangle",
    blurb: "Detect when a circle collides with an axis-aligned rectangle.",
    payload: {
      title: "Circle to Rectangle",
      description:
        "Find closest point on rect to circle center, check distance.",
      html: CIRCLE_RECT_HTML,
      css: FULLSCREEN_CSS,
      js: CIRCLE_RECT_JS,
      editors: "001",
    },
  },
  {
    group: "Collision Detection",
    key: "line-to-circle-collision",
    label: "Line to Circle",
    blurb: "Detect when a line segment comes close enough to a circle.",
    payload: {
      title: "Line to Circle",
      description:
        "Project circle center onto line, check if projection is within radius.",
      html: LINE_CIRCLE_HTML,
      css: FULLSCREEN_CSS,
      js: LINE_CIRCLE_JS,
      editors: "001",
    },
  },
  {
    group: "Collision Detection",
    key: "line-to-line-collision",
    label: "Line to Line",
    blurb:
      "Detect when two line segments intersect using parametric intersection.",
    payload: {
      title: "Line to Line",
      description:
        "Parametric intersection test: solve for t and u in both lines.",
      html: LINE_LINE_HTML,
      css: FULLSCREEN_CSS,
      js: LINE_LINE_JS,
      editors: "001",
    },
  },
  {
    group: "Collision Detection",
    key: "line-to-point-collision",
    label: "Line to Point",
    blurb:
      "Detect when a point comes within a threshold distance of a line segment.",
    payload: {
      title: "Line to Point",
      description: "Project point onto line, measure distance to projection.",
      html: LINE_POINT_HTML,
      css: FULLSCREEN_CSS,
      js: LINE_POINT_JS,
      editors: "001",
    },
  },
  {
    group: "Collision Detection",
    key: "line-to-rectangle-collision",
    label: "Line to Rectangle",
    blurb:
      "Detect when a line segment intersects any edge of an axis-aligned rectangle.",
    payload: {
      title: "Line to Rectangle",
      description: "Test line against all four rect edges using line-to-line.",
      html: LINE_RECT_HTML,
      css: FULLSCREEN_CSS,
      js: LINE_RECT_JS,
      editors: "001",
    },
  },
  {
    group: "Collision Detection",
    key: "rectangle-to-rectangle-collision",
    label: "Rectangle to Rectangle",
    blurb:
      "Detect when two axis-aligned rectangles overlap using AABB (axis-aligned bounding box).",
    payload: {
      title: "Rectangle to Rectangle",
      description: "AABB collision: check if rectangles overlap on both axes.",
      html: RECT_RECT_HTML,
      css: FULLSCREEN_CSS,
      js: RECT_RECT_JS,
      editors: "001",
    },
  },
  {
    group: "Collision Detection",
    key: "polygon-to-polygon-collision",
    label: "Polygon to Polygon",
    blurb:
      "Detect when two arbitrary polygons collide using point-in-polygon and ray casting.",
    payload: {
      title: "Polygon to Polygon",
      description:
        "Check if any vertex of one polygon is inside the other (ray casting).",
      html: POLYGON_POLYGON_HTML,
      css: FULLSCREEN_CSS,
      js: POLYGON_POLYGON_JS,
      editors: "001",
    },
  },
  {
    group: "Useful Little Things",
    key: "get-a-point-on-a-line",
    label: "Get a Point on a Line",
    blurb: "Find a point at a given percentage along a line segment.",
    payload: {
      title: "Get Point on Line",
      description:
        "Linearly interpolate between two points: p = p1 + t*(p2-p1).",
      html: `<canvas id="canvas"></canvas><div id="controls"><label>t: <input type="range" id="t" min="-40" max="140" step="1" value="50"></label></div>`,
      css: FULLSCREEN_CSS,
      js: `// ─── the core algorithm ─────────────────────────────────────────────────────
function getPointOnLine(startPoint, endPoint, percentage) {
  let x = startPoint.x + percentage * (endPoint.x - startPoint.x);
  let y = startPoint.y + percentage * (endPoint.y - startPoint.y);
  return { x, y };
}

const T_MIN = -0.4;
const T_MAX = 1.4;

${drawGetPointOnLine.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let t = 0.5;
let startPoint = {x: canvas.width * 0.2, y: canvas.height * 0.7};
let endPoint = {x: canvas.width * 0.8, y: canvas.height * 0.3};

function draw() {
  drawGetPointOnLine(ctx, startPoint, endPoint, t, getPointOnLine);
  requestAnimationFrame(draw);
}

document.getElementById('t').addEventListener('input', e => {
  t = parseInt(e.target.value) / 100;
});

draw();`,
      editors: "001",
    },
  },
  {
    group: "Useful Little Things",
    key: "get-triangle-data-from-line",
    label: "Triangle Data from Line",
    blurb:
      "Create a right triangle from a line segment by finding the perpendicular point.",
    payload: {
      title: "Triangle Data from Line",
      description:
        "Given a line, construct a right triangle showing rise/run components.",
      html: `<canvas id="canvas"></canvas><div id="info" style="position: fixed; top: 20px; left: 20px; color: #d8e2ff; font-family: monospace; font-size: 12px;"></div>`,
      css: FULLSCREEN_CSS,
      js: `// ─── the core algorithm ─────────────────────────────────────────────────────
${lineLength.toString()}

// alias used inside calculateTriangleData
const LineLengthFunc = lineLength;

function calculateTriangleData(startPoint, endPoint) {
  let hypotenuse = LineLengthFunc({ startPoint, endPoint });
  let adjacent = LineLengthFunc({ startPoint, endPoint: { x: endPoint.x, y: startPoint.y } });
  let opposite = LineLengthFunc({ startPoint: { x: endPoint.x, y: startPoint.y }, endPoint });
  let oh = opposite / hypotenuse;
  let angle1 = Math.asin(oh);
  let angleInDegrees = Math.floor(angle1 * (180 / Math.PI));
  let remainingAngle = 180 - angleInDegrees - 90;
  return { angleInDegrees, remainingAngle, hypotenuse, adjacent, opposite };
}

function distanceBetweenPoints(startPoint, endPoint) {
  let a = startPoint.x - endPoint.x;
  let b = startPoint.y - endPoint.y;
  return Math.sqrt(a * a + b * b);
}

${drawTriangleDataFromLine.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const infoDiv = document.getElementById('info');
ctx.font = '14px monospace';
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let startPoint = { x: canvas.width * 0.2, y: canvas.height * 0.7 };
let endPoint = { x: canvas.width * 0.8, y: canvas.height * 0.3 };
let dragging = false;

function draw() {
  ctx.font = '14px monospace';
  drawTriangleDataFromLine(ctx, startPoint, endPoint, infoDiv);
}

canvas.addEventListener('pointerdown', (e) => {
  let { top, left } = canvas.getBoundingClientRect();
  startPoint = { x: Math.floor(e.pageX - left), y: Math.floor(e.pageY - top) };
  dragging = true;
  draw();
});

canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  let { top, left } = canvas.getBoundingClientRect();
  endPoint = { x: Math.floor(e.pageX - left), y: Math.floor(e.pageY - top) };
  draw();
});

canvas.addEventListener('pointerup', () => { dragging = false; });

draw();`,
      editors: "001",
    },
  },
  {
    group: "Useful Little Things",
    key: "draw-star",
    label: "Draw Star",
    blurb: "Draw a star by alternating between outer and inner radius points.",
    payload: {
      title: "Draw Star",
      description:
        "A star alternates between outer and inner radii at regular angles.",
      html: `<canvas id="canvas"></canvas><div id="controls"><label>points: <input type="range" id="points" min="3" max="12" step="1" value="5"></label></div>`,
      css: FULLSCREEN_CSS,
      js: `// ─── the core algorithm ─────────────────────────────────────────────────────
${starVertices.toString()}

${drawStar.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let numPoints = 5;

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let cx = canvas.width / 2, cy = canvas.height / 2;
  let t = Date.now() * 0.001;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(t);

  let star = starVertices(numPoints, 40, 100, 0);
  drawStar(ctx, star, 0, 0);

  ctx.restore();

  requestAnimationFrame(draw);
}

document.getElementById('points').addEventListener('input', e => {
  numPoints = parseInt(e.target.value);
});

draw();`,
      editors: "001",
    },
  },
  {
    group: "Useful Little Things",
    key: "draw-rectangle",
    label: "Draw Rectangle (using trig, not rect())",
    blurb: "Draw a rectangle using trigonometry to understand rotated shapes.",
    payload: {
      title: "Draw Rectangle with Trig",
      description: "Draw a rectangle by computing corners using cos/sin.",
      html: `<canvas id="canvas"></canvas><div id="controls"><label>rotation: <input type="range" id="rotation" min="0" max="360" step="1" value="0"></label></div>`,
      css: FULLSCREEN_CSS,
      js: `// ─── the core algorithm ─────────────────────────────────────────────────────
${lineLength.toString()}
${getRotation.keyFunction.toString()}
function createRect(width, height, angle = 0, options = { rotate: false, rotateSpeed: 1000, clockwise: true }) {
  const vertices = [];
  let x = width / 2;
  let y = height / 2;
  const center = { x: 0, y: 0 };
  const dist = lineLength({ startPoint: center, endPoint: { x, y } });
  const atan2 = getRotation(center, { x, y });
  const rotate = options.rotate ?? false;
  const rotateSpeed = options.rotateSpeed ?? 1000;
  const clockwise = options.clockwise ?? true;
  const time = options.time ?? 0;
  const rotateQ = rotate ? time / rotateSpeed : 0;
  const spinDirection = clockwise ? [-rotateQ, rotateQ] : [rotateQ, -rotateQ];
  x = -dist * Math.cos(atan2 + angle + spinDirection[0]);
  y = dist * Math.sin(atan2 + angle + spinDirection[0]);
  vertices.push({ x, y });
  x = dist * Math.cos(atan2 - angle + spinDirection[1]);
  y = dist * Math.sin(atan2 - angle + spinDirection[1]);
  vertices.push({ x, y });
  x = dist * Math.cos(atan2 + angle + spinDirection[0]);
  y = -dist * Math.sin(atan2 + angle + spinDirection[0]);
  vertices.push({ x, y });
  x = -dist * Math.cos(atan2 - angle + spinDirection[1]);
  y = -dist * Math.sin(atan2 - angle + spinDirection[1]);
  vertices.push({ x, y });
  return { vertices };
}

// ─── the drawing helper from the /examples animation ────────────────────────
${drawPolygon.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let rotation = 0;

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let cx = canvas.width / 2, cy = canvas.height / 2;
  let angle = rotation * Math.PI / 180;

  let rect = createRect(200, 100, angle);
  drawPolygon(ctx, rect, cx, cy);

  requestAnimationFrame(draw);
}

document.getElementById('rotation').addEventListener('input', e => {
  rotation = parseInt(e.target.value);
});

draw();`,
      editors: "001",
    },
  },
  {
    group: "Useful Little Things",
    key: "equilateral-trianlge-points",
    label: "Equilateral Triangle",
    blurb:
      "Draw an equilateral triangle by placing vertices at 120° intervals.",
    payload: {
      title: "Equilateral Triangle",
      description: "Three vertices at 120° intervals from the top.",
      html: `<canvas id="canvas"></canvas><div id="info" style="position: fixed; top: 20px; left: 20px; color: #d8e2ff; font-family: monospace; font-size: 12px;"><h3>Click and drag to draw triangle</h3></div>`,
      css: FULLSCREEN_CSS,
      js: `// ─── the core algorithm ─────────────────────────────────────────────────────
${equilateralTriangle.toString()}

${drawEquilateralTriangleAnimation.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let backgroundTris = [];
let angle = 0;
let startPoint = { x: canvas.width / 2, y: canvas.height / 2 + 50 };
let endPoint = { x: canvas.width / 2, y: canvas.height / 2 - 50 };
let dragging = false;

for (let i = 0; i < 10; i++) {
  backgroundTris.push({
    radius: Math.random() * 100 + 50,
    centerPoint: { x: Math.random() * canvas.width, y: Math.random() * canvas.height },
    angle: Math.random()
  });
}

function getAngle(from, to) {
  return Math.atan2(to.y - from.y, to.x - from.x);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  angle = getAngle(startPoint, endPoint);
  drawEquilateralTriangle(
    ctx,
    backgroundTris,
    angle,
    startPoint,
    endPoint,
    canvas.width,
    canvas.height,
    equilateralTriangle
  );
}

canvas.addEventListener('pointerdown', (e) => {
  let { top, left } = canvas.getBoundingClientRect();
  startPoint = { x: Math.floor(e.pageX - left), y: Math.floor(e.pageY - top) };
  endPoint = { x: 0, y: 0 };
  dragging = true;
  draw();
});

canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  let { top, left } = canvas.getBoundingClientRect();
  endPoint = { x: Math.floor(e.pageX - left), y: Math.floor(e.pageY - top) };
  draw();
});

canvas.addEventListener('pointerup', () => { dragging = false; });

draw();`,
      editors: "001",
    },
  },
  {
    group: "Useful Little Things",
    key: "circle-from-three-points",
    label: "Circle from Three Points",
    blurb:
      "Find the circumcircle that passes through three points using perpendicular bisectors.",
    payload: {
      title: "Circle from Three Points",
      description:
        "Compute circumcenter and circumradius from three non-collinear points.",
      html: `<canvas id="canvas"></canvas><div id="info" style="position: fixed; top: 20px; left: 20px; color: #d8e2ff; font-family: monospace; font-size: 12px;"></div>`,
      css: FULLSCREEN_CSS,
      js: `// ─── the core algorithm ─────────────────────────────────────────────────────
${circleFromThreePoints.toString()}

// alias used inside drawCircleFromThreePoints
const CircleFromThreePointsFunc = circleFromThreePoints;

${drawCircleFromThreePoints.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const infoDiv = document.getElementById('info');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let points = [];
let circleQ = 0;
let text = ['<h3>Click screen three times to make three points.</h3>'];
let interval = null;

function render() {
  if (points.length === 3) {
    let r = circleFromThreePoints(points[0], points[1], points[2]);
    text[3] = '<p>radius: ' + Math.floor(r.radius) + ', center: { x: ' + Math.floor(r.center.x) + ', y: ' + Math.floor(r.center.y) + ' }</p>';
  }
  drawCircleFromThreePoints(ctx, points, text, circleQ, infoDiv);
}

function animateCircle() {
  let degree = 5 * (Math.PI / 180);
  circleQ = Math.min(circleQ + degree, Math.PI * 2);
  render();
  if (circleQ < Math.PI * 2) {
    interval = setTimeout(animateCircle, 10);
  }
}

canvas.addEventListener('pointerdown', (e) => {
  let { top, left } = canvas.getBoundingClientRect();
  if (points.length === 3) {
    points = [];
    circleQ = 0;
    text = ['<h3>Click screen three times to make three points.</h3>'];
    if (interval) clearTimeout(interval);
  }
  points.push({ x: Math.floor(e.pageX - left), y: Math.floor(e.pageY - top) });
  text[2] = '<p>' + points.map((p, i) => 'point ' + (i + 1) + ': { x:' + p.x + ', y:' + p.y + ' }').join(', ') + '</p>';
  render();
  if (points.length === 3) {
    interval = setTimeout(animateCircle, 10);
  }
});

render();`,
      editors: "001",
    },
  },
  {
    group: "Useful Little Things",
    key: "distribute-around-circle",
    label: "Distribute Points Around Circle",
    blurb:
      "Evenly distribute points around a circle using uniform angle intervals.",
    payload: {
      title: "Distribute Points Around Circle",
      description: "Place n points at uniform angular intervals on a circle.",
      html: `<canvas id="canvas"></canvas><div id="controls"><label>points: <input type="range" id="points" min="3" max="100" step="5" value="20"></label></div>`,
      css: FULLSCREEN_CSS,
      js: `// ─── the core algorithm ─────────────────────────────────────────────────────
function distributeAroundCircle(centerPoint, radius, totalItems) {
  const points = [];
  for (let i = 0; i < totalItems; i++) {
    const angle = (Math.PI * 2 * i) / totalItems;
    points.push({
      x: centerPoint.x + radius * Math.cos(angle),
      y: centerPoint.y + radius * Math.sin(angle),
    });
  }
  return points;
}

function cosWave(startValue, differential, speed) {
  const currentDate = new Date();
  return startValue + Math.cos(currentDate.getTime() * speed) * differential;
}

${drawDistributeAroundCircle.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let totalItems = 20;

function draw() {
  drawDistributeAroundCircle(
    ctx,
    canvas.width,
    canvas.height,
    totalItems,
    distributeAroundCircle
  );
  requestAnimationFrame(draw);
}

document.getElementById('points').addEventListener('input', e => {
  totalItems = parseInt(e.target.value);
});

draw();`,
      editors: "001",
    },
  },
  {
    group: "Useful Little Things",
    key: "line-length",
    label: "Distance Between Two Points",
    blurb:
      "Calculate the straight-line distance between two points using the Pythagorean theorem.",
    payload: {
      title: "Distance Between Two Points",
      description: "distance = sqrt((x2-x1)² + (y2-y1)²)",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `// ─── the core algorithm ─────────────────────────────────────────────────────
${lineLength.toString()}
const LineLengthFunc = lineLength;

function getHypAngle(originPoint, destinationPoint) {
  return Math.atan2(
    destinationPoint.y - originPoint.y,
    destinationPoint.x - originPoint.x
  );
}

${drawLineLength.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  let t = Date.now() * 0.001;
  let startPoint = {x: canvas.width * 0.3, y: canvas.height / 2};
  let endPoint = {x: canvas.width * 0.7 + Math.sin(t) * 100, y: canvas.height / 2 + Math.cos(t) * 80};

  drawLineLength(
    ctx,
    startPoint,
    endPoint,
    canvas.width,
    canvas.height,
    lineLength
  );
  requestAnimationFrame(draw);
}

draw();`,
      editors: "001",
    },
  },
  {
    group: "Useful Little Things",
    key: "bezier-curves",
    label: "Bézier Curves (de Casteljau)",
    blurb: "Draw smooth Bézier curves using recursive linear interpolation.",
    payload: {
      title: "Bézier Curves — de Casteljau",
      description:
        "Cubic Bézier: recursively interpolate between control points.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `// ─── core algorithm ──────────────────────────────────────────────────────────
${deCasteljau.toString()}

// ─── standalone draw ─────────────────────────────────────────────────────────
${drawBezierCurves.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

let t = 0;
let dir = 1;

function draw() {
  const w = canvas.width;
  const h = canvas.height;
  const points = [
    { x: w * 0.15, y: h * 0.8, color: '#e74c3c' },
    { x: w * 0.35, y: h * 0.2, color: '#3498db' },
    { x: w * 0.65, y: h * 0.2, color: '#2ecc71' },
    { x: w * 0.85, y: h * 0.8, color: '#f39c12' },
  ];
  drawBezierCurves(ctx, points, t);
  t += 0.005 * dir;
  if (t >= 1) { t = 1; dir = -1; }
  if (t <= 0) { t = 0; dir = 1; }
  requestAnimationFrame(draw);
}

draw();`,
      editors: "001",
    },
  },
  {
    group: "Math & Physics",
    key: "fourier-epicycles",
    label: "Fourier Epicycles",
    blurb:
      "Draw shapes using rotating circles (epicycles) derived from Fourier transform of a path.",
    payload: {
      title: "Fourier Epicycles",
      description:
        "Any path can be drawn by summing rotating circles with different frequencies and phases.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `// ─── the core algorithm ─────────────────────────────────────────────────────
${dft.toString()}

${heartPath.toString()}

${drawFourierEpicycles.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
const numCircles = 64;
let fourier = dft(heartPath(numCircles * 4)).slice(0, numCircles);
let trail = [];
let time = 0;

function draw() {
  drawFourierEpicycles(ctx, fourier, time, trail);
  time += 1;
  if (time >= fourier.length) { time = 0; trail.length = 0; }
  requestAnimationFrame(draw);
}

draw();`,
      editors: "001",
    },
  },
  {
    group: "Math & Physics",
    key: "game-of-life",
    label: "Conway's Game of Life",
    blurb:
      "Classic cellular automaton: cells live, die, or spawn based on neighbor count.",
    payload: {
      title: "Conway's Game of Life",
      description:
        "Four rules on a grid: 1. Underpop = death. 2. 2-3 neighbors = survive. 3. Overpop = death. 4. Exactly 3 neighbors = birth.",
      html: `<canvas id="canvas"></canvas><div id="controls"><button id="reset">Reset</button><button id="toggle">Pause/Play</button></div>`,
      css: FULLSCREEN_CSS,
      js: `${gameOfLifeStep.toString()}
${drawGameOfLife.toString()}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const CELL = 12;
let cols, rows, grid, running = true, tickInterval;

function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  cols = Math.floor(canvas.width / CELL);
  rows = Math.floor(canvas.height / CELL);
  grid = new Uint8Array(cols * rows);
  randomize();
}
window.addEventListener('resize', resize);

function randomize() {
  for (let i = 0; i < grid.length; i++) grid[i] = Math.random() < 0.3 ? 1 : 0;
}

function tick() { grid = gameOfLifeStep(grid, cols, rows); }

function draw() {
  drawGameOfLife(ctx, grid, cols, rows);
  requestAnimationFrame(draw);
}

document.getElementById('reset').addEventListener('click', randomize);
document.getElementById('toggle').addEventListener('click', () => {
  running = !running;
  if (running) tickInterval = setInterval(tick, 100);
  else clearInterval(tickInterval);
});

resize();
tickInterval = setInterval(tick, 100);
draw();`,
      editors: "001",
    },
  },
  {
    group: "Math & Physics",
    key: "wave-interference",
    label: "Wave Interference",
    blurb:
      "See constructive and destructive interference of ripples from multiple sources.",
    payload: {
      title: "Wave Interference",
      description:
        "Multiple sources create ripples; where peaks meet = bright, where troughs meet = dark.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `${drawWaveInterference.toString()}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
window.addEventListener('resize', () => { resize(); sources = makeSources(); });
resize();

function makeSources() {
  return [
    { x: canvas.width / 2 - 80, y: canvas.height / 2 },
    { x: canvas.width / 2 + 80, y: canvas.height / 2 },
  ];
}

let sources = makeSources();
const wavelength = 60;
const speed = 1.5;
let time = 0;

function draw() {
  drawWaveInterference(ctx, sources, wavelength, speed, time);
  time += speed * 0.06;
  requestAnimationFrame(draw);
}

draw();`,
      editors: "001",
    },
  },
  {
    group: "Math & Physics",
    key: "gravitational-lensing",
    label: "Gravitational Lensing",
    blurb:
      "Watch light rays bend around a massive object, demonstrating spacetime curvature.",
    payload: {
      title: "Gravitational Lensing",
      description:
        "Light rays pass near a massive object and are deflected by its gravity.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `${drawGravitationalLensing.toString()}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

const mass = 120;
const numRays = 50;
let lensX = canvas.width * 0.45, lensY = canvas.height / 2;
let homeX = lensX, homeY = lensY;
let time = 0;

const stars = Array.from({ length: 80 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.4 + 0.3,
  brightness: 0.3 + Math.random() * 0.7,
}));

function draw() {
  const yb = homeY + canvas.height / 2 * 0.5 * Math.sin(time * 0.6);
  const xb = homeX + canvas.width / 2 * 0.1 * Math.sin(time * 0.3);
  lensY = Math.min(Math.max(yb, 12), canvas.height - 12);
  lensX = Math.min(Math.max(xb, 12), canvas.width - 12);
  drawGravitationalLensing(ctx, lensX, lensY, mass, numRays, time, stars);
  time += 0.03;
  requestAnimationFrame(draw);
}

draw();`,
      editors: "001",
    },
  },
  {
    group: "Math & Physics",
    key: "orbital-precession",
    label: "Orbital Precession (GR)",
    blurb:
      "See how General Relativity adds a small ε/r² correction to orbital force, causing the orbit to precess.",
    payload: {
      title: "Orbital Precession",
      description:
        "Einstein's correction to Newtonian gravity causes elliptical orbits to slowly rotate.",
      html: `<canvas id="canvas"></canvas><div id="controls"><label>GR ε: <input type="range" id="gr" min="0" max="3000" step="50" value="800"></label></div>`,
      css: FULLSCREEN_CSS,
      js: `${newtonAccel.toString()}
${grAccel.toString()}
${drawOrbitalPrecession.toString()}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

const R0 = 195, V0 = 1.04;
let epsilon = 800;
const stepsPerFrame = 4;

function makeBody() {
  return { x: canvas.width / 2 + R0, y: canvas.height / 2, vx: 0, vy: -V0, trail: [] };
}
let newton = makeBody();
let gr = makeBody();

function draw() {
  drawOrbitalPrecession(ctx, newton, gr, epsilon, stepsPerFrame);
  requestAnimationFrame(draw);
}

document.getElementById('gr').addEventListener('input', e => {
  epsilon = Number(e.target.value);
});

draw();`,
      editors: "001",
    },
  },
];
