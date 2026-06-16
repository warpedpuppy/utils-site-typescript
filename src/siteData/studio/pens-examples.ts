import { CodePenPayload } from "./codepen";

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
const BALL_BOUNCE_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

let ball = { x: 0, y: 0, radius: 18, vx: 5, vy: -10 };
const gravity = 0.4, restitution = 0.72, friction = 0.985;

function init() {
  ball.x = canvas.width * 0.25;
  ball.y = canvas.height * 0.25;
  ball.vx = 5;
  ball.vy = -10;
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ball.vy += gravity;
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.y >= canvas.height - ball.radius) {
    ball.y = canvas.height - ball.radius;
    ball.vy = -Math.abs(ball.vy) * restitution;
    ball.vx *= friction;
  }
  if (ball.y <= ball.radius) {
    ball.y = ball.radius;
    ball.vy = Math.abs(ball.vy);
  }
  if (ball.x >= canvas.width - ball.radius) {
    ball.x = canvas.width - ball.radius;
    ball.vx = -Math.abs(ball.vx) * restitution;
  }
  if (ball.x <= ball.radius) {
    ball.x = ball.radius;
    ball.vx = Math.abs(ball.vx) * restitution;
  }

  const maxDist = canvas.height - ball.radius;
  const distFrac = Math.max(0, 1 - (canvas.height - ball.radius - ball.y) / maxDist);
  const shadowAlpha = distFrac * 0.45;
  const shadowRx = ball.radius * (0.7 + distFrac * 0.8);
  const shadowRy = ball.radius * 0.22;

  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,' + shadowAlpha + ')';
  ctx.beginPath();
  ctx.ellipse(ball.x, canvas.height - 3, Math.max(shadowRx, 4), Math.max(shadowRy, 2), 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const gr = ctx.createRadialGradient(ball.x - ball.radius * 0.32, ball.y - ball.radius * 0.32, 0, ball.x, ball.y, ball.radius);
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
const BALLS_BOUNCING_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

let balls = [
  { x: 100, y: 100, radius: 12, vx: 3, vy: 2, color: '#818cf8' },
  { x: 300, y: 150, radius: 15, vx: -2, vy: 3, color: '#a78bfa' },
  { x: 200, y: 300, radius: 10, vx: 2.5, vy: -2.5, color: '#c4b5fd' }
];
const gravity = 0.3, friction = 0.99, spring = 0.05;

function update() {
  for (let ball of balls) {
    ball.vy += gravity;
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y >= canvas.height - ball.radius) {
      ball.y = canvas.height - ball.radius;
      ball.vy *= -0.75;
      ball.vx *= friction;
    }
    if (ball.y <= ball.radius) {
      ball.y = ball.radius;
      ball.vy *= -0.75;
    }
    if (ball.x >= canvas.width - ball.radius) {
      ball.x = canvas.width - ball.radius;
      ball.vx *= -0.75;
    }
    if (ball.x <= ball.radius) {
      ball.x = ball.radius;
      ball.vx *= -0.75;
    }
  }

  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      let b1 = balls[i], b2 = balls[j];
      let dx = b2.x - b1.x, dy = b2.y - b1.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < b1.radius + b2.radius) {
        let nx = dx / dist, ny = dy / dist;
        let overlap = b1.radius + b2.radius - dist;
        b1.x -= nx * overlap * 0.5;
        b1.y -= ny * overlap * 0.5;
        b2.x += nx * overlap * 0.5;
        b2.y += ny * overlap * 0.5;
        b1.vx -= nx * spring;
        b1.vy -= ny * spring;
        b2.vx += nx * spring;
        b2.vy += ny * spring;
      }
    }
  }
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  update();

  for (let ball of balls) {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

draw();`;

// ── Orbital Motion ───────────────────────────────────────────────────────────
const ORBITAL_MOTION_HTML = `<canvas id="canvas"></canvas>`;
const ORBITAL_MOTION_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

let orbiter = { x: 0, y: 0, vx: 0, vy: 0, mass: 1, color: '#818cf8' };
let sun = { x: 0, y: 0, mass: 100, radius: 20, color: '#fcd34d' };

function init() {
  sun.x = canvas.width / 2;
  sun.y = canvas.height / 2;
  orbiter.x = sun.x + 150;
  orbiter.y = sun.y;
  orbiter.vy = 5;
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let dx = sun.x - orbiter.x;
  let dy = sun.y - orbiter.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let force = (0.5 * sun.mass) / (dist * dist);
  orbiter.vx += (dx / dist) * force;
  orbiter.vy += (dy / dist) * force;

  orbiter.x += orbiter.vx;
  orbiter.y += orbiter.vy;

  ctx.fillStyle = sun.color;
  ctx.beginPath();
  ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = orbiter.color;
  ctx.beginPath();
  ctx.arc(orbiter.x, orbiter.y, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(150, 180, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(sun.x, sun.y, 150, 0, Math.PI * 2);
  ctx.stroke();

  requestAnimationFrame(draw);
}

init();
draw();`;

// ── Lerp ─────────────────────────────────────────────────────────────────────
const LERP_HTML = `<canvas id="canvas"></canvas>
<div id="controls">
  <label>speed <input type="range" id="speed" min="0.01" max="0.1" step="0.01" value="0.05"></label>
</div>`;
const LERP_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

let obj = { x: 0, y: 0 };
let target = { x: 0, y: 0 };
let speed = 0.05;

function init() {
  target.x = canvas.width / 2 + 100;
  target.y = canvas.height / 2;
  obj.x = 50;
  obj.y = canvas.height / 2;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  target.x = canvas.width / 2 + Math.sin(Date.now() * 0.0005) * 150;
  target.y = canvas.height / 2 + Math.cos(Date.now() * 0.0003) * 100;

  obj.x = lerp(obj.x, target.x, speed);
  obj.y = lerp(obj.y, target.y, speed);

  ctx.strokeStyle = 'rgba(150, 180, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(obj.x, obj.y);
  ctx.lineTo(target.x, target.y);
  ctx.stroke();

  ctx.fillStyle = '#a78bfa';
  ctx.beginPath();
  ctx.arc(target.x, target.y, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#818cf8';
  ctx.beginPath();
  ctx.arc(obj.x, obj.y, 10, 0, Math.PI * 2);
  ctx.fill();

  requestAnimationFrame(draw);
}

document.getElementById('speed').addEventListener('input', e => {
  speed = parseFloat(e.target.value);
});

init();
draw();`;

// ── Easing Functions ────────────────────────────────────────────────────────
const EASING_HTML = `<canvas id="canvas"></canvas>
<div id="controls">
  <button id="reset">Reset</button>
  <label>easing: <select id="easing">
    <option value="linear">Linear</option>
    <option value="easeIn">Ease In</option>
    <option value="easeOut">Ease Out</option>
    <option value="easeInOut">Ease InOut</option>
  </select></label>
</div>`;
const EASING_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

const easingFuncs = {
  linear: t => t,
  easeIn: t => t * t,
  easeOut: t => t * (2 - t),
  easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
};

let easingMode = 'easeInOut';
let startTime = Date.now();
const duration = 2000;

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let elapsed = (Date.now() - startTime) % (duration * 2);
  let t = (elapsed % duration) / duration;
  if (elapsed > duration) t = 1 - t;

  let easeFunc = easingFuncs[easingMode];
  let eased = easeFunc(t);

  let x = canvas.width * 0.1 + eased * (canvas.width * 0.8);
  let y = canvas.height * 0.5;

  ctx.strokeStyle = 'rgba(150, 180, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.1, y);
  ctx.lineTo(canvas.width * 0.9, y);
  ctx.stroke();

  ctx.fillStyle = '#818cf8';
  ctx.beginPath();
  ctx.arc(x, y, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '12px monospace';
  ctx.fillStyle = '#d8e2ff';
  ctx.textAlign = 'left';
  ctx.fillText('t: ' + t.toFixed(2), 20, 30);
  ctx.fillText('eased: ' + eased.toFixed(2), 20, 50);

  requestAnimationFrame(draw);
}

document.getElementById('easing').addEventListener('change', e => {
  easingMode = e.target.value;
});
document.getElementById('reset').addEventListener('click', () => {
  startTime = Date.now();
});

draw();`;

// ── Quadratic Bézier ────────────────────────────────────────────────────────
const QUADRATIC_BEZIER_HTML = `<canvas id="canvas"></canvas>
<div id="controls">
  <label>t: <input type="range" id="t" min="0" max="100" step="1" value="50"></label>
</div>`;
const QUADRATIC_BEZIER_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

let p0 = { x: canvas.width * 0.2, y: canvas.height * 0.7 };
let p1 = { x: canvas.width * 0.5, y: canvas.height * 0.2 };
let p2 = { x: canvas.width * 0.8, y: canvas.height * 0.7 };
let t = 0.5;

function quadBezier(p0, p1, p2, t) {
  let mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y
  };
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(150, 180, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(150, 180, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= 1; i += 0.01) {
    let pt = quadBezier(p0, p1, p2, i);
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  }
  ctx.stroke();

  let pt = quadBezier(p0, p1, p2, t);

  ctx.fillStyle = '#c7d2fe';
  ctx.beginPath();
  ctx.arc(p0.x, p0.y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.arc(p2.x, p2.y, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#a78bfa';
  ctx.beginPath();
  ctx.arc(p1.x, p1.y, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#818cf8';
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2);
  ctx.fill();

  requestAnimationFrame(draw);
}

document.getElementById('t').addEventListener('input', e => {
  t = parseInt(e.target.value) / 100;
});

draw();`;

// ── Find Points on a Circle ─────────────────────────────────────────────────
const FIND_POINTS_CIRCLE_HTML = `<canvas id="canvas"></canvas>
<div id="controls">
  <label>points: <input type="range" id="points" min="3" max="20" step="1" value="8"></label>
  <label>radius: <input type="range" id="radius" min="30" max="150" step="10" value="100"></label>
</div>`;
const FIND_POINTS_CIRCLE_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

let numPoints = 8;
let radius = 100;
let cx = canvas.width / 2;
let cy = canvas.height / 2;

function getPointsAroundCircle(cx, cy, r, n) {
  let points = [];
  for (let i = 0; i < n; i++) {
    let angle = (i / n) * Math.PI * 2;
    points.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      angle: angle
    });
  }
  return points;
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  cx = canvas.width / 2;
  cy = canvas.height / 2;

  ctx.strokeStyle = 'rgba(150, 180, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  let points = getPointsAroundCircle(cx, cy, radius, numPoints);

  ctx.fillStyle = '#a78bfa';
  for (let p of points) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#818cf8';
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();

  requestAnimationFrame(draw);
}

document.getElementById('points').addEventListener('input', e => {
  numPoints = parseInt(e.target.value);
});
document.getElementById('radius').addEventListener('input', e => {
  radius = parseInt(e.target.value);
});

draw();`;

// ── Move Object to Changing Point ───────────────────────────────────────────
const MOVE_TO_DESTINATION_HTML = `<canvas id="canvas"></canvas>`;
const MOVE_TO_DESTINATION_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

let obj = { x: canvas.width * 0.5, y: canvas.height * 0.5 };
let dest = { x: 0, y: 0 };

function drawArrow(ctx, x, y, angle, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(-size, -size*0.28);
  ctx.lineTo(size*0.35, -size*0.28);
  ctx.lineTo(size*0.35, -size*0.5);
  ctx.lineTo(size, 0);
  ctx.lineTo(size*0.35, size*0.5);
  ctx.lineTo(size*0.35, size*0.28);
  ctx.lineTo(-size, size*0.28);
  ctx.closePath();
  ctx.fillStyle = '#60a5fa';
  ctx.fill();
  ctx.restore();
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  dest.x = canvas.width / 2 + Math.sin(Date.now() * 0.0005) * 150;
  dest.y = canvas.height / 2 + Math.cos(Date.now() * 0.0003) * 100;

  let dx = dest.x - obj.x;
  let dy = dest.y - obj.y;
  let dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > 2) {
    obj.x += (dx / dist) * 3;
    obj.y += (dy / dist) * 3;
  }

  let angle = Math.atan2(dy, dx);

  ctx.fillStyle = '#a78bfa';
  ctx.beginPath();
  ctx.arc(dest.x, dest.y, 8, 0, Math.PI * 2);
  ctx.fill();

  drawArrow(ctx, obj.x, obj.y, angle, 15);

  requestAnimationFrame(draw);
}

draw();`;

// ── Point Object Towards Another ────────────────────────────────────────────
const POINT_TOWARDS_HTML = `<canvas id="canvas"></canvas>`;
const POINT_TOWARDS_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

let pointer = { x: canvas.width * 0.2, y: canvas.height * 0.5 };
let target = { x: canvas.width * 0.8, y: canvas.height * 0.5 };

function drawArrow(ctx, x, y, angle, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(-size, -size*0.28);
  ctx.lineTo(size*0.35, -size*0.28);
  ctx.lineTo(size*0.35, -size*0.5);
  ctx.lineTo(size, 0);
  ctx.lineTo(size*0.35, size*0.5);
  ctx.lineTo(size*0.35, size*0.28);
  ctx.lineTo(-size, size*0.28);
  ctx.closePath();
  ctx.fillStyle = '#60a5fa';
  ctx.fill();
  ctx.restore();
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  target.y = canvas.height / 2 + Math.sin(Date.now() * 0.0005) * 80;

  let dx = target.x - pointer.x;
  let dy = target.y - pointer.y;
  let angle = Math.atan2(dy, dx);

  ctx.fillStyle = '#a78bfa';
  ctx.beginPath();
  ctx.arc(target.x, target.y, 10, 0, Math.PI * 2);
  ctx.fill();

  drawArrow(ctx, pointer.x, pointer.y, angle, 20);

  ctx.font = '12px monospace';
  ctx.fillStyle = '#d8e2ff';
  ctx.textAlign = 'left';
  ctx.fillText('angle: ' + (angle * 180 / Math.PI).toFixed(1) + '°', 20, 30);

  requestAnimationFrame(draw);
}

draw();`;

// ── Sine Curve ──────────────────────────────────────────────────────────────
const SINE_CURVE_HTML = `<canvas id="canvas"></canvas>`;
const SINE_CURVE_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let time = Date.now() * 0.001;
  let centerY = canvas.height / 2;
  let amplitude = canvas.height * 0.3;
  let wavelength = canvas.width * 0.3;

  ctx.strokeStyle = '#818cf8';
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let x = 0; x < canvas.width; x += 2) {
    let phase = time * 2;
    let y = centerY + Math.sin((x / wavelength + phase) * Math.PI * 2) * amplitude;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();

  ctx.strokeStyle = 'rgba(150, 180, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(canvas.width, centerY);
  ctx.stroke();
  ctx.setLineDash([]);

  requestAnimationFrame(draw);
}

draw();`;

// ── Demystify Sine & Cosine ────────────────────────────────────────────────
const DEMYSTIFY_SINE_COSINE_HTML = `<canvas id="canvas"></canvas>`;
const DEMYSTIFY_SINE_COSINE_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let centerX = canvas.width * 0.3;
  let centerY = canvas.height * 0.5;
  let radius = 80;
  let time = Date.now() * 0.002;

  let x = centerX + radius * Math.cos(time);
  let y = centerY + radius * Math.sin(time);

  ctx.strokeStyle = 'rgba(150, 180, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#818cf8';
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(x, y);
  ctx.stroke();

  ctx.strokeStyle = '#a78bfa';
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(x, centerY);
  ctx.stroke();

  ctx.strokeStyle = '#c4b5fd';
  ctx.beginPath();
  ctx.moveTo(x, centerY);
  ctx.lineTo(x, y);
  ctx.stroke();

  ctx.fillStyle = '#818cf8';
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fill();

  let sinGraphX = canvas.width * 0.65;
  let sinGraphY = canvas.height * 0.3;
  let sinGraphScale = 40;

  ctx.strokeStyle = 'rgba(150, 180, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= Math.PI * 2; i += 0.1) {
    let px = sinGraphX + i * sinGraphScale / Math.PI;
    let py = sinGraphY + Math.sin(i) * sinGraphScale;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  let sinX = sinGraphX + time * sinGraphScale / Math.PI;
  let sinY = sinGraphY + Math.sin(time) * sinGraphScale;

  ctx.fillStyle = '#c4b5fd';
  ctx.beginPath();
  ctx.arc(sinX, sinY, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '12px monospace';
  ctx.fillStyle = '#d8e2ff';
  ctx.textAlign = 'left';
  ctx.fillText('cos: ' + Math.cos(time).toFixed(2), 20, 30);
  ctx.fillText('sin: ' + Math.sin(time).toFixed(2), 20, 50);

  requestAnimationFrame(draw);
}

draw();`;

// ─────────────────────────────────────────────────────────────────────────────
// COLLISION DETECTION (10 pens)
// ─────────────────────────────────────────────────────────────────────────────

const POINT_CIRCLE_HTML = `<canvas id="canvas"></canvas>`;
const POINT_CIRCLE_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

let cx = canvas.width / 2, cy = canvas.height / 2;

function pointToCircle(px, py, cx, cy, radius) {
  let dx = px - cx, dy = py - cy;
  return Math.sqrt(dx * dx + dy * dy) <= radius;
}

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

  cx = canvas.width / 2;
  cy = canvas.height / 2;

  let px = cx + Math.sin(Date.now() * 0.001) * 150;
  let py = cy + Math.sin(Date.now() * 0.0008) * 150;

  let hit = pointToCircle(px, py, cx, cy, 100);

  ctx.fillStyle = hit ? '#ff1744' : '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, 100, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#818cf8';
  ctx.beginPath();
  ctx.arc(px, py, 5, 0, Math.PI * 2);
  ctx.fill();

  if (hit) drawCollisionText(cx);

  requestAnimationFrame(draw);
}

draw();`;

const POINT_RECT_HTML = `<canvas id="canvas"></canvas>`;
const POINT_RECT_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function pointToRect(px, py, rx, ry, rw, rh) {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

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

  let rx = canvas.width / 2 - 75;
  let ry = canvas.height / 2 - 50;
  let rw = 150;
  let rh = 100;

  let px = canvas.width / 2 + Math.sin(Date.now() * 0.001) * 200;
  let py = canvas.height / 2 + Math.sin(Date.now() * 0.0008) * 150;

  let hit = pointToRect(px, py, rx, ry, rw, rh);

  ctx.fillStyle = hit ? '#ff1744' : '#ffffff';
  ctx.fillRect(rx, ry, rw, rh);

  ctx.fillStyle = '#818cf8';
  ctx.beginPath();
  ctx.arc(px, py, 5, 0, Math.PI * 2);
  ctx.fill();

  if (hit) drawCollisionText(canvas.width / 2);

  requestAnimationFrame(draw);
}

draw();`;

const CIRCLE_CIRCLE_HTML = `<canvas id="canvas"></canvas>`;
const CIRCLE_CIRCLE_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function circleToCircle(x1, y1, r1, x2, y2, r2) {
  let dx = x2 - x1, dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy) <= r1 + r2;
}

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
  let c1x = cx, c1y = cy, c1r = 60;
  let c2x = cx + Math.sin(Date.now() * 0.001) * 200;
  let c2y = cy + Math.sin(Date.now() * 0.0008) * 150;
  let c2r = 40;

  let hit = circleToCircle(c1x, c1y, c1r, c2x, c2y, c2r);

  ctx.fillStyle = hit ? '#ff1744' : '#ffffff';
  ctx.beginPath();
  ctx.arc(c1x, c1y, c1r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = hit ? '#ff1744' : '#a78bfa';
  ctx.beginPath();
  ctx.arc(c2x, c2y, c2r, 0, Math.PI * 2);
  ctx.fill();

  if (hit) drawCollisionText(cx);

  requestAnimationFrame(draw);
}

draw();`;

const CIRCLE_RECT_HTML = `<canvas id="canvas"></canvas>`;
const CIRCLE_RECT_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function circleToRect(cx, cy, cr, rx, ry, rw, rh) {
  let px = Math.max(rx, Math.min(cx, rx + rw));
  let py = Math.max(ry, Math.min(cy, ry + rh));
  let dx = cx - px, dy = cy - py;
  return dx * dx + dy * dy <= cr * cr;
}

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

  let rx = canvas.width / 2 - 60, ry = canvas.height / 2 - 40;
  let rw = 120, rh = 80;
  let cx = canvas.width / 2 + Math.sin(Date.now() * 0.001) * 200;
  let cy = canvas.height / 2 + Math.sin(Date.now() * 0.0008) * 150;
  let cr = 35;

  let hit = circleToRect(cx, cy, cr, rx, ry, rw, rh);

  ctx.fillStyle = hit ? '#ff1744' : '#ffffff';
  ctx.fillRect(rx, ry, rw, rh);

  ctx.fillStyle = hit ? '#ff1744' : '#a78bfa';
  ctx.beginPath();
  ctx.arc(cx, cy, cr, 0, Math.PI * 2);
  ctx.fill();

  if (hit) drawCollisionText(canvas.width / 2);

  requestAnimationFrame(draw);
}

draw();`;

const LINE_CIRCLE_HTML = `<canvas id="canvas"></canvas>`;
const LINE_CIRCLE_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function lineToCircle(x1, y1, x2, y2, cx, cy, cr) {
  let dx = x2 - x1, dy = y2 - y1;
  let t = Math.max(0, Math.min(1, ((cx - x1) * dx + (cy - y1) * dy) / (dx * dx + dy * dy)));
  let px = x1 + t * dx, py = y1 + t * dy;
  let ddx = cx - px, ddy = cy - py;
  return ddx * ddx + ddy * ddy <= cr * cr;
}

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

  let x1 = canvas.width * 0.2, y1 = canvas.height / 2;
  let x2 = canvas.width * 0.8, y2 = canvas.height / 2;
  let cx = canvas.width / 2 + Math.sin(Date.now() * 0.001) * 150;
  let cy = canvas.height / 2 + Math.sin(Date.now() * 0.0008) * 150;
  let cr = 30;

  let hit = lineToCircle(x1, y1, x2, y2, cx, cy, cr);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.fillStyle = hit ? '#ff1744' : '#a78bfa';
  ctx.beginPath();
  ctx.arc(cx, cy, cr, 0, Math.PI * 2);
  ctx.fill();

  if (hit) drawCollisionText(canvas.width / 2);

  requestAnimationFrame(draw);
}

draw();`;

const LINE_LINE_HTML = `<canvas id="canvas"></canvas>`;
const LINE_LINE_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function lineToLine(x1, y1, x2, y2, x3, y3, x4, y4) {
  let denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denom) < 0.0001) return false;
  let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

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

  let x1 = canvas.width * 0.1, y1 = canvas.height * 0.2;
  let x2 = canvas.width * 0.9, y2 = canvas.height * 0.8;
  let x3 = canvas.width * 0.1 + Math.sin(Date.now() * 0.001) * 150;
  let y3 = canvas.height / 2;
  let x4 = canvas.width * 0.9 - Math.sin(Date.now() * 0.001) * 150;
  let y4 = canvas.height / 2 + Math.sin(Date.now() * 0.0008) * 150;

  let hit = lineToLine(x1, y1, x2, y2, x3, y3, x4, y4);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.strokeStyle = hit ? '#ff1744' : '#a78bfa';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x3, y3);
  ctx.lineTo(x4, y4);
  ctx.stroke();

  if (hit) drawCollisionText(canvas.width / 2);

  requestAnimationFrame(draw);
}

draw();`;

const LINE_POINT_HTML = `<canvas id="canvas"></canvas>`;
const LINE_POINT_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function lineToPoint(x1, y1, x2, y2, px, py, threshold) {
  let dx = x2 - x1, dy = y2 - y1;
  let t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
  let lx = x1 + t * dx, ly = y1 + t * dy;
  let ddx = px - lx, ddy = py - ly;
  return ddx * ddx + ddy * ddy <= threshold * threshold;
}

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

  let x1 = canvas.width * 0.2, y1 = canvas.height / 2;
  let x2 = canvas.width * 0.8, y2 = canvas.height / 2;
  let px = canvas.width / 2 + Math.sin(Date.now() * 0.001) * 150;
  let py = canvas.height / 2 + Math.sin(Date.now() * 0.0008) * 150;

  let hit = lineToPoint(x1, y1, x2, y2, px, py, 20);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.fillStyle = hit ? '#ff1744' : '#a78bfa';
  ctx.beginPath();
  ctx.arc(px, py, 5, 0, Math.PI * 2);
  ctx.fill();

  if (hit) drawCollisionText(canvas.width / 2);

  requestAnimationFrame(draw);
}

draw();`;

const LINE_RECT_HTML = `<canvas id="canvas"></canvas>`;
const LINE_RECT_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function lineToRect(x1, y1, x2, y2, rx, ry, rw, rh) {
  let lines = [
    [rx, ry, rx + rw, ry],
    [rx + rw, ry, rx + rw, ry + rh],
    [rx + rw, ry + rh, rx, ry + rh],
    [rx, ry + rh, rx, ry]
  ];
  for (let [x3, y3, x4, y4] of lines) {
    let denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) > 0.0001) {
      let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
      let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
      if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return true;
    }
  }
  return false;
}

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

  let rx = canvas.width / 2 - 60, ry = canvas.height / 2 - 40;
  let rw = 120, rh = 80;
  let x1 = canvas.width * 0.1 + Math.sin(Date.now() * 0.001) * 100;
  let y1 = canvas.height * 0.2;
  let x2 = canvas.width * 0.9 - Math.sin(Date.now() * 0.001) * 100;
  let y2 = canvas.height * 0.8;

  let hit = lineToRect(x1, y1, x2, y2, rx, ry, rw, rh);

  ctx.fillStyle = hit ? '#ff1744' : '#ffffff';
  ctx.fillRect(rx, ry, rw, rh);

  ctx.strokeStyle = hit ? '#ff1744' : '#a78bfa';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  if (hit) drawCollisionText(canvas.width / 2);

  requestAnimationFrame(draw);
}

draw();`;

const RECT_RECT_HTML = `<canvas id="canvas"></canvas>`;
const RECT_RECT_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function rectToRect(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

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

  let x1 = canvas.width / 2 - 60, y1 = canvas.height / 2 - 40;
  let w1 = 120, h1 = 80;
  let x2 = canvas.width / 2 + Math.sin(Date.now() * 0.001) * 150;
  let y2 = canvas.height / 2 + Math.sin(Date.now() * 0.0008) * 120;
  let w2 = 100, h2 = 70;

  let hit = rectToRect(x1, y1, w1, h1, x2, y2, w2, h2);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x1, y1, w1, h1);

  ctx.fillStyle = hit ? '#ff1744' : '#a78bfa';
  ctx.fillRect(x2, y2, w2, h2);

  if (hit) drawCollisionText(canvas.width / 2);

  requestAnimationFrame(draw);
}

draw();`;

const POLYGON_POLYGON_HTML = `<canvas id="canvas"></canvas>`;
const POLYGON_POLYGON_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function pointInPolygon(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    let xi = poly[i].x, yi = poly[i].y;
    let xj = poly[j].x, yj = poly[j].y;
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function polygonToPolygon(poly1, poly2) {
  for (let p of poly1) if (pointInPolygon(p.x, p.y, poly2)) return true;
  for (let p of poly2) if (pointInPolygon(p.x, p.y, poly1)) return true;
  return false;
}

function drawCollisionText(x) {
  ctx.font = "bold 24px 'Courier New',monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,0,100,0.55)"; ctx.fillText("[ COLLISION DETECTED ]", x+3, 43);
  ctx.fillStyle = "rgba(0,255,255,0.55)";  ctx.fillText("[ COLLISION DETECTED ]", x-3, 37);
  ctx.fillStyle = "#e0f7ff";               ctx.fillText("[ COLLISION DETECTED ]", x,   40);
  ctx.textAlign = "left";
}

function drawPoly(points, color, fill) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  if (fill) ctx.fill(); else ctx.stroke();
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let t = Date.now() * 0.0005;
  let cx = canvas.width / 2, cy = canvas.height / 2;

  let poly1 = [
    {x: cx - 50, y: cy - 50},
    {x: cx + 50, y: cy - 50},
    {x: cx + 50, y: cy + 50},
    {x: cx - 50, y: cy + 50}
  ];

  let dx = Math.sin(t) * 120;
  let dy = Math.sin(t * 0.8) * 100;
  let poly2 = [
    {x: cx + dx - 40, y: cy + dy - 30},
    {x: cx + dx + 40, y: cy + dy - 30},
    {x: cx + dx + 20, y: cy + dy + 40}
  ];

  let hit = polygonToPolygon(poly1, poly2);

  drawPoly(poly1, hit ? '#ff1744' : '#ffffff', true);
  drawPoly(poly2, hit ? '#ff1744' : '#a78bfa', true);

  if (hit) drawCollisionText(cx);

  requestAnimationFrame(draw);
}

draw();`;

export const EXAMPLE_PENS: ExamplePen[] = [
  {
    group: "Animations",
    key: "ball-bounce",
    label: "Ball Bounce",
    blurb: "A ball falls with gravity, bounces off walls and floor, losing energy on each impact.",
    payload: {
      title: "Ball Bounce",
      description: "A ball falls with gravity and bounces off walls with realistic energy loss.",
      html: BALL_BOUNCE_HTML,
      css: FULLSCREEN_CSS,
      js: BALL_BOUNCE_JS,
    },
  },
  {
    group: "Animations",
    key: "balls-bouncing",
    label: "Balls Bouncing Against Each Other",
    blurb: "Multiple balls collide with each other and the walls, using spring forces.",
    payload: {
      title: "Balls Bouncing Against Each Other",
      description: "Watch multiple balls bounce off each other using spring-based collision.",
      html: BALLS_BOUNCING_HTML,
      css: FULLSCREEN_CSS,
      js: BALLS_BOUNCING_JS,
    },
  },
  {
    group: "Animations",
    key: "orbital-motion",
    label: "Ball Orbiting a Sun",
    blurb: "A ball orbits a sun using gravitational attraction, drawn as a spiral.",
    payload: {
      title: "Orbital Motion",
      description: "A ball orbits a sun using gravitational force — scale up the mass for a solar system.",
      html: ORBITAL_MOTION_HTML,
      css: FULLSCREEN_CSS,
      js: ORBITAL_MOTION_JS,
    },
  },
  {
    group: "Animations",
    key: "lerp",
    label: "Lerp (Smooth Follow)",
    blurb: "Linear interpolation: smoothly follow a target by always moving a fraction of the way there.",
    payload: {
      title: "Lerp — Linear Interpolation",
      description: "Smoothly follow a target using linear interpolation (a + (b-a)*t).",
      html: LERP_HTML,
      css: FULLSCREEN_CSS,
      js: LERP_JS,
    },
  },
  {
    group: "Animations",
    key: "easing",
    label: "Easing Functions",
    blurb: "Compare different easing curves to smooth out motion in an animation.",
    payload: {
      title: "Easing Functions",
      description: "Easing functions shape the motion curve — linear, ease-in, ease-out, ease-in-out.",
      html: EASING_HTML,
      css: FULLSCREEN_CSS,
      js: EASING_JS,
    },
  },
  {
    group: "Animations",
    key: "quadratic-bezier",
    label: "Quadratic Bézier Curve",
    blurb: "A curve controlled by three points: two endpoints and one control point in between.",
    payload: {
      title: "Quadratic Bézier Curve",
      description: "A smooth curve defined by three points using the quadratic Bézier formula.",
      html: QUADRATIC_BEZIER_HTML,
      css: FULLSCREEN_CSS,
      js: QUADRATIC_BEZIER_JS,
    },
  },
  {
    group: "Animations",
    key: "find-points-on-circle",
    label: "Find Points on a Circle",
    blurb: "Distribute points evenly around a circle using trigonometry.",
    payload: {
      title: "Find Points on a Circle",
      description: "Distribute n points around a circle: x = cx + r·cos(angle), y = cy + r·sin(angle).",
      html: FIND_POINTS_CIRCLE_HTML,
      css: FULLSCREEN_CSS,
      js: FIND_POINTS_CIRCLE_JS,
    },
  },
  {
    group: "Animations",
    key: "move-to-destination",
    label: "Move Object to Changing Point",
    blurb: "Smoothly move toward a target that changes position, following at a fixed speed.",
    payload: {
      title: "Move to Destination",
      description: "Move toward a target point at a constant speed using vector normalization.",
      html: MOVE_TO_DESTINATION_HTML,
      css: FULLSCREEN_CSS,
      js: MOVE_TO_DESTINATION_JS,
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
    },
  },
  {
    group: "Animations",
    key: "sine-curve",
    label: "Sine Curve",
    blurb: "A flowing sine wave that changes over time, showing the core of oscillation.",
    payload: {
      title: "Sine Curve",
      description: "A simple sine wave that scrolls across the canvas.",
      html: SINE_CURVE_HTML,
      css: FULLSCREEN_CSS,
      js: SINE_CURVE_JS,
    },
  },
  {
    group: "Animations",
    key: "demystify-sine-cosine",
    label: "Demystify Sine & Cosine",
    blurb: "See sine and cosine visually: a point moves on a circle, and its x/y coordinates trace the curves.",
    payload: {
      title: "Demystify Sine & Cosine",
      description: "Visualize how sine and cosine come from a point moving on a circle.",
      html: DEMYSTIFY_SINE_COSINE_HTML,
      css: FULLSCREEN_CSS,
      js: DEMYSTIFY_SINE_COSINE_JS,
    },
  },
  {
    group: "Collision Detection",
    key: "point-to-circle",
    label: "Point to Circle",
    blurb: "Detect when a moving point enters a circle.",
    payload: {
      title: "Point to Circle",
      description: "Simplest collision: distance from point to center <= radius.",
      html: POINT_CIRCLE_HTML,
      css: FULLSCREEN_CSS,
      js: POINT_CIRCLE_JS,
    },
  },
  {
    group: "Collision Detection",
    key: "point-to-rect",
    label: "Point to Rectangle",
    blurb: "Detect when a moving point enters an axis-aligned rectangle.",
    payload: {
      title: "Point to Rectangle",
      description: "Axis-aligned rectangle collision: px in [rx, rx+w] and py in [ry, ry+h].",
      html: POINT_RECT_HTML,
      css: FULLSCREEN_CSS,
      js: POINT_RECT_JS,
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
    },
  },
  {
    group: "Collision Detection",
    key: "circle-to-rect",
    label: "Circle to Rectangle",
    blurb: "Detect when a circle collides with an axis-aligned rectangle.",
    payload: {
      title: "Circle to Rectangle",
      description: "Find closest point on rect to circle center, check distance.",
      html: CIRCLE_RECT_HTML,
      css: FULLSCREEN_CSS,
      js: CIRCLE_RECT_JS,
    },
  },
  {
    group: "Collision Detection",
    key: "line-to-circle",
    label: "Line to Circle",
    blurb: "Detect when a line segment comes close enough to a circle.",
    payload: {
      title: "Line to Circle",
      description: "Project circle center onto line, check if projection is within radius.",
      html: LINE_CIRCLE_HTML,
      css: FULLSCREEN_CSS,
      js: LINE_CIRCLE_JS,
    },
  },
  {
    group: "Collision Detection",
    key: "line-to-line",
    label: "Line to Line",
    blurb: "Detect when two line segments intersect using parametric intersection.",
    payload: {
      title: "Line to Line",
      description: "Parametric intersection test: solve for t and u in both lines.",
      html: LINE_LINE_HTML,
      css: FULLSCREEN_CSS,
      js: LINE_LINE_JS,
    },
  },
  {
    group: "Collision Detection",
    key: "line-to-point",
    label: "Line to Point",
    blurb: "Detect when a point comes within a threshold distance of a line segment.",
    payload: {
      title: "Line to Point",
      description: "Project point onto line, measure distance to projection.",
      html: LINE_POINT_HTML,
      css: FULLSCREEN_CSS,
      js: LINE_POINT_JS,
    },
  },
  {
    group: "Collision Detection",
    key: "line-to-rect",
    label: "Line to Rectangle",
    blurb: "Detect when a line segment intersects any edge of an axis-aligned rectangle.",
    payload: {
      title: "Line to Rectangle",
      description: "Test line against all four rect edges using line-to-line.",
      html: LINE_RECT_HTML,
      css: FULLSCREEN_CSS,
      js: LINE_RECT_JS,
    },
  },
  {
    group: "Collision Detection",
    key: "rect-to-rect",
    label: "Rectangle to Rectangle",
    blurb: "Detect when two axis-aligned rectangles overlap using AABB (axis-aligned bounding box).",
    payload: {
      title: "Rectangle to Rectangle",
      description: "AABB collision: check if rectangles overlap on both axes.",
      html: RECT_RECT_HTML,
      css: FULLSCREEN_CSS,
      js: RECT_RECT_JS,
    },
  },
  {
    group: "Collision Detection",
    key: "polygon-to-polygon",
    label: "Polygon to Polygon",
    blurb: "Detect when two arbitrary polygons collide using point-in-polygon and ray casting.",
    payload: {
      title: "Polygon to Polygon",
      description: "Check if any vertex of one polygon is inside the other (ray casting).",
      html: POLYGON_POLYGON_HTML,
      css: FULLSCREEN_CSS,
      js: POLYGON_POLYGON_JS,
    },
  },
  {
    group: "Useful Little Things",
    key: "get-point-on-line",
    label: "Get a Point on a Line",
    blurb: "Find a point at a given percentage along a line segment.",
    payload: {
      title: "Get Point on Line",
      description: "Linearly interpolate between two points: p = p1 + t*(p2-p1).",
      html: `<canvas id="canvas"></canvas><div id="controls"><label>t: <input type="range" id="t" min="0" max="100" step="1" value="50"></label></div>`,
      css: FULLSCREEN_CSS,
      js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

let p1 = {x: canvas.width * 0.2, y: canvas.height * 0.5};
let p2 = {x: canvas.width * 0.8, y: canvas.height * 0.5};
let t = 0.5;

function lerp(a, b, t) { return a + (b - a) * t; }
function getPointOnLine(p1, p2, t) {
  return {x: lerp(p1.x, p2.x, t), y: lerp(p1.y, p2.y, t)};
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

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
    },
  },
  {
    group: "Useful Little Things",
    key: "triangle-data",
    label: "Triangle Data from Line",
    blurb: "Create a right triangle from a line segment by finding the perpendicular point.",
    payload: {
      title: "Triangle Data from Line",
      description: "Given a line, construct a right triangle showing rise/run components.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let p1 = {x: canvas.width * 0.2, y: canvas.height * 0.7};
  let p2 = {x: canvas.width * 0.8, y: canvas.height * 0.3};

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

  let dx = p2.x - p1.x;
  let dy = p2.y - p1.y;
  ctx.font = '12px monospace';
  ctx.fillStyle = '#d8e2ff';
  ctx.textAlign = 'left';
  ctx.fillText('dx: ' + dx.toFixed(0), 20, 30);
  ctx.fillText('dy: ' + dy.toFixed(0), 20, 50);
  ctx.fillText('distance: ' + Math.sqrt(dx*dx + dy*dy).toFixed(0), 20, 70);

  requestAnimationFrame(draw);
}

draw();`,
    },
  },
  {
    group: "Useful Little Things",
    key: "draw-star",
    label: "Draw Star",
    blurb: "Draw a star by alternating between outer and inner radius points.",
    payload: {
      title: "Draw Star",
      description: "A star alternates between outer and inner radii at regular angles.",
      html: `<canvas id="canvas"></canvas><div id="controls"><label>points: <input type="range" id="points" min="3" max="12" step="1" value="5"></label></div>`,
      css: FULLSCREEN_CSS,
      js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

let numPoints = 5;

function drawStar(cx, cy, outer, inner, points) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    let r = i % 2 === 0 ? outer : inner;
    let angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    let x = cx + r * Math.cos(angle);
    let y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let cx = canvas.width / 2, cy = canvas.height / 2;
  let t = Date.now() * 0.001;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(t);

  drawStar(0, 0, 100, 40, numPoints);
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
      js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

let rotation = 0;

function drawRectWithTrig(cx, cy, w, h, angle) {
  let corners = [
    {x: -w/2, y: -h/2},
    {x: w/2, y: -h/2},
    {x: w/2, y: h/2},
    {x: -w/2, y: h/2}
  ];

  ctx.beginPath();
  for (let i = 0; i < corners.length; i++) {
    let c = corners[i];
    let x = c.x * Math.cos(angle) - c.y * Math.sin(angle) + cx;
    let y = c.x * Math.sin(angle) + c.y * Math.cos(angle) + cy;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let cx = canvas.width / 2, cy = canvas.height / 2;
  let angle = rotation * Math.PI / 180;

  drawRectWithTrig(cx, cy, 200, 100, angle);
  ctx.fillStyle = '#818cf8';
  ctx.fill();
  ctx.strokeStyle = 'rgba(150, 180, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();

  requestAnimationFrame(draw);
}

document.getElementById('rotation').addEventListener('input', e => {
  rotation = parseInt(e.target.value);
});

draw();`,
    },
  },
  {
    group: "Useful Little Things",
    key: "equilateral-triangle",
    label: "Equilateral Triangle",
    blurb: "Draw an equilateral triangle by placing vertices at 120° intervals.",
    payload: {
      title: "Equilateral Triangle",
      description: "Three vertices at 120° intervals from the top.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function drawEquilateralTriangle(cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    let angle = (i * 120 * Math.PI / 180) - Math.PI / 2;
    let x = cx + r * Math.cos(angle);
    let y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

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
    },
  },
  {
    group: "Useful Little Things",
    key: "circle-from-three",
    label: "Circle from Three Points",
    blurb: "Find the circumcircle that passes through three points using perpendicular bisectors.",
    payload: {
      title: "Circle from Three Points",
      description: "Compute circumcenter and circumradius from three non-collinear points.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function circleFromThreePoints(p1, p2, p3) {
  let ax = p1.x, ay = p1.y;
  let bx = p2.x, by = p2.y;
  let cx = p3.x, cy = p3.y;

  let d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
  if (Math.abs(d) < 0.001) return null;

  let ux = ((ax*ax + ay*ay) * (by - cy) + (bx*bx + by*by) * (cy - ay) + (cx*cx + cy*cy) * (ay - by)) / d;
  let uy = ((ax*ax + ay*ay) * (cx - bx) + (bx*bx + by*by) * (ax - cx) + (cx*cx + cy*cy) * (bx - ax)) / d;

  let r = Math.sqrt((ax - ux) * (ax - ux) + (ay - uy) * (ay - uy));

  return {x: ux, y: uy, r: r};
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let t = Date.now() * 0.001;
  let cx = canvas.width / 2, cy = canvas.height / 2;

  let p1 = {x: cx + Math.cos(t) * 100, y: cy + Math.sin(t) * 100};
  let p2 = {x: cx + Math.cos(t + 2.09) * 100, y: cy + Math.sin(t + 2.09) * 100};
  let p3 = {x: cx + Math.cos(t + 4.18) * 100, y: cy + Math.sin(t + 4.18) * 100};

  let circle = circleFromThreePoints(p1, p2, p3);

  if (circle) {
    ctx.strokeStyle = 'rgba(150, 180, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = '#818cf8';
  ctx.beginPath();
  ctx.arc(p1.x, p1.y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.arc(p2.x, p2.y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.arc(p3.x, p3.y, 6, 0, Math.PI * 2);
  ctx.fill();

  if (circle) {
    ctx.fillStyle = '#a78bfa';
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

draw();`,
    },
  },
  {
    group: "Useful Little Things",
    key: "distribute-around",
    label: "Distribute Points Around Circle",
    blurb: "Evenly distribute points around a circle using uniform angle intervals.",
    payload: {
      title: "Distribute Points Around Circle",
      description: "Place n points at uniform angular intervals on a circle.",
      html: `<canvas id="canvas"></canvas><div id="controls"><label>points: <input type="range" id="points" min="3" max="20" step="1" value="8"></label></div>`,
      css: FULLSCREEN_CSS,
      js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

let numPoints = 8;

function distributeAroundCircle(cx, cy, r, n) {
  let points = [];
  for (let i = 0; i < n; i++) {
    let angle = (i / n) * Math.PI * 2;
    points.push({x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle)});
  }
  return points;
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let cx = canvas.width / 2, cy = canvas.height / 2;
  let t = Date.now() * 0.001;

  ctx.strokeStyle = 'rgba(150, 180, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, 100, 0, Math.PI * 2);
  ctx.stroke();

  let points = distributeAroundCircle(cx, cy, 100, numPoints);

  ctx.strokeStyle = 'rgba(150, 180, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let p of points) ctx.lineTo(p.x, p.y);
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = '#818cf8';
  for (let p of points) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

document.getElementById('points').addEventListener('input', e => {
  numPoints = parseInt(e.target.value);
});

draw();`,
    },
  },
  {
    group: "Useful Little Things",
    key: "distance-between",
    label: "Distance Between Two Points",
    blurb: "Calculate the straight-line distance between two points using the Pythagorean theorem.",
    payload: {
      title: "Distance Between Two Points",
      description: "distance = sqrt((x2-x1)² + (y2-y1)²)",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function distance(p1, p2) {
  let dx = p2.x - p1.x, dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

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
    },
  },
  {
    group: "Useful Little Things",
    key: "bezier-curves",
    label: "Bézier Curves (de Casteljau)",
    blurb: "Draw smooth Bézier curves using recursive linear interpolation.",
    payload: {
      title: "Bézier Curves — de Casteljau",
      description: "Cubic Bézier: recursively interpolate between control points.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function lerp(a, b, t) { return a + (b - a) * t; }

function bezierPoint(p0, p1, p2, p3, t) {
  let q0 = {x: lerp(p0.x, p1.x, t), y: lerp(p0.y, p1.y, t)};
  let q1 = {x: lerp(p1.x, p2.x, t), y: lerp(p1.y, p2.y, t)};
  let q2 = {x: lerp(p2.x, p3.x, t), y: lerp(p2.y, p3.y, t)};
  let r0 = {x: lerp(q0.x, q1.x, t), y: lerp(q0.y, q1.y, t)};
  let r1 = {x: lerp(q1.x, q2.x, t), y: lerp(q1.y, q2.y, t)};
  return {x: lerp(r0.x, r1.x, t), y: lerp(r0.y, r1.y, t)};
}

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
    },
  },
  {
    group: "Math & Physics",
    key: "fourier-epicycles",
    label: "Fourier Epicycles",
    blurb: "Draw shapes using rotating circles (epicycles) derived from Fourier transform of a path.",
    payload: {
      title: "Fourier Epicycles",
      description: "Any path can be drawn by summing rotating circles with different frequencies and phases.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

function dft(pts) {
  const N = pts.length;
  const X = [];
  for (let k = 0; k < N; k++) {
    let re = 0, im = 0;
    for (let n = 0; n < N; n++) {
      const phi = (2*Math.PI*k*n)/N;
      re += pts[n].x*Math.cos(phi) + pts[n].y*Math.sin(phi);
      im += -pts[n].x*Math.sin(phi) + pts[n].y*Math.cos(phi);
    }
    re /= N; im /= N;
    X.push({freq: k, amp: Math.sqrt(re*re+im*im), phase: Math.atan2(im,re)});
  }
  return X.sort((a,b) => b.amp-a.amp);
}

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
    },
  },
  {
    group: "Math & Physics",
    key: "game-of-life",
    label: "Conway's Game of Life",
    blurb: "Classic cellular automaton: cells live, die, or spawn based on neighbor count.",
    payload: {
      title: "Conway's Game of Life",
      description: "Four rules on a grid: 1. Underpop = death. 2. 2-3 neighbors = survive. 3. Overpop = death. 4. Exactly 3 neighbors = birth.",
      html: `<canvas id="canvas"></canvas><div id="controls"><button id="reset">Reset</button><button id="toggle">Pause/Play</button></div>`,
      css: FULLSCREEN_CSS,
      js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

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

function countNeighbors(x, y) {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      let nx = (x + dx + cols) % cols;
      let ny = (y + dy + rows) % rows;
      count += grid[ny * cols + nx];
    }
  }
  return count;
}

function step() {
  let next = new Uint8Array(cols * rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let i = y * cols + x;
      let neighbors = countNeighbors(x, y);
      let alive = grid[i];
      if (alive && (neighbors === 2 || neighbors === 3)) next[i] = 1;
      else if (!alive && neighbors === 3) next[i] = 1;
    }
  }
  grid = next;
}

function draw() {
  if (!paused) step();

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
    },
  },
  {
    group: "Math & Physics",
    key: "wave-interference",
    label: "Wave Interference",
    blurb: "See constructive and destructive interference of ripples from multiple sources.",
    payload: {
      title: "Wave Interference",
      description: "Multiple sources create ripples; where peaks meet = bright, where troughs meet = dark.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `const canvas = document.getElementById('canvas');
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
  let idata = offCtx.createImageData(off.width, off.height);
  let data = idata.data;

  for (let i = 0; i < data.length; i += 4) {
    let px = (i / 4) % off.width;
    let py = Math.floor((i / 4) / off.width);
    let x = px * 2, y = py * 2;

    let amp = 0;
    for (let s = 0; s < 3; s++) {
      let sx = [canvas.width * 0.2, canvas.width * 0.8, canvas.width * 0.5][s];
      let sy = [canvas.height * 0.3, canvas.height * 0.3, canvas.height * 0.8][s];
      let dx = x - sx, dy = y - sy;
      let r = Math.sqrt(dx*dx + dy*dy);
      let k = 0.02, omega = 3;
      amp += Math.cos(k * r - omega * time);
    }
    amp /= 3;

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
    },
  },
  {
    group: "Math & Physics",
    key: "gravitational-lensing",
    label: "Gravitational Lensing",
    blurb: "Watch light rays bend around a massive object, demonstrating spacetime curvature.",
    payload: {
      title: "Gravitational Lensing",
      description: "Light rays pass near a massive object and are deflected by its gravity.",
      html: `<canvas id="canvas"></canvas>`,
      css: FULLSCREEN_CSS,
      js: `const canvas = document.getElementById('canvas');
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
      let b = Math.abs(y0 - ly);
      let deflection = 0;
      if (x > lx - 100 && x < lx + 100) {
        let r = Math.sqrt((x - lx) * (x - lx) + b * b);
        if (r > 5) deflection = mass / (r * b) * 0.5;
      }
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
    },
  },
  {
    group: "Math & Physics",
    key: "orbital-precession",
    label: "Orbital Precession (GR)",
    blurb: "See how General Relativity adds a small ε/r² correction to orbital force, causing the orbit to precess.",
    payload: {
      title: "Orbital Precession",
      description: "Einstein's correction to Newtonian gravity causes elliptical orbits to slowly rotate.",
      html: `<canvas id="canvas"></canvas><div id="controls"><label>GR strength: <input type="range" id="gr" min="0" max="0.0001" step="0.00001" value="0.00001"></label></div>`,
      css: FULLSCREEN_CSS,
      js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
window.addEventListener('resize', resize);
resize();

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

  let dx = sun.x - orbiter.x;
  let dy = sun.y - orbiter.y;
  let r = Math.sqrt(dx*dx + dy*dy);
  let force = (0.5 * sun.mass) / (r * r);
  let grCorrection = 1 + grStrength / (r * r);
  force *= grCorrection;

  orbiter.vx += (dx / r) * force;
  orbiter.vy += (dy / r) * force;
  orbiter.x += orbiter.vx;
  orbiter.y += orbiter.vy;

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
    },
  },
];
