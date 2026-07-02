import Template from "../../core-animations/animationTemplate";
import { CodePenPayload } from "./codepen";
import {
  injectStudioNotes,
  makeControlPanel,
  makeButton,
  makeSlider,
  appendCodePenButton,
  createPerlin2,
  easeInOut,
} from "./studioKit";

// ─── Particle Constellation ──────────────────────────────────────────────────
// Composition piece: three of the site's primitives working together.
//   • Phyllotaxis  → each particle's *target* (golden-angle lattice)
//   • lerp + ease  → particles glide from a random start to that target
//   • Perlin noise → a living drift offset so the formed shape keeps breathing
// The "aha" is that none of these is new — the magic is in combining them.

const GOLDEN_ANGLE = 137.50776405003785;

const DESIGN_NOTES = `
<h4>Three primitives, one effect</h4>
<p>Nothing here is a new algorithm. The constellation is <em>Phyllotaxis</em> (where each dot belongs), <em>lerp + easing</em> (how it travels there), and <em>Perlin noise</em> (why it never sits perfectly still) layered on top of each other.</p>

<h4>Why ease the arrival?</h4>
<p>A raw <code>lerp(start, target, t)</code> with linear <code>t</code> looks robotic. Running <code>t</code> through a cubic ease (<code>easeInOut</code>) makes every dot accelerate out of chaos and settle gently into the lattice — the difference between "snapping" and "arriving".</p>

<h4>Why add noise after it's formed?</h4>
<p>Once <code>t = 1</code> the shape is static and dead. A small Perlin offset sampled at <code>(x·scale, y·scale + time)</code> gives each dot a slow, <em>coherent</em> wander — neighbours drift together, so the constellation shimmers instead of flickering.</p>

<h4>Make it yours</h4>
<p>Swap the Phyllotaxis target for any point set — a logo's sampled outline, a grid, text glyphs — and the same assemble-then-breathe motion carries over for free.</p>
`;

const PEN_HTML = `<canvas id="c"></canvas>
<div id="ui">
  <button id="reassemble">reassemble</button>
  <label>drift <input id="drift" type="range" min="0" max="40" value="14"></label>
</div>`;

const PEN_CSS = `* { margin: 0; box-sizing: border-box; }
html, body { height: 100%; overflow: hidden; background: #07070d; }
canvas { display: block; width: 100vw; height: 100vh; }
#ui {
  position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 16px; align-items: center;
  background: rgba(8,8,18,0.9); border: 1px solid rgba(120,170,235,0.3);
  border-radius: 10px; padding: 10px 18px;
  font: 12px monospace; color: #a8c6e0;
}
#ui button { background: rgba(100,200,255,0.12); border: 1px solid rgba(100,200,255,0.35);
  color: #bfe3ff; padding: 5px 12px; border-radius: 4px; cursor: pointer; font: inherit; }`;

const PEN_JS = `// ─── canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
function resize(){ canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
addEventListener('resize', () => { resize(); layout(); });
resize();

// ─── Perlin noise (the "drift" field) ────────────────────────────────────────
const perm = (() => {
  const p = Array.from({length:256}, (_,i)=>i);
  for (let i=255;i>0;i--){ const j=Math.random()*(i+1)|0; [p[i],p[j]]=[p[j],p[i]]; }
  return [...p,...p];
})();
const fade = t => t*t*t*(t*(t*6-15)+10);
const lerp = (a,b,t) => a+(b-a)*t;
const grad = (h,x,y) => { h&=3; const u=h<2?x:y, v=h<2?y:x; return ((h&1)?-u:u)+((h&2)?-v:v); };
function perlin2(x,y){
  const X=Math.floor(x)&255, Y=Math.floor(y)&255; x-=Math.floor(x); y-=Math.floor(y);
  const u=fade(x), v=fade(y), a=perm[X]+Y, b=perm[X+1]+Y;
  return lerp(lerp(grad(perm[a],x,y),grad(perm[b],x-1,y),u),
              lerp(grad(perm[a+1],x,y-1),grad(perm[b+1],x-1,y-1),u), v);
}

// ─── motion primitive: lerp through a cubic ease ─────────────────────────────
const easeInOut = t => t<0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
const GOLDEN_ANGLE = 137.50776405003785;

let particles = [], drift = 14, time = 0;
const COUNT = 700;

// Phyllotaxis gives each particle WHERE it belongs.
function layout(){
  const cx = canvas.width/2, cy = canvas.height/2;
  const scale = Math.min(canvas.width, canvas.height) * 0.45 / Math.sqrt(COUNT);
  particles.forEach((p, n) => {
    const theta = n * GOLDEN_ANGLE * Math.PI/180;   // ← the golden angle
    const r = scale * Math.sqrt(n);
    p.tx = cx + r * Math.cos(theta);
    p.ty = cy + r * Math.sin(theta);
  });
}
function reassemble(){
  particles = Array.from({length:COUNT}, (_,n) => ({
    sx: Math.random()*canvas.width, sy: Math.random()*canvas.height,
    tx:0, ty:0, x:0, y:0, t:0, hue: 200 + (n/COUNT)*120,
  }));
  layout();
}
reassemble();

function frame(){
  time += 0.004;
  ctx.fillStyle = 'rgba(7,7,13,0.28)';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for (const p of particles){
    if (p.t < 1) p.t = Math.min(1, p.t + 0.012);
    const e = easeInOut(p.t);
    const baseX = lerp(p.sx, p.tx, e);          // ← assemble via eased lerp
    const baseY = lerp(p.sy, p.ty, e);
    // Perlin drift sampled in a slowly scrolling field → coherent shimmer
    p.x = baseX + perlin2(baseX*0.004, baseY*0.004 + time) * drift;
    p.y = baseY + perlin2(baseX*0.004 + 99, baseY*0.004 + time) * drift;
  }

  // faint constellation links between near neighbours
  ctx.lineWidth = 1;
  for (let i=0;i<particles.length;i+=2){
    const a = particles[i];
    for (let k=1;k<=2;k++){
      const b = particles[i+k]; if (!b) continue;
      const d = Math.hypot(a.x-b.x, a.y-b.y);
      if (d < 48){
        ctx.strokeStyle = \`hsla(\${a.hue},80%,70%,\${(1-d/48)*0.35})\`;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }
  }
  for (const p of particles){
    ctx.fillStyle = \`hsl(\${p.hue},85%,72%)\`;
    ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 7); ctx.fill();
  }
  requestAnimationFrame(frame);
}
frame();

document.getElementById('reassemble').onclick = reassemble;
document.getElementById('drift').oninput = e => drift = +e.target.value;`;

export const PARTICLE_CONSTELLATION_PEN: CodePenPayload = {
  title: "Particle Constellation",
  description:
    "Phyllotaxis + eased lerp + Perlin noise composed together: particles glide from chaos into a golden-angle lattice, then breathe via a coherent noise field.",
  html: PEN_HTML,
  css: PEN_CSS,
  js: PEN_JS,
};

interface P {
  sx: number; sy: number; tx: number; ty: number;
  x: number; y: number; t: number; hue: number;
}

class ParticleConstellation extends Template {
  static t = "Particle Constellation";
  static l = "particle-constellation";
  static f = { keyFunction: () => {}, dependencies: [], functionString: "" };

  private animId = 0;
  private particles: P[] = [];
  private count = 700;
  private drift = 14;
  private time = 0;
  private noise = createPerlin2();
  private panel: HTMLDivElement | null = null;

  init() {
    if (this.cont) (this.cont as HTMLElement).style.position = "relative";
    injectStudioNotes(DESIGN_NOTES);
    this.reassemble();
    this.injectControls();
    this.loop();
  }

  private layout() {
    const cx = this.canvasWidth / 2;
    const cy = this.canvasHeight / 2;
    const scale = (Math.min(this.canvasWidth, this.canvasHeight) * 0.45) / Math.sqrt(this.count);
    this.particles.forEach((p, n) => {
      const theta = (n * GOLDEN_ANGLE * Math.PI) / 180;
      const r = scale * Math.sqrt(n);
      p.tx = cx + r * Math.cos(theta);
      p.ty = cy + r * Math.sin(theta);
    });
  }

  private reassemble() {
    this.particles = Array.from({ length: this.count }, (_, n) => ({
      sx: Math.random() * this.canvasWidth,
      sy: Math.random() * this.canvasHeight,
      tx: 0, ty: 0, x: 0, y: 0, t: 0,
      hue: 200 + (n / this.count) * 120,
    }));
    this.layout();
  }

  private loop() {
    const frame = () => {
      this.animId = requestAnimationFrame(frame);
      const { ctx } = this;
      if (!ctx) return;

      this.time += 0.004;
      ctx.fillStyle = "rgba(7,7,13,0.28)";
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      for (const p of this.particles) {
        if (p.t < 1) p.t = Math.min(1, p.t + 0.012);
        const e = easeInOut(p.t);
        const bx = p.sx + (p.tx - p.sx) * e;
        const by = p.sy + (p.ty - p.sy) * e;
        p.x = bx + this.noise(bx * 0.004, by * 0.004 + this.time) * this.drift;
        p.y = by + this.noise(bx * 0.004 + 99, by * 0.004 + this.time) * this.drift;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < this.particles.length; i += 2) {
        const a = this.particles[i];
        for (let k = 1; k <= 2; k++) {
          const b = this.particles[i + k];
          if (!b) continue;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 48) {
            ctx.strokeStyle = `hsla(${a.hue},80%,70%,${(1 - d / 48) * 0.35})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of this.particles) {
        ctx.fillStyle = `hsl(${p.hue},85%,72%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    frame();
  }

  private injectControls() {
    if (!this.cont) return;
    const panel = makeControlPanel();
    panel.appendChild(makeButton("reassemble", () => this.reassemble()));
    panel.appendChild(
      makeSlider({
        label: "drift", min: 0, max: 40, value: this.drift, step: 1,
        onChange: (v) => (this.drift = v),
      })
    );
    panel.appendChild(
      makeSlider({
        label: "seeds", min: 200, max: 1500, value: this.count, step: 50,
        onChange: (v) => { this.count = v; this.reassemble(); },
      })
    );
    appendCodePenButton(panel, PARTICLE_CONSTELLATION_PEN);
    this.cont.appendChild(panel);
    this.panel = panel;
  }

  resizeHandler = () => {
    if (!this.canvas || !this.cont) return;
    this.canvas.width = this.canvasWidth = this.cont.clientWidth;
    this.canvas.height = this.canvasHeight = this.cont.clientHeight;
    this.halfWidth = this.canvasWidth / 2;
    this.halfHeight = this.canvasHeight / 2;
    this.layout();
  };

  stop() {
    cancelAnimationFrame(this.animId);
    if (this.panel?.parentNode) this.panel.parentNode.removeChild(this.panel);
    super.stop();
  }
}

export default ParticleConstellation;
