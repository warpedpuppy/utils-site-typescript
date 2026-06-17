import { CodePenPayload } from "./codepen";
import { BallBounce } from "../../pages/createJSON/formulas/animation/BallBounce";
import { BallToBallBounce } from "../../pages/createJSON/formulas/animation/BallToBallBounce";
import { Lerp } from "../../pages/createJSON/formulas/animation/Lerp";
import { linear, easeIn, easeOut, easeInOut } from "../../core-functions/Easing";
import { QuadraticBezier } from "../../pages/createJSON/formulas/animation/QuadraticBezier";
import { DistributeAroundCircle } from "../../pages/createJSON/formulas/animation/DistributeAroundCircle";
import { GetRotation } from "../../pages/createJSON/formulas/animation/GetRotation";
import { gravitationalStep } from "../../core-functions/OrbitalMotion";
import { moveToward } from "../../core-functions/MoveToward";
import { SineCurve } from "../../core-functions/SineCurve";
import { unitCirclePoint } from "../../core-functions/UnitCirclePoint";
import { pointToCircle } from "../../core-functions/PointToCircle";
import { pointToRect } from "../../core-functions/PointToRect";
import { circleToCircle } from "../../core-functions/CircleToCircle";
import { circleToRect } from "../../core-functions/CircleToRect";
import { lineToCircle } from "../../core-functions/LineToCircle";
import { lineToLine } from "../../core-functions/LineToLine";
import { lineToPoint } from "../../core-functions/LineToPoint";
import { lineToRect } from "../../core-functions/LineToRect";
import { rectToRect } from "../../core-functions/RectToRect";
import { polygonToPolygon } from "../../core-functions/PolygonToPolygon";
import { getPointOnLine } from "../../core-functions/GetPointOnLine";
import { getTriangleData } from "../../core-functions/GetTriangleData";
import { DrawStar } from "../../core-functions/Star";
import { CreateRect } from "../../core-functions/Rectangle";
import { drawEquilateralTriangle } from "../../core-functions/DrawEquilateralTriangle";
import { CircleFromThreePoints } from "../../core-functions/CircleFromThreePoints";
import { distributeAroundCircle } from "../../core-functions/DistributeAroundCircleFlat";
import { distance } from "../../core-functions/Distance";
import { bezierPoint } from "../../core-functions/BezierCurve";
import { dft } from "../../core-functions/DFT";
import { step } from "../../core-functions/GameOfLife";
import { waveAmplitude } from "../../core-functions/WaveAmplitude";
import { lensDeflection } from "../../core-functions/LensDeflection";
import { grStep } from "../../core-functions/GRStep";
import { LineLength } from "../../core-functions/LineLength";
import { MoveAlongLine } from "../../core-functions/MoveAlongLine";
import { drawBallBounce } from "../../core-animations/BallBounce";
import { drawBallBall } from "../../core-animations/BallBall";
import { drawLerp } from "../../core-animations/Lerp";
import { drawEasing } from "../../core-animations/Easing";
import { drawQuadraticBezier } from "../../core-animations/QuadraticBezier";
import { drawDistributeAroundCircle } from "../../core-animations/DistributeAroundCircle";
import { drawMoveToDestination } from "../../core-animations/MoveToDestination";
import { drawPointTowards } from "../../core-animations/PointTowards";
import { drawSineCurve } from "../../core-animations/SineCurve";
import { drawDeMystifySineCosine } from "../../core-animations/DeMystifySineCosine";

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
const BALL_BOUNCE_JS = `${BallBounce.keyFunction.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let ball = { x: 0, y: 0, radius: 18, vx: 5, vy: -10 };

function init() {
  ball.x = canvas.width * 0.25;
  ball.y = canvas.height * 0.25;
  ball.vx = 5;
  ball.vy = -10;
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  BallBounce(ball, { width: canvas.width, height: canvas.height });

  // ── Shadow on the floor ────────────────────────────────────────────────
  const maxDist = canvas.height - ball.radius;
  const distFrac = Math.max(0, 1 - (canvas.height - ball.radius - ball.y) / maxDist);
  const shadowAlpha = distFrac * 0.45;
  const shadowRx = ball.radius * (0.7 + distFrac * 0.8);
  const shadowRy = ball.radius * 0.22;

  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,' + shadowAlpha + ')';
  ctx.beginPath();
  ctx.ellipse(
    ball.x,
    canvas.height - 3,
    Math.max(shadowRx, 4),
    Math.max(shadowRy, 2),
    0, 0, Math.PI * 2
  );
  ctx.fill();
  ctx.restore();

  // ── Ball with radial gradient ──────────────────────────────────────────
  const gr = ctx.createRadialGradient(
    ball.x - ball.radius * 0.32,
    ball.y - ball.radius * 0.32,
    0,
    ball.x,
    ball.y,
    ball.radius
  );
  gr.addColorStop(0, '#c7d2fe');
  gr.addColorStop(0.55, '#818cf8');
  gr.addColorStop(1, '#3730a3');

  ctx.fillStyle = gr;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();

  requestAnimationFrame(draw);
}

init();
draw();`;

// ── Balls Bouncing Against Each Other ────────────────────────────────────────
const BALLS_BOUNCING_HTML = `<canvas id="canvas"></canvas>`;
const BALLS_BOUNCING_JS = `${BallToBallBounce.keyFunction.toString()}

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
const SPEED_LIMIT = 5;

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  balls.forEach((ball1) => {
    ball1.x += ball1.vx;
    ball1.y += ball1.vy;

    const gr = ctx.createRadialGradient(
      ball1.x - ball1.radius * 0.32,
      ball1.y - ball1.radius * 0.32,
      0,
      ball1.x,
      ball1.y,
      ball1.radius
    );
    gr.addColorStop(0, 'hsl(' + ball1.h + ' ' + ball1.s + '% ' + Math.min(95, ball1.l + 25) + '%)');
    gr.addColorStop(0.55, 'hsl(' + ball1.h + ' ' + ball1.s + '% ' + ball1.l + '%)');
    gr.addColorStop(1, 'hsl(' + ball1.h + ' ' + ball1.s + '% ' + Math.max(5, ball1.l - 25) + '%)');

    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.arc(ball1.x, ball1.y, ball1.radius, 0, 2 * Math.PI);
    ctx.fill();

    balls.forEach((ball2) => {
      BallToBallBounce(ball1, ball2);
    });

    // Keep on screen
    if (ball1.y > canvas.height - ball1.radius) {
      ball1.y = canvas.height - ball1.radius;
      ball1.vy *= -1;
    }
    if (ball1.y < ball1.radius) {
      ball1.y = ball1.radius;
      ball1.vy *= -1;
    }
    if (ball1.x > canvas.width - ball1.radius) {
      ball1.x = canvas.width - ball1.radius;
      ball1.vx *= -1;
    }
    if (ball1.x < ball1.radius) {
      ball1.x = ball1.radius;
      ball1.vx *= -1;
    }

    // Impose speed limit
    if (ball1.vx > SPEED_LIMIT) ball1.vx = SPEED_LIMIT;
    if (ball1.vy > SPEED_LIMIT) ball1.vy = SPEED_LIMIT;
  });

  requestAnimationFrame(draw);
}

draw();`;

// ── Orbital Motion ───────────────────────────────────────────────────────────
const ORBITAL_MOTION_HTML = `<canvas id="canvas"></canvas>`;
const ORBITAL_MOTION_JS = `// ─── the core algorithm ─────────────────────────────────────────────────────
${gravitationalStep.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let orbiter = { x: 0, y: 0, vx: 0, vy: 0 };
let sun = { x: 0, y: 0, mass: 100, radius: 60 };

function init() {
  sun.x = canvas.width / 2;
  sun.y = canvas.height / 2;
  orbiter.x = sun.x + 150;
  orbiter.y = sun.y;
  orbiter.vx = 0;
  orbiter.vy = 5;
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  gravitationalStep(orbiter, sun);

  // Faint orbit circle
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(sun.x, sun.y, 150, 0, Math.PI * 2);
  ctx.stroke();

  // Sun with radial gradient
  const sunGr = ctx.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, sun.radius);
  sunGr.addColorStop(0, '#fff7a1');
  sunGr.addColorStop(0.5, '#fde047');
  sunGr.addColorStop(0.8, '#f97316');
  sunGr.addColorStop(1, '#7c2d12');

  ctx.fillStyle = sunGr;
  ctx.beginPath();
  ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
  ctx.fill();

  // Sun corona glow ring
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.3)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(sun.x, sun.y, sun.radius + 12, 0, Math.PI * 2);
  ctx.stroke();

  // Orbiter with motion-aware lighting
  const dx = orbiter.x - sun.x;
  const dy = orbiter.y - sun.y;
  const highlightX = orbiter.x - dx * 0.15;
  const highlightY = orbiter.y - dy * 0.15;

  const orbiterGr = ctx.createRadialGradient(
    highlightX,
    highlightY,
    0,
    orbiter.x,
    orbiter.y,
    22
  );
  orbiterGr.addColorStop(0, '#bfdbfe');
  orbiterGr.addColorStop(0.5, '#3b82f6');
  orbiterGr.addColorStop(1, '#1e1b4b');

  ctx.fillStyle = orbiterGr;
  ctx.beginPath();
  ctx.arc(orbiter.x, orbiter.y, 22, 0, Math.PI * 2);
  ctx.fill();

  requestAnimationFrame(draw);
}

init();
draw();`;

// ── Lerp ─────────────────────────────────────────────────────────────────────
const LERP_HTML = `<canvas id="canvas"></canvas>
<div id="controls">
  <label>speed <input type="range" id="speed" min="0.01" max="0.1" step="0.01" value="0.05"></label>
</div>`;
const LERP_JS = `${Lerp.keyFunction.toString()}

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

  follower.x = Lerp(follower.x, target.x, lerpFactor);
  follower.y = Lerp(follower.y, target.y, lerpFactor);

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
const linear = (t) => t;
const easeInQuad = (t) => t * t;
const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);
const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOutElastic = (t) => {
  const c5 = (2 * Math.PI) / 4.5;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c5) + 1;
};
const easeOutBounce = (t) => {
  const n1 = 7.5625, d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  else return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

const PERIOD_MS = 2800;
const PAUSE_MS = 500;
const TRACKS = [
  { name: 'linear', color: '#94a3b8', fn: linear },
  { name: 'ease-in-quad', color: '#60a5fa', fn: easeInQuad },
  { name: 'ease-out-quad', color: '#34d399', fn: easeOutQuad },
  { name: 'ease-in-out-quad', color: '#a78bfa', fn: easeInOutQuad },
  { name: 'ease-out-elastic', color: '#f472b6', fn: easeOutElastic },
  { name: 'ease-out-bounce', color: '#fb923c', fn: easeOutBounce }
];

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let elapsed = Date.now() % (PERIOD_MS + PAUSE_MS);
  let t = elapsed < PERIOD_MS ? elapsed / PERIOD_MS : 1;

  TRACKS.forEach((track, idx) => {
    const trackY = (idx + 1) * (canvas.height / (TRACKS.length + 1));
    const ballR = Math.max(4, canvas.height / (TRACKS.length + 1) * 0.3);
    const eased = track.fn(t);
    const x = canvas.width * 0.1 + eased * (canvas.width * 0.8);

    // Draw glow ring
    ctx.strokeStyle = track.color;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = ballR;
    ctx.beginPath();
    ctx.arc(x, trackY, ballR * 1.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Draw ball
    ctx.fillStyle = track.color;
    ctx.beginPath();
    ctx.arc(x, trackY, ballR, 0, Math.PI * 2);
    ctx.fill();

    // Draw track name right-aligned
    ctx.font = '11px monospace';
    ctx.fillStyle = track.color;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(track.name, canvas.width * 0.95, trackY);
  });

  requestAnimationFrame(draw);
}

draw();`;

// ── Quadratic Bézier ────────────────────────────────────────────────────────
const QUADRATIC_BEZIER_HTML = `<canvas id="canvas"></canvas>`;
const QUADRATIC_BEZIER_JS = `${QuadraticBezier.keyFunction.toString()}

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
let draggingPoint = null;

function pointDistance(p1, p2) {
  const dx = p2.x - p1.x, dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dashed control polygon
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw Bézier curve (100 steps)
  ctx.strokeStyle = '#818cf8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    const pt = QuadraticBezier(t, p0, p1, p2);
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  }
  ctx.stroke();

  // Oscillating dot
  const dotT = (Math.sin(Date.now() * 0.003) + 1) / 2;
  const dotPt = QuadraticBezier(dotT, p0, p1, p2);
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.arc(dotPt.x, dotPt.y, 7, 0, Math.PI * 2);
  ctx.fill();

  // Draw control points
  const points = [
    { pt: p0, color: '#34d399', label: 'P0' },
    { pt: p1, color: '#f472b6', label: 'P1' },
    { pt: p2, color: '#34d399', label: 'P2' }
  ];

  points.forEach(({ pt, color, label }) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, HANDLE_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0a0a0f';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, pt.x, pt.y);
  });

  requestAnimationFrame(draw);
}

canvas.addEventListener('pointerdown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  if (pointDistance({ x: mx, y: my }, p0) < HANDLE_RADIUS + HIT_SLOP) {
    draggingPoint = p0;
  } else if (pointDistance({ x: mx, y: my }, p1) < HANDLE_RADIUS + HIT_SLOP) {
    draggingPoint = p1;
  } else if (pointDistance({ x: mx, y: my }, p2) < HANDLE_RADIUS + HIT_SLOP) {
    draggingPoint = p2;
  }
});

canvas.addEventListener('pointermove', (e) => {
  if (!draggingPoint) return;
  const rect = canvas.getBoundingClientRect();
  draggingPoint.x = e.clientX - rect.left;
  draggingPoint.y = e.clientY - rect.top;
});

canvas.addEventListener('pointerup', () => {
  draggingPoint = null;
});

draw();`;

// ── Find Points on a Circle ─────────────────────────────────────────────────
const FIND_POINTS_CIRCLE_HTML = `<canvas id="canvas"></canvas>
<div id="controls">
  <label>points: <input type="range" id="points" min="5" max="100" step="5" value="20"></label>
</div>`;
const FIND_POINTS_CIRCLE_JS = `${DistributeAroundCircle.keyFunction.toString()}

// ─── cosWave helper ─────────────────────────────────────────────────────────
function cosWave(s, d, sp) {
  return s + Math.cos(Date.now() * sp) * d;
}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let numPoints = 20;

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let cx = canvas.width / 2, cy = canvas.height / 2;

  // Oscillating circle radius
  let radius = cosWave(100, 100, 0.001);

  // Draw circle
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Get points around circle
  let points = DistributeAroundCircle({ x: cx, y: cy }, radius, numPoints);

  // Draw lines from center to each point
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  points.forEach((pt) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
  });

  requestAnimationFrame(draw);
}

document.getElementById('points').addEventListener('input', e => {
  numPoints = parseInt(e.target.value);
});

draw();`;

// ── Move Object to Changing Point ───────────────────────────────────────────
const MOVE_TO_DESTINATION_HTML = `<canvas id="canvas"></canvas>`;
const MOVE_TO_DESTINATION_JS = `// ─── moveToward function ───────────────────────────────────────────────────
function moveToward(obj, dest, speed) {
  let dx = dest.x - obj.x, dy = dest.y - obj.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > speed) { obj.x += (dx / dist) * speed; obj.y += (dy / dist) * speed; }
  else { obj.x = dest.x; obj.y = dest.y; }
  return Math.atan2(dy, dx);
}

// ─── drawArrow helper ───────────────────────────────────────────────────────
function drawArrow(ctx, x, y, angle, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(size, 0);
  ctx.lineTo(-size, size * 0.6);
  ctx.lineTo(-size * 0.3, 0);
  ctx.lineTo(-size, -size * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let obj = { x: canvas.width * 0.5, y: canvas.height * 0.5 };
let dest = { x: 0, y: 0 };

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  dest.x = canvas.width / 2 + Math.sin(Date.now() * 0.0005) * 150;
  dest.y = canvas.height / 2 + Math.cos(Date.now() * 0.0003) * 100;

  const angle = moveToward(obj, dest, 2);

  // Draw moving target (green)
  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.arc(dest.x, dest.y, 8, 0, Math.PI * 2);
  ctx.fill();

  // Draw arrow pointing toward target
  drawArrow(ctx, obj.x, obj.y, angle, 12, '#f97316');

  requestAnimationFrame(draw);
}

draw();`;

// ── Point Object Towards Another ────────────────────────────────────────────
const POINT_TOWARDS_HTML = `<canvas id="canvas"></canvas>`;
const POINT_TOWARDS_JS = `${GetRotation.keyFunction.toString()}

// ─── drawArrow helper ───────────────────────────────────────────────────────
function drawArrow(ctx, x, y, angle, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(size, 0);
  ctx.lineTo(-size, size * 0.6);
  ctx.lineTo(-size * 0.3, 0);
  ctx.lineTo(-size, -size * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let pointer = { x: canvas.width * 0.5, y: canvas.height * 0.5 };
let target = { x: 0, y: 0 };

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Orbiting target
  let t = Date.now() * 0.001;
  let cx = canvas.width / 2, cy = canvas.height / 2;
  for (let i = 0; i < 360; i += 6) {
    const angle = i * Math.PI / 180;
    target.x = cx + Math.cos(angle) * 200;
    target.y = cy + Math.sin(angle) * 200;
  }
  target.x = cx + Math.cos(t) * 200;
  target.y = cy + Math.sin(t) * 200;

  // Draw circle
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, 200, 0, Math.PI * 2);
  ctx.stroke();

  // Draw target point
  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.arc(target.x, target.y, 6, 0, Math.PI * 2);
  ctx.fill();

  // Draw crosshair at center
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy);
  ctx.lineTo(cx + 20, cy);
  ctx.moveTo(cx, cy - 20);
  ctx.lineTo(cx, cy + 20);
  ctx.stroke();

  // Get rotation toward target
  const angle = GetRotation(pointer, target);

  // Draw arrow pointing toward target
  drawArrow(ctx, pointer.x, pointer.y, angle, 12, '#f97316');

  requestAnimationFrame(draw);
}

draw();`;

// ── Sine Curve ──────────────────────────────────────────────────────────────
const SINE_CURVE_HTML = `<canvas id="canvas"></canvas><div id="controls">
  <label>starting value: <input type="range" id="starting" min="0" max="200" value="0"></label>
  <label>differential: <input type="range" id="differential" min="0" max="200" value="200"></label>
  <label>speed: <input type="range" id="speed" min="0.0005" max="0.05" step="0.005" value="0.005"></label>
</div>`;
const SINE_CURVE_JS = `${SineCurve.toString()}

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
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let cx = canvas.width / 2, cy = canvas.height / 2;

  // Green axes
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(canvas.width, cy);
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, canvas.height);
  ctx.stroke();

  // Green circle
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, 200, 0, Math.PI * 2);
  ctx.stroke();

  // Small green circle oscillating on y-axis
  let value = SineCurve(startValue, differential, speed);
  let oscY = cy + value - 100;
  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.arc(cx, oscY, 20, 0, Math.PI * 2);
  ctx.fill();

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
const DEMYSTIFY_SINE_COSINE_JS = `${SineCurve.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let cy = canvas.height / 2;
  let x1 = canvas.width / 3;    // 33% axis
  let x2 = canvas.width * 2 / 3; // 66% axis
  let centerX = canvas.width / 2; // horizontal axis
  const RADIUS = 100;

  // Draw axes (green)
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(canvas.width, cy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x1, 0);
  ctx.lineTo(x1, canvas.height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x2, 0);
  ctx.lineTo(x2, canvas.height);
  ctx.stroke();

  // Draw circles
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x1, cy, RADIUS, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x2, cy, RADIUS, 0, Math.PI * 2);
  ctx.stroke();

  // Spin points on circles
  let t = Date.now() * 0.001;
  let cos1 = Math.cos(t);
  let sin1 = Math.sin(t);
  let pt1x = x1 + cos1 * RADIUS;
  let pt1y = cy + sin1 * RADIUS;

  let cos2 = Math.cos(t);
  let sin2 = Math.sin(t);
  let pt2x = x2 + cos2 * RADIUS;
  let pt2y = cy + sin2 * RADIUS;

  // First circle: red sine line, green cosine line
  ctx.strokeStyle = '#ef4444'; // red for sine
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pt1x, pt1y);
  ctx.lineTo(pt1x, cy);
  ctx.stroke();

  ctx.strokeStyle = '#34d399'; // green for cosine
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pt1x, pt1y);
  ctx.lineTo(x1, pt1y);
  ctx.stroke();

  // Unit lines at origin
  ctx.strokeStyle = '#34d399'; // green
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, cy);
  ctx.lineTo(x1 + RADIUS, cy);
  ctx.stroke();

  ctx.strokeStyle = '#ef4444'; // red
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, cy);
  ctx.lineTo(x1, cy - RADIUS);
  ctx.stroke();

  // Spinning points
  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.arc(pt1x, pt1y, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.arc(pt2x, pt2y, 5, 0, Math.PI * 2);
  ctx.fill();

  requestAnimationFrame(draw);
}

draw();`;

// ─────────────────────────────────────────────────────────────────────────────
// COLLISION DETECTION (10 pens)
// ─────────────────────────────────────────────────────────────────────────────

const POINT_CIRCLE_HTML = `<canvas id="canvas"></canvas>`;
const POINT_CIRCLE_JS = `// ─── the core algorithm ─────────────────────────────────────────────────────
${pointToCircle.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function drawCollisionText(x) {
  ctx.font = "bold 24px 'Courier New',monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,0,100,0.55)"; ctx.fillText("[ COLLISION DETECTED ]", x+3, 43);
  ctx.fillStyle = "rgba(0,255,255,0.55)";  ctx.fillText("[ COLLISION DETECTED ]", x-3, 37);
  ctx.fillStyle = "#e0f7ff";               ctx.fillText("[ COLLISION DETECTED ]", x,   40);
  ctx.textAlign = "left";
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let cx = canvas.width / 2, cy = canvas.height / 2;
  let px = cx + Math.sin(Date.now() * 0.001) * 150;
  let py = cy + Math.sin(Date.now() * 0.0008) * 150;

  let hit = pointToCircle(px, py, cx, cy, 100);

  ctx.fillStyle = hit ? '#ef4444' : 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.arc(cx, cy, 100, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.arc(px, py, 5, 0, Math.PI * 2);
  ctx.fill();

  if (hit) drawCollisionText(cx);

  requestAnimationFrame(draw);
}

draw();`;

const POINT_RECT_HTML = `<canvas id="canvas"></canvas>`;
const POINT_RECT_JS = `// ─── ray-casting point-in-polygon test ────────────────────────────────────
function polyContainsPoint(pts, px, py) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i].x, yi = pts[i].y;
    const xj = pts[j].x, yj = pts[j].y;
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}

function buildRect(cx, cy, hw, hh, angle) {
  const cos = Math.cos(angle), sin = Math.sin(angle);
  return [
    { x: cx + (-hw) * cos - (-hh) * sin, y: cy + (-hw) * sin + (-hh) * cos },
    { x: cx +   hw  * cos - (-hh) * sin, y: cy +   hw  * sin + (-hh) * cos },
    { x: cx +   hw  * cos -   hh  * sin, y: cy +   hw  * sin +   hh  * cos },
    { x: cx + (-hw) * cos -   hh  * sin, y: cy + (-hw) * sin +   hh  * cos },
  ];
}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function drawCollisionText(x) {
  ctx.font = "bold 24px 'Courier New',monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,0,100,0.55)"; ctx.fillText("[ COLLISION DETECTED ]", x+3, 43);
  ctx.fillStyle = "rgba(0,255,255,0.55)";  ctx.fillText("[ COLLISION DETECTED ]", x-3, 37);
  ctx.fillStyle = "#e0f7ff";               ctx.fillText("[ COLLISION DETECTED ]", x,   40);
  ctx.textAlign = "left";
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let cx = canvas.width / 2, cy = canvas.height / 2;
  let angle = Date.now() * 0.001;
  let rect = buildRect(cx, cy, 50, 50, angle);

  let px = cx + Math.sin(Date.now() * 0.001) * 200;
  let py = cy + Math.sin(Date.now() * 0.0008) * 150;

  let hit = polyContainsPoint(rect, px, py);

  ctx.fillStyle = hit ? '#ef4444' : 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.moveTo(rect[0].x, rect[0].y);
  for (let i = 1; i < rect.length; i++) {
    ctx.lineTo(rect[i].x, rect[i].y);
  }
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.arc(px, py, 5, 0, Math.PI * 2);
  ctx.fill();

  if (hit) drawCollisionText(cx);

  requestAnimationFrame(draw);
}

draw();`;

const CIRCLE_CIRCLE_HTML = `<canvas id="canvas"></canvas>`;
const CIRCLE_CIRCLE_JS = `// ─── the core algorithm ─────────────────────────────────────────────────────
${circleToCircle.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function drawCollisionText(x) {
  ctx.font = "bold 24px 'Courier New',monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,0,100,0.55)"; ctx.fillText("[ COLLISION DETECTED ]", x+3, 43);
  ctx.fillStyle = "rgba(0,255,255,0.55)";  ctx.fillText("[ COLLISION DETECTED ]", x-3, 37);
  ctx.fillStyle = "#e0f7ff";               ctx.fillText("[ COLLISION DETECTED ]", x,   40);
  ctx.textAlign = "left";
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let cx = canvas.width / 2, cy = canvas.height / 2;
  let c1x = cx, c1y = cy, c1r = 100;
  let c2x = cx + Math.sin(Date.now() * 0.001) * 200;
  let c2y = cy + Math.sin(Date.now() * 0.0008) * 150;
  let c2r = 100;

  let hit = circleToCircle(c1x, c1y, c1r, c2x, c2y, c2r);

  ctx.fillStyle = hit ? '#22d3ee' : 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.arc(c1x, c1y, c1r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = hit ? '#ef4444' : 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.arc(c2x, c2y, c2r, 0, Math.PI * 2);
  ctx.fill();

  if (hit) drawCollisionText(cx);

  requestAnimationFrame(draw);
}

draw();`;

const CIRCLE_RECT_HTML = `<canvas id="canvas"></canvas>`;
const CIRCLE_RECT_JS = `// ─── polygon-circle overlap test ───────────────────────────────────────────
function polyContainsPoint(pts, px, py) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i].x, yi = pts[i].y;
    const xj = pts[j].x, yj = pts[j].y;
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}

function buildRect(cx, cy, hw, hh, angle) {
  const cos = Math.cos(angle), sin = Math.sin(angle);
  return [
    { x: cx + (-hw) * cos - (-hh) * sin, y: cy + (-hw) * sin + (-hh) * cos },
    { x: cx +   hw  * cos - (-hh) * sin, y: cy +   hw  * sin + (-hh) * cos },
    { x: cx +   hw  * cos -   hh  * sin, y: cy +   hw  * sin +   hh  * cos },
    { x: cx + (-hw) * cos -   hh  * sin, y: cy + (-hw) * sin +   hh  * cos },
  ];
}

function circleOverlapsPoly(cx, cy, cr, pts) {
  if (polyContainsPoint(pts, cx, cy)) return true;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const x0 = pts[j].x, y0 = pts[j].y;
    const x1 = pts[i].x, y1 = pts[i].y;
    const dx = x1 - x0, dy = y1 - y0;
    const t = Math.max(0, Math.min(1, ((cx - x0) * dx + (cy - y0) * dy) / (dx * dx + dy * dy)));
    const px = x0 + t * dx, py = y0 + t * dy;
    const dist = Math.sqrt((cx - px) * (cx - px) + (cy - py) * (cy - py));
    if (dist < cr) return true;
  }
  return false;
}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function drawCollisionText(x) {
  ctx.font = "bold 24px 'Courier New',monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,0,100,0.55)"; ctx.fillText("[ COLLISION DETECTED ]", x+3, 43);
  ctx.fillStyle = "rgba(0,255,255,0.55)";  ctx.fillText("[ COLLISION DETECTED ]", x-3, 37);
  ctx.fillStyle = "#e0f7ff";               ctx.fillText("[ COLLISION DETECTED ]", x,   40);
  ctx.textAlign = "left";
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let centerX = canvas.width / 2, centerY = canvas.height / 2;
  let angle = Date.now() * 0.001;
  let rect = buildRect(centerX + Math.sin(Date.now() * 0.0005) * 100, centerY, 50, 50, angle);

  let cx = centerX, cy = centerY, cr = 100;

  let hit = circleOverlapsPoly(cx, cy, cr, rect);

  ctx.fillStyle = hit ? '#22d3ee' : 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.arc(cx, cy, cr, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = hit ? '#ef4444' : 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.moveTo(rect[0].x, rect[0].y);
  for (let i = 1; i < rect.length; i++) {
    ctx.lineTo(rect[i].x, rect[i].y);
  }
  ctx.closePath();
  ctx.fill();

  if (hit) drawCollisionText(centerX);

  requestAnimationFrame(draw);
}

draw();`;

const LINE_CIRCLE_HTML = `<canvas id="canvas"></canvas>`;
const LINE_CIRCLE_JS = `// ─── the core algorithm ─────────────────────────────────────────────────────
${lineToCircle.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function drawCollisionText(x) {
  ctx.font = "bold 24px 'Courier New',monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,0,100,0.55)"; ctx.fillText("[ COLLISION DETECTED ]", x+3, 43);
  ctx.fillStyle = "rgba(0,255,255,0.55)";  ctx.fillText("[ COLLISION DETECTED ]", x-3, 37);
  ctx.fillStyle = "#e0f7ff";               ctx.fillText("[ COLLISION DETECTED ]", x,   40);
  ctx.textAlign = "left";
}

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

  // Draw static circle
  ctx.fillStyle = hit ? '#22d3ee' : 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.arc(cx, cy, cr, 0, Math.PI * 2);
  ctx.fill();

  // Draw moving line
  ctx.strokeStyle = hit ? '#ef4444' : 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  if (hit) drawCollisionText(canvas.width / 2);

  requestAnimationFrame(draw);
}

draw();`;

const LINE_LINE_HTML = `<canvas id="canvas"></canvas>`;
const LINE_LINE_JS = `// ─── the core algorithm ─────────────────────────────────────────────────────
${lineToLine.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function drawCollisionText(x) {
  ctx.font = "bold 24px 'Courier New',monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,0,100,0.55)"; ctx.fillText("[ COLLISION DETECTED ]", x+3, 43);
  ctx.fillStyle = "rgba(0,255,255,0.55)";  ctx.fillText("[ COLLISION DETECTED ]", x-3, 37);
  ctx.fillStyle = "#e0f7ff";               ctx.fillText("[ COLLISION DETECTED ]", x,   40);
  ctx.textAlign = "left";
}

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

  // Draw static line (cyan when hit)
  ctx.strokeStyle = hit ? '#22d3ee' : 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Draw moving line (red when hit)
  ctx.strokeStyle = hit ? '#ef4444' : 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x3a, y3a);
  ctx.lineTo(x3b, y3b);
  ctx.stroke();

  if (hit) drawCollisionText(canvas.width / 2);

  requestAnimationFrame(draw);
}

draw();`;

const LINE_POINT_HTML = `<canvas id="canvas"></canvas>`;
const LINE_POINT_JS = `// ─── the core algorithm ─────────────────────────────────────────────────────
${lineToPoint.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function drawCollisionText(x) {
  ctx.font = "bold 24px 'Courier New',monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,0,100,0.55)"; ctx.fillText("[ COLLISION DETECTED ]", x+3, 43);
  ctx.fillStyle = "rgba(0,255,255,0.55)";  ctx.fillText("[ COLLISION DETECTED ]", x-3, 37);
  ctx.fillStyle = "#e0f7ff";               ctx.fillText("[ COLLISION DETECTED ]", x,   40);
  ctx.textAlign = "left";
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let centerX = canvas.width / 2, centerY = canvas.height / 2;
  let x1 = centerX - 150, y1 = centerY;
  let x2 = centerX + 150, y2 = centerY;
  let px = centerX + Math.sin(Date.now() * 0.001) * 150;
  let py = centerY + Math.sin(Date.now() * 0.0008) * 150;

  let hit = lineToPoint(x1, y1, x2, y2, px, py, 20);

  // Line changes color on hit
  ctx.strokeStyle = hit ? '#ef4444' : 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Dot is always orange, never changes color
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.arc(px, py, 5, 0, Math.PI * 2);
  ctx.fill();

  if (hit) drawCollisionText(canvas.width / 2);

  requestAnimationFrame(draw);
}

draw();`;

const LINE_RECT_HTML = `<canvas id="canvas"></canvas>`;
const LINE_RECT_JS = `// ─── the core algorithm ─────────────────────────────────────────────────────
${lineToRect.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function drawCollisionText(x) {
  ctx.font = "bold 24px 'Courier New',monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,0,100,0.55)"; ctx.fillText("[ COLLISION DETECTED ]", x+3, 43);
  ctx.fillStyle = "rgba(0,255,255,0.55)";  ctx.fillText("[ COLLISION DETECTED ]", x-3, 37);
  ctx.fillStyle = "#e0f7ff";               ctx.fillText("[ COLLISION DETECTED ]", x,   40);
  ctx.textAlign = "left";
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let centerX = canvas.width / 2, centerY = canvas.height / 2;

  // Static rect at center
  let rx = centerX - 50, ry = centerY - 50;
  let rw = 100, rh = 100;

  // Moving and rotating line
  let angle = Date.now() * 0.003;
  let x1 = centerX + Math.sin(Date.now() * 0.0005) * 150;
  let y1 = centerY;
  const lineLen = 100;
  let x2 = x1 + Math.cos(angle) * lineLen;
  let y2 = y1 + Math.sin(angle) * lineLen;
  let x3 = x1 - Math.cos(angle) * lineLen;
  let y3 = y1 - Math.sin(angle) * lineLen;

  let hit = lineToRect(x2, y2, x3, y3, rx, ry, rw, rh);

  // Rect doesn't change color
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillRect(rx, ry, rw, rh);

  // Line doesn't change color either
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.stroke();

  if (hit) drawCollisionText(canvas.width / 2);

  requestAnimationFrame(draw);
}

draw();`;

const RECT_RECT_HTML = `<canvas id="canvas"></canvas>`;
const RECT_RECT_JS = `// ─── polygon-polygon SAT test ──────────────────────────────────────────────
function polyContainsPoint(pts, px, py) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i].x, yi = pts[i].y;
    const xj = pts[j].x, yj = pts[j].y;
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}

function buildRect(cx, cy, hw, hh, angle) {
  const cos = Math.cos(angle), sin = Math.sin(angle);
  return [
    { x: cx + (-hw) * cos - (-hh) * sin, y: cy + (-hw) * sin + (-hh) * cos },
    { x: cx +   hw  * cos - (-hh) * sin, y: cy +   hw  * sin + (-hh) * cos },
    { x: cx +   hw  * cos -   hh  * sin, y: cy +   hw  * sin +   hh  * cos },
    { x: cx + (-hw) * cos -   hh  * sin, y: cy + (-hw) * sin +   hh  * cos },
  ];
}

function polyPolyOverlap(p1, p2) {
  for (let i = 0; i < p1.length; i++) if (polyContainsPoint(p2, p1[i].x, p1[i].y)) return true;
  for (let i = 0; i < p2.length; i++) if (polyContainsPoint(p1, p2[i].x, p2[i].y)) return true;
  return false;
}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function drawCollisionText(x) {
  ctx.font = "bold 24px 'Courier New',monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,0,100,0.55)"; ctx.fillText("[ COLLISION DETECTED ]", x+3, 43);
  ctx.fillStyle = "rgba(0,255,255,0.55)";  ctx.fillText("[ COLLISION DETECTED ]", x-3, 37);
  ctx.fillStyle = "#e0f7ff";               ctx.fillText("[ COLLISION DETECTED ]", x,   40);
  ctx.textAlign = "left";
}

function drawPoly(pts, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x, pts[i].y);
  }
  ctx.closePath();
  ctx.fill();
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let cx = canvas.width / 2, cy = canvas.height / 2;

  // Rect1: moving and rotating
  let rect1x = cx + Math.sin(Date.now() * 0.0005) * 150;
  let rect1y = cy;
  let angle1 = Date.now() * 0.001;
  let rect1 = buildRect(rect1x, rect1y, 50, 50, angle1);

  // Rect2: at center, rotating
  let angle2 = Date.now() * 0.0008;
  let rect2 = buildRect(cx, cy, 50, 50, angle2);

  let hit = polyPolyOverlap(rect1, rect2);

  drawPoly(rect1, hit ? '#ef4444' : 'rgba(255,255,255,0.85)');
  drawPoly(rect2, hit ? '#22d3ee' : 'rgba(255,255,255,0.85)');

  if (hit) drawCollisionText(cx);

  requestAnimationFrame(draw);
}

draw();`;

const POLYGON_POLYGON_HTML = `<canvas id="canvas"></canvas>`;
const POLYGON_POLYGON_JS = `// ─── the core algorithm ─────────────────────────────────────────────────────
${polygonToPolygon.toString()}

// ─── buildStar helper ──────────────────────────────────────────────────────
function buildStar(cx, cy, spikes, outer, inner, angleOffset) {
  const pts = [];
  const step = Math.PI / spikes;
  for (let i = 0; i < 2 * spikes; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = i * step + (angleOffset || 0);
    pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  }
  return pts;
}

// ─── polyContainsPoint helper ──────────────────────────────────────────────
function polyContainsPoint(pts, px, py) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i].x, yi = pts[i].y;
    const xj = pts[j].x, yj = pts[j].y;
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}

function polyPolyOverlap(p1, p2) {
  for (let i = 0; i < p1.length; i++) if (polyContainsPoint(p2, p1[i].x, p1[i].y)) return true;
  for (let i = 0; i < p2.length; i++) if (polyContainsPoint(p1, p2[i].x, p2[i].y)) return true;
  return false;
}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function drawCollisionText(x) {
  ctx.font = "bold 24px 'Courier New',monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,0,100,0.55)"; ctx.fillText("[ COLLISION DETECTED ]", x+3, 43);
  ctx.fillStyle = "rgba(0,255,255,0.55)";  ctx.fillText("[ COLLISION DETECTED ]", x-3, 37);
  ctx.fillStyle = "#e0f7ff";               ctx.fillText("[ COLLISION DETECTED ]", x,   40);
  ctx.textAlign = "left";
}

function drawPoly(points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fill();
}

function draw() {
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let cx = canvas.width / 2, cy = canvas.height / 2;
  let t = Date.now() * 0.001;

  // Large 9-spike star at center (yellow/cyan)
  let star1 = buildStar(cx, cy, 9, 150, 25, 0);

  // Small 5-spike star moving (orange/red)
  let star2x = cx + Math.sin(t * 0.8) * 200;
  let star2y = cy + Math.cos(t * 0.6) * 150;
  let star2 = buildStar(star2x, star2y, 5, 50, 15, t);

  let hit = polyPolyOverlap(star1, star2);

  drawPoly(star1, hit ? '#22d3ee' : '#facc15');
  drawPoly(star2, hit ? '#ef4444' : '#fb923c');

  if (hit) drawCollisionText(cx);

  requestAnimationFrame(draw);
}

draw();`;

export const EXAMPLE_PENS: ExamplePen[] = [
  {
    group: "Animations",
    key: "ball-bounce",
    label: "Ball Bounce",
    blurb:
      "A ball falls with gravity, bounces off walls and floor, losing energy on each impact.",
    payload: {
      title: "Ball Bounce",
      description:
        "A ball falls with gravity and bounces off walls with realistic energy loss.",
      html: BALL_BOUNCE_HTML,
      css: FULLSCREEN_CSS,
      js: BALL_BOUNCE_JS,
      editors: "001",
    },
  },
  {
    group: "Animations",
    key: "balls-bouncing",
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
    key: "orbital-motion",
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
    key: "lerp",
    label: "Lerp (Smooth Follow)",
    blurb:
      "Linear interpolation: smoothly follow a target by always moving a fraction of the way there.",
    payload: {
      title: "Lerp — Linear Interpolation",
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
    key: "easing",
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
    key: "quadratic-bezier",
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
    key: "find-points-on-circle",
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
    key: "move-to-destination",
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
    key: "point-towards",
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
    key: "demystify-sine-cosine",
    label: "Demystify Sine & Cosine",
    blurb:
      "See sine and cosine visually: a point moves on a circle, and its x/y coordinates trace the curves.",
    payload: {
      title: "Demystify Sine & Cosine",
      description:
        "Visualize how sine and cosine come from a point moving on a circle.",
      html: DEMYSTIFY_SINE_COSINE_HTML,
      css: FULLSCREEN_CSS,
      js: DEMYSTIFY_SINE_COSINE_JS,
      editors: "001",
    },
  },
  {
    group: "Collision Detection",
    key: "point-to-circle",
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
    key: "point-to-rect",
    label: "Point to Rectangle",
    blurb: "Detect when a moving point enters an axis-aligned rectangle.",
    payload: {
      title: "Point to Rectangle",
      description:
        "Axis-aligned rectangle collision: px in [rx, rx+w] and py in [ry, ry+h].",
      html: POINT_RECT_HTML,
      css: FULLSCREEN_CSS,
      js: POINT_RECT_JS,
      editors: "001",
    },
  },
  {
    group: "Collision Detection",
    key: "circle-to-circle",
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
    key: "circle-to-rect",
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
    key: "line-to-circle",
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
    key: "line-to-line",
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
    key: "line-to-point",
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
    key: "line-to-rect",
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
    key: "rect-to-rect",
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
    key: "polygon-to-polygon",
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
    key: "get-point-on-line",
    label: "Get a Point on a Line",
    blurb: "Find a point at a given percentage along a line segment.",
    payload: {
      title: "Get Point on Line",
      description:
        "Linearly interpolate between two points: p = p1 + t*(p2-p1).",
      html: `<canvas id="canvas"></canvas><div id="controls"><label>t: <input type="range" id="t" min="0" max="100" step="1" value="50"></label></div>`,
      css: FULLSCREEN_CSS,
      js: `// ─── the core algorithm ─────────────────────────────────────────────────────
${getPointOnLine.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let t = 0.5;

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let p1 = {x: canvas.width * 0.2, y: canvas.height * 0.5};
  let p2 = {x: canvas.width * 0.8, y: canvas.height * 0.5};

  ctx.strokeStyle = 'rgba(150, 180, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();

  let pt = getPointOnLine(p1, p2, t);

  ctx.fillStyle = '#c7d2fe';
  ctx.beginPath();
  ctx.arc(p1.x, p1.y, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.arc(p2.x, p2.y, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#818cf8';
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '12px monospace';
  ctx.fillStyle = '#d8e2ff';
  ctx.textAlign = 'left';
  ctx.fillText('t: ' + t.toFixed(2), 20, 30);

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
    key: "triangle-data",
    label: "Triangle Data from Line",
    blurb:
      "Create a right triangle from a line segment by finding the perpendicular point.",
    payload: {
      title: "Triangle Data from Line",
      description:
        "Given a line, construct a right triangle showing rise/run components.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `// ─── the core algorithm ─────────────────────────────────────────────────────
${getTriangleData.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let p1 = {x: canvas.width * 0.2, y: canvas.height * 0.7};
  let p2 = {x: canvas.width * 0.8, y: canvas.height * 0.3};
  let tri = getTriangleData(p1, p2);

  ctx.strokeStyle = '#818cf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();

  ctx.strokeStyle = '#a78bfa';
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p1.y);
  ctx.stroke();

  ctx.strokeStyle = '#c4b5fd';
  ctx.beginPath();
  ctx.moveTo(p2.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();

  ctx.fillStyle = '#818cf8';
  ctx.beginPath();
  ctx.arc(p1.x, p1.y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.arc(p2.x, p2.y, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '12px monospace';
  ctx.fillStyle = '#d8e2ff';
  ctx.textAlign = 'left';
  ctx.fillText('dx: ' + tri.dx.toFixed(0), 20, 30);
  ctx.fillText('dy: ' + tri.dy.toFixed(0), 20, 50);
  ctx.fillText('distance: ' + tri.distance.toFixed(0), 20, 70);

  requestAnimationFrame(draw);
}

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
${DrawStar.toString()}

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

  let star = DrawStar(numPoints, 40, 100, 0);
  ctx.beginPath();
  ctx.moveTo(star.vertices[0].x, star.vertices[0].y);
  for (let i = 1; i < star.vertices.length; i++) {
    ctx.lineTo(star.vertices[i].x, star.vertices[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = '#818cf8';
  ctx.fill();
  ctx.strokeStyle = 'rgba(150, 180, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();

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
${CreateRect.toString()}

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

  let rect = CreateRect(200, 100, angle);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  ctx.moveTo(rect.vertices[0].x, rect.vertices[0].y);
  for (let i = 1; i < rect.vertices.length; i++) {
    ctx.lineTo(rect.vertices[i].x, rect.vertices[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = '#818cf8';
  ctx.fill();
  ctx.strokeStyle = 'rgba(150, 180, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

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
    key: "equilateral-triangle",
    label: "Equilateral Triangle",
    blurb:
      "Draw an equilateral triangle by placing vertices at 120° intervals.",
    payload: {
      title: "Equilateral Triangle",
      description: "Three vertices at 120° intervals from the top.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `// ─── the core algorithm ─────────────────────────────────────────────────────
${drawEquilateralTriangle.toString()}

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
  let t = Date.now() * 0.001;
  let r = 80 + Math.sin(t) * 20;

  drawEquilateralTriangle(cx, cy, r);
  ctx.fillStyle = '#818cf8';
  ctx.fill();
  ctx.strokeStyle = 'rgba(150, 180, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();

  requestAnimationFrame(draw);
}

draw();`,
      editors: "001",
    },
  },
  {
    group: "Useful Little Things",
    key: "circle-from-three",
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
${CircleFromThreePoints.toString()}

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
let result = null;
let drawingCircle = false;
let interval = null;

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Show instruction
  if (points.length === 0) {
    infoDiv.innerHTML = '<h3>Click screen three times to make three points.</h3>';
  } else {
    infoDiv.innerHTML = '<p>Points clicked: ' + points.length + ' / 3</p>';
  }

  // Draw the input points
  points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Draw the progressively-rendered circle if we have 3 points
  if (result && points.length === 3) {
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(result.center.x, result.center.y, result.radius, 0, circleQ);
    ctx.stroke();

    // Draw center point
    ctx.fillStyle = '#a78bfa';
    ctx.beginPath();
    ctx.arc(result.center.x, result.center.y, 4, 0, 2 * Math.PI);
    ctx.fill();

    // Display radius and center data
    infoDiv.innerHTML += '<p>radius: ' + Math.floor(result.radius) + ', center: { x: ' + Math.floor(result.center.x) + ', y: ' + Math.floor(result.center.y) + ' }</p>';
  }

  requestAnimationFrame(draw);
}

function drawCircle() {
  let degree = 1 * (Math.PI / 180);
  circleQ += degree;
  if (circleQ < Math.PI * 2) {
    interval = setTimeout(drawCircle, 10);
  }
}

function pointerDownHandler(e) {
  let { top, left } = canvas.getBoundingClientRect();

  if (points.length === 3) {
    points = [];
    circleQ = 0;
    result = null;
    drawingCircle = false;
    if (interval) clearTimeout(interval);
  }

  points.push({
    x: Math.floor(e.pageX - left),
    y: Math.floor(e.pageY - top)
  });

  if (points.length === 3 && !drawingCircle) {
    result = CircleFromThreePoints(points[0], points[1], points[2]);
    drawingCircle = true;
    circleQ = 0;
    drawCircle();
  }
}

canvas.addEventListener('pointerdown', pointerDownHandler);
draw();`,
      editors: "001",
    },
  },
  {
    group: "Useful Little Things",
    key: "distribute-around",
    label: "Distribute Points Around Circle",
    blurb:
      "Evenly distribute points around a circle using uniform angle intervals.",
    payload: {
      title: "Distribute Points Around Circle",
      description: "Place n points at uniform angular intervals on a circle.",
      html: `<canvas id="canvas"></canvas><div id="controls"><label>points: <input type="range" id="points" min="3" max="100" step="5" value="20"></label></div>`,
      css: FULLSCREEN_CSS,
      js: `// ─── the core algorithm ─────────────────────────────────────────────────────
// Return n points evenly distributed on a circle
function distributeAroundCircle(center, radius, numPoints) {
  let points = [];
  for (let i = 0; i < numPoints; i++) {
    let angle = (i / numPoints) * Math.PI * 2;
    points.push({x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle)});
  }
  return points;
}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let totalItems = 20;

// Cosine wave for animating radius
function cosWave(startValue, differential, speed) {
  const currentDate = new Date();
  return startValue + Math.cos(currentDate.getTime() * speed) * differential;
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let halfWidth = canvas.width / 2;
  let halfHeight = canvas.height / 2;

  // Animate the radius using cosine wave
  let radius = cosWave(100, 100, 0.001);

  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(halfWidth, 0);
  ctx.lineTo(halfWidth, canvas.height);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(halfWidth, halfHeight, radius, 0, 2 * Math.PI);
  ctx.stroke();

  let points = distributeAroundCircle(
    { x: halfWidth, y: halfHeight },
    radius,
    totalItems
  );

  points.forEach((point) => {
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(halfWidth, halfHeight);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  });

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
    key: "distance-between",
    label: "Distance Between Two Points",
    blurb:
      "Calculate the straight-line distance between two points using the Pythagorean theorem.",
    payload: {
      title: "Distance Between Two Points",
      description: "distance = sqrt((x2-x1)² + (y2-y1)²)",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `// ─── the core algorithm ─────────────────────────────────────────────────────
${distance.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let t = Date.now() * 0.001;
  let p1 = {x: canvas.width * 0.3, y: canvas.height / 2};
  let p2 = {x: canvas.width * 0.7 + Math.sin(t) * 100, y: canvas.height / 2 + Math.cos(t) * 80};

  let dist = distance(p1, p2);

  ctx.strokeStyle = 'rgba(150, 180, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();

  ctx.fillStyle = '#818cf8';
  ctx.beginPath();
  ctx.arc(p1.x, p1.y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.arc(p2.x, p2.y, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = '#d8e2ff';
  ctx.textAlign = 'center';
  ctx.fillText('distance: ' + dist.toFixed(0), canvas.width / 2, 40);

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
      js: `// ─── the core algorithm ─────────────────────────────────────────────────────
${bezierPoint.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let t = Date.now() * 0.001;
  let p0 = {x: canvas.width * 0.1, y: canvas.height * 0.5};
  let p1 = {x: canvas.width * 0.3, y: canvas.height * 0.2 + Math.sin(t) * 50};
  let p2 = {x: canvas.width * 0.7, y: canvas.height * 0.8 + Math.cos(t) * 50};
  let p3 = {x: canvas.width * 0.9, y: canvas.height * 0.5};

  ctx.strokeStyle = 'rgba(150, 180, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.lineTo(p3.x, p3.y);
  ctx.stroke();

  ctx.strokeStyle = '#818cf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 1; i += 0.01) {
    let pt = bezierPoint(p0, p1, p2, p3, i);
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  }
  ctx.stroke();

  ctx.fillStyle = '#c7d2fe';
  ctx.beginPath();
  ctx.arc(p0.x, p0.y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.arc(p3.x, p3.y, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#a78bfa';
  ctx.beginPath();
  ctx.arc(p1.x, p1.y, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.arc(p2.x, p2.y, 5, 0, Math.PI * 2);
  ctx.fill();

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

function squarePoints() {
  let pts = [];
  for (let i = 0; i < 50; i++) {
    let t = i / 50;
    let x, y;
    if (t < 0.25) { x = t*4; y = -1; }
    else if (t < 0.5) { x = 1; y = (t-0.25)*4-1; }
    else if (t < 0.75) { x = 1-(t-0.5)*4; y = 1; }
    else { x = -1; y = 1-(t-0.75)*4; }
    pts.push({x: x*50, y: y*50});
  }
  return pts;
}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let epicycles = dft(squarePoints()).slice(0, 15);
let trail = [];

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let time = Date.now() * 0.001;
  let x = canvas.width / 2, y = canvas.height / 2;

  for (let epi of epicycles) {
    let prevX = x, prevY = y;
    let angle = time * epi.freq + epi.phase;
    x += epi.amp * Math.cos(angle);
    y += epi.amp * Math.sin(angle);

    ctx.strokeStyle = 'rgba(150, 180, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(prevX, prevY, epi.amp, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(150, 180, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  trail.push({x, y});
  if (trail.length > 500) trail.shift();

  ctx.strokeStyle = '#818cf8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < trail.length; i++) {
    if (i === 0) ctx.moveTo(trail[i].x, trail[i].y);
    else ctx.lineTo(trail[i].x, trail[i].y);
  }
  ctx.stroke();

  ctx.fillStyle = '#a78bfa';
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();

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
      js: `// ─── the core algorithm ─────────────────────────────────────────────────────
${step.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
const cellSize = 8;
let cols = Math.floor(canvas.width / cellSize);
let rows = Math.floor(canvas.height / cellSize);
let grid = new Uint8Array(cols * rows);
let paused = false;

function randomizeGrid() {
  for (let i = 0; i < grid.length; i++) {
    grid[i] = Math.random() > 0.7 ? 1 : 0;
  }
}

function draw() {
  if (!paused) grid = step(grid, cols, rows);

  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#818cf8';
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y * cols + x]) {
        ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
      }
    }
  }

  requestAnimationFrame(draw);
}

document.getElementById('reset').addEventListener('click', randomizeGrid);
document.getElementById('toggle').addEventListener('click', () => { paused = !paused; });

randomizeGrid();
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
      js: `// ─── the core algorithm ─────────────────────────────────────────────────────
${waveAmplitude.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const off = document.createElement('canvas');
const offCtx = off.getContext('2d');
function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  off.width = Math.ceil(canvas.width / 2);
  off.height = Math.ceil(canvas.height / 2);
}
window.addEventListener('resize', resize);
resize();

function draw() {
  let time = Date.now() * 0.001;
  let sources = [
    {x: canvas.width * 0.2, y: canvas.height * 0.3},
    {x: canvas.width * 0.8, y: canvas.height * 0.3},
    {x: canvas.width * 0.5, y: canvas.height * 0.8},
  ];
  let idata = offCtx.createImageData(off.width, off.height);
  let data = idata.data;

  for (let i = 0; i < data.length; i += 4) {
    let px = (i / 4) % off.width;
    let py = Math.floor((i / 4) / off.width);
    let amp = waveAmplitude(px * 2, py * 2, sources, time, 0.02, 3);
    let val = Math.floor(127.5 + amp * 127.5);
    data[i] = val;
    data[i+1] = val;
    data[i+2] = val;
    data[i+3] = 255;
  }

  offCtx.putImageData(idata, 0, 0);
  ctx.drawImage(off, 0, 0, canvas.width, canvas.height);

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
      js: `// ─── the core algorithm ─────────────────────────────────────────────────────
${lensDeflection.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let lx = canvas.width / 2, ly = canvas.height / 2;
  let mass = 50000;

  ctx.strokeStyle = 'rgba(150, 180, 255, 0.4)';
  ctx.lineWidth = 1;

  for (let y0 = canvas.height * 0.1; y0 < canvas.height * 0.9; y0 += 30) {
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 5) {
      let deflection = lensDeflection(x, y0, lx, ly, mass);
      let y = y0 + deflection;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  ctx.fillStyle = '#fcd34d';
  ctx.beginPath();
  ctx.arc(lx, ly, 30, 0, Math.PI * 2);
  ctx.fill();

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
      html: `<canvas id="canvas"></canvas><div id="controls"><label>GR strength: <input type="range" id="gr" min="0" max="0.0001" step="0.00001" value="0.00001"></label></div>`,
      css: FULLSCREEN_CSS,
      js: `// ─── the core algorithm ─────────────────────────────────────────────────────
${grStep.toString()}

// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

// ─── state ───────────────────────────────────────────────────────────────────
let orbiter = {x: 0, y: 0, vx: 0, vy: 0};
let sun = {x: canvas.width / 2, y: canvas.height / 2, mass: 100};
let grStrength = 0.00001;
let trail = [];

function init() {
  orbiter.x = sun.x + 150;
  orbiter.y = sun.y;
  orbiter.vx = 0;
  orbiter.vy = 5;
  trail = [];
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  grStep(orbiter, sun, grStrength);

  trail.push({x: orbiter.x, y: orbiter.y});
  if (trail.length > 1000) trail.shift();

  ctx.strokeStyle = 'rgba(150, 180, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < trail.length; i++) {
    if (i === 0) ctx.moveTo(trail[i].x, trail[i].y);
    else ctx.lineTo(trail[i].x, trail[i].y);
  }
  ctx.stroke();

  ctx.fillStyle = '#fcd34d';
  ctx.beginPath();
  ctx.arc(sun.x, sun.y, 20, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#818cf8';
  ctx.beginPath();
  ctx.arc(orbiter.x, orbiter.y, 8, 0, Math.PI * 2);
  ctx.fill();

  requestAnimationFrame(draw);
}

document.getElementById('gr').addEventListener('input', e => {
  grStrength = parseFloat(e.target.value);
});

init();
draw();`,
      editors: "001",
    },
  },
];
