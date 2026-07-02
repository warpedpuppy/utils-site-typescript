import Template from "../../core-animations/animationTemplate";
import { CodePenPayload } from "./codepen";
import {
  injectStudioNotes,
  makeControlPanel,
  makeButton,
  makeSlider,
  appendCodePenButton,
} from "./studioKit";

// ─── Physics Toy ─────────────────────────────────────────────────────────────
// Composition over invention: three behaviours the site already teaches —
// orbital gravity, wall bounce, and elastic ball-to-ball collision — sharing one
// integration loop. The lesson is the order of operations: forces → integrate →
// resolve collisions → resolve walls.

const DESIGN_NOTES = `
<h4>One loop, three behaviours</h4>
<p>Each body runs the same four-step update: (1) accumulate the gravity force toward the central mass, (2) integrate velocity & position, (3) resolve pairwise collisions, (4) clamp against the walls. Composition, not three separate systems.</p>

<h4>Orbital gravity</h4>
<p>Acceleration toward the centre is <code>G·M / d²</code> along the connecting line. A clamped minimum distance stops the singularity when a body skims the centre and flings off to infinity.</p>

<h4>Elastic collision</h4>
<p>When two circles overlap, push them apart along the normal, then exchange the velocity components <em>along that normal</em> weighted by mass. Tangential motion is untouched — that's what makes it look like real billiards.</p>

<h4>Make it yours</h4>
<p>Click to spawn bodies. Turn gravity to zero and it's a billiards table; turn it up and it's a solar system. Same code — the parameters decide the genre.</p>
`;

const PEN_HTML = `<canvas id="c"></canvas>
<div id="ui">
  <button id="reset">reset</button>
  <label>gravity <input id="g" type="range" min="0" max="100" value="45"></label>
  <span style="opacity:.7">click to add a body</span>
</div>`;

const PEN_CSS = `* { margin: 0; box-sizing: border-box; }
html, body { height: 100%; overflow: hidden; background: #06060c; }
canvas { display: block; width: 100vw; height: 100vh; }
#ui { position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 16px; align-items: center; background: rgba(8,8,18,0.9);
  border: 1px solid rgba(120,170,235,0.3); border-radius: 10px; padding: 10px 18px;
  font: 12px monospace; color: #a8c6e0; }
#ui button { background: rgba(100,200,255,0.12); border: 1px solid rgba(100,200,255,0.35);
  color: #bfe3ff; padding: 5px 12px; border-radius: 4px; cursor: pointer; font: inherit; }`;

const PEN_JS = `const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
function resize(){ canvas.width=canvas.clientWidth; canvas.height=canvas.clientHeight; }
addEventListener('resize', resize); resize();

let G = 45, bodies = [];
const restitution = 0.92;

function spawn(x, y){
  const r = 6 + Math.random()*14;
  bodies.push({ x, y, vx:(Math.random()-0.5)*4, vy:(Math.random()-0.5)*4,
    r, m: r*r, hue: Math.random()*360 });
}
function reset(){
  bodies = [];
  const cx=canvas.width/2, cy=canvas.height/2;
  for(let i=0;i<14;i++){
    const a=Math.random()*7, d=120+Math.random()*180;
    bodies.push({ x:cx+Math.cos(a)*d, y:cy+Math.sin(a)*d,
      vx:Math.sin(a)*2.2, vy:-Math.cos(a)*2.2,
      r:6+Math.random()*12, m:0, hue:Math.random()*360 });
  }
  bodies.forEach(b=>b.m=b.r*b.r);
}
reset();

function step(){
  const cx=canvas.width/2, cy=canvas.height/2;
  // 1) gravity toward centre + 2) integrate
  for(const b of bodies){
    let dx=cx-b.x, dy=cy-b.y, d=Math.hypot(dx,dy); if(d<30)d=30;
    const a=G/(d*d);
    b.vx += a*dx/d*100; b.vy += a*dy/d*100;
    b.x += b.vx; b.y += b.vy;
  }
  // 3) elastic ball-ball collisions
  for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){
    const a=bodies[i], b=bodies[j];
    let dx=b.x-a.x, dy=b.y-a.y, d=Math.hypot(dx,dy), min=a.r+b.r;
    if(d>0 && d<min){
      const nx=dx/d, ny=dy/d, overlap=(min-d)/2;
      a.x-=nx*overlap; a.y-=ny*overlap; b.x+=nx*overlap; b.y+=ny*overlap;
      const rvx=b.vx-a.vx, rvy=b.vy-a.vy, vn=rvx*nx+rvy*ny;
      if(vn<0){ const imp=2*vn/(a.m+b.m);
        a.vx+=imp*b.m*nx; a.vy+=imp*b.m*ny; b.vx-=imp*a.m*nx; b.vy-=imp*a.m*ny; }
    }
  }
  // 4) walls
  for(const b of bodies){
    if(b.x<b.r){b.x=b.r;b.vx=-b.vx*restitution;} if(b.x>canvas.width-b.r){b.x=canvas.width-b.r;b.vx=-b.vx*restitution;}
    if(b.y<b.r){b.y=b.r;b.vy=-b.vy*restitution;} if(b.y>canvas.height-b.r){b.y=canvas.height-b.r;b.vy=-b.vy*restitution;}
  }
}

function draw(){
  ctx.fillStyle='rgba(6,6,12,0.32)'; ctx.fillRect(0,0,canvas.width,canvas.height);
  if(G>0){ ctx.fillStyle='rgba(255,220,150,0.9)'; ctx.beginPath();
    ctx.arc(canvas.width/2,canvas.height/2,7,0,7); ctx.fill(); }
  for(const b of bodies){
    ctx.fillStyle=\`hsl(\${b.hue},75%,62%)\`; ctx.beginPath();
    ctx.arc(b.x,b.y,b.r,0,7); ctx.fill();
  }
}
function frame(){ step(); draw(); requestAnimationFrame(frame); } frame();

canvas.addEventListener('pointerdown', e => {
  const r=canvas.getBoundingClientRect(); spawn(e.clientX-r.left, e.clientY-r.top);
});
reset.onclick = reset;
g.oninput = e => G = +e.target.value;`;

export const PHYSICS_TOY_PEN: CodePenPayload = {
  title: "Physics Toy",
  description:
    "Orbital gravity + wall bounce + elastic collision sharing one integration loop. Zero gravity = billiards; high gravity = a solar system. Click to add bodies.",
  html: PEN_HTML,
  css: PEN_CSS,
  js: PEN_JS,
};

interface Body { x: number; y: number; vx: number; vy: number; r: number; m: number; hue: number; }

class PhysicsToy extends Template {
  static t = "Physics Toy";
  static l = "physics-toy";
  static f = { keyFunction: () => {}, dependencies: [], functionString: "" };

  private animId = 0;
  private bodies: Body[] = [];
  private G = 45;
  private restitution = 0.92;
  private panel: HTMLDivElement | null = null;

  init() {
    if (this.cont) (this.cont as HTMLElement).style.position = "relative";
    injectStudioNotes(DESIGN_NOTES);
    this.reset();
    this.injectControls();
    this.loop();
  }

  private reset() {
    this.bodies = [];
    const cx = this.canvasWidth / 2;
    const cy = this.canvasHeight / 2;
    for (let i = 0; i < 14; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = 120 + Math.random() * 180;
      const r = 6 + Math.random() * 12;
      this.bodies.push({
        x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d,
        vx: Math.sin(a) * 2.2, vy: -Math.cos(a) * 2.2,
        r, m: r * r, hue: Math.random() * 360,
      });
    }
  }

  private spawn(x: number, y: number) {
    const r = 6 + Math.random() * 14;
    this.bodies.push({ x, y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, r, m: r * r, hue: Math.random() * 360 });
  }

  pointerDownHandler(e: PointerEvent) {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.spawn(e.clientX - rect.left, e.clientY - rect.top);
  }

  private step() {
    const cx = this.canvasWidth / 2;
    const cy = this.canvasHeight / 2;
    for (const b of this.bodies) {
      let dx = cx - b.x, dy = cy - b.y;
      let d = Math.hypot(dx, dy);
      if (d < 30) d = 30;
      const a = this.G / (d * d);
      b.vx += (a * dx) / d * 100;
      b.vy += (a * dy) / d * 100;
      b.x += b.vx;
      b.y += b.vy;
    }
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        const a = this.bodies[i], b = this.bodies[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy);
        const min = a.r + b.r;
        if (d > 0 && d < min) {
          const nx = dx / d, ny = dy / d, overlap = (min - d) / 2;
          a.x -= nx * overlap; a.y -= ny * overlap;
          b.x += nx * overlap; b.y += ny * overlap;
          const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (vn < 0) {
            const imp = (2 * vn) / (a.m + b.m);
            a.vx += imp * b.m * nx; a.vy += imp * b.m * ny;
            b.vx -= imp * a.m * nx; b.vy -= imp * a.m * ny;
          }
        }
      }
    }
    for (const b of this.bodies) {
      if (b.x < b.r) { b.x = b.r; b.vx = -b.vx * this.restitution; }
      if (b.x > this.canvasWidth - b.r) { b.x = this.canvasWidth - b.r; b.vx = -b.vx * this.restitution; }
      if (b.y < b.r) { b.y = b.r; b.vy = -b.vy * this.restitution; }
      if (b.y > this.canvasHeight - b.r) { b.y = this.canvasHeight - b.r; b.vy = -b.vy * this.restitution; }
    }
  }

  private loop() {
    const frame = () => {
      this.animId = requestAnimationFrame(frame);
      const { ctx } = this;
      if (!ctx) return;
      this.step();
      ctx.fillStyle = "rgba(6,6,12,0.32)";
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      if (this.G > 0) {
        ctx.fillStyle = "rgba(255,220,150,0.9)";
        ctx.beginPath();
        ctx.arc(this.canvasWidth / 2, this.canvasHeight / 2, 7, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const b of this.bodies) {
        ctx.fillStyle = `hsl(${b.hue},75%,62%)`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    frame();
  }

  private injectControls() {
    if (!this.cont) return;
    const panel = makeControlPanel();
    panel.appendChild(makeButton("reset", () => this.reset()));
    panel.appendChild(makeSlider({
      label: "gravity", min: 0, max: 100, value: this.G, step: 1,
      onChange: (v) => (this.G = v),
    }));
    const hint = document.createElement("span");
    hint.textContent = "click canvas to add a body";
    hint.style.opacity = "0.6";
    panel.appendChild(hint);
    appendCodePenButton(panel, PHYSICS_TOY_PEN);
    this.cont.appendChild(panel);
    this.panel = panel;
  }

  stop() {
    cancelAnimationFrame(this.animId);
    if (this.panel?.parentNode) this.panel.parentNode.removeChild(this.panel);
    super.stop();
  }
}

export default PhysicsToy;
