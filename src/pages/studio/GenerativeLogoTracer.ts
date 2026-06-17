import Template from "../../core-animations/animationTemplate";
import { CodePenPayload } from "./codepen";
import {
  injectStudioNotes,
  makeControlPanel,
  makeButton,
  makeSlider,
  appendCodePenButton,
} from "./studioKit";

// ─── Generative Logo Tracer ──────────────────────────────────────────────────
// The "wow" demo that ties two site concepts together: a shape is authored as
// Bézier curves (how every font/SVG path is stored), sampled into points, then
// run through a Discrete Fourier Transform. The DFT coefficients become a chain
// of rotating circles (epicycles) that redraw the original outline. Fewer
// circles = a looser approximation — you can watch detail appear as you add them.

const DESIGN_NOTES = `
<h4>Bézier in, Fourier out</h4>
<p>The source shape is a list of cubic Bézier segments — exactly how an SVG <code>&lt;path&gt;</code> or a font glyph is defined. We sample each curve with de Casteljau into evenly spaced points, then treat each point as a complex number <code>x + iy</code>.</p>

<h4>What the DFT gives you</h4>
<p>The DFT turns those points into a set of <em>rotating vectors</em>: each has a frequency, a radius (amplitude), and a starting phase. Sorted biggest-first and chained tip-to-tail, they re-draw the outline as the chain spins — the famous epicycle trick.</p>

<h4>Why the "circles" slider teaches the transform</h4>
<p>Keep only the largest N vectors and you get a band-limited approximation: a handful of circles capture the gross shape, more circles recover the sharp corners. That's lossy compression and the Fourier idea in one slider.</p>

<h4>Make it yours</h4>
<p>Swap the preset's Bézier list for points sampled from <em>any</em> SVG path (a real logo) and the same machine traces it.</p>
`;

// de Casteljau sample of a cubic Bézier
function cubic(p0: number[], p1: number[], p2: number[], p3: number[], t: number): number[] {
  const mt = 1 - t;
  const a = mt * mt * mt, b = 3 * mt * mt * t, c = 3 * mt * t * t, d = t * t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
}

// Each preset is a closed loop of cubic Bézier segments [p0,p1,p2,p3].
const PRESETS: Record<string, number[][][]> = {
  heart: [
    [[0, -30], [28, -58], [62, -28], [0, 36]],
    [[0, 36], [-62, -28], [-28, -58], [0, -30]],
  ],
  star: (() => {
    const segs: number[][][] = [];
    const pts: number[][] = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? 60 : 24;
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      pts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
    for (let i = 0; i < pts.length; i++) {
      const p0 = pts[i], p3 = pts[(i + 1) % pts.length];
      segs.push([p0, [p0[0] + (p3[0] - p0[0]) / 3, p0[1] + (p3[1] - p0[1]) / 3],
        [p0[0] + (2 * (p3[0] - p0[0])) / 3, p0[1] + (2 * (p3[1] - p0[1])) / 3], p3]);
    }
    return segs;
  })(),
};

function samplePath(segs: number[][][], perSeg: number): { re: number; im: number }[] {
  const pts: { re: number; im: number }[] = [];
  for (const [p0, p1, p2, p3] of segs) {
    for (let i = 0; i < perSeg; i++) {
      const [x, y] = cubic(p0, p1, p2, p3, i / perSeg);
      pts.push({ re: x, im: y });
    }
  }
  return pts;
}

interface Vec { freq: number; amp: number; phase: number; }

function dft(x: { re: number; im: number }[]): Vec[] {
  const N = x.length;
  const out: Vec[] = [];
  for (let k = 0; k < N; k++) {
    let re = 0, im = 0;
    for (let n = 0; n < N; n++) {
      const phi = (2 * Math.PI * k * n) / N;
      const c = Math.cos(phi), s = Math.sin(phi);
      re += x[n].re * c + x[n].im * s;
      im += -x[n].re * s + x[n].im * c;
    }
    re /= N; im /= N;
    out.push({ freq: k, amp: Math.hypot(re, im), phase: Math.atan2(im, re) });
  }
  return out.sort((a, b) => b.amp - a.amp);
}

const PEN_HTML = `<canvas id="c"></canvas>
<div id="ui">
  <button id="preset">shape: heart</button>
  <label>circles <input id="circles" type="range" min="2" max="80" value="40"></label>
  <label>speed <input id="speed" type="range" min="1" max="40" value="12"></label>
</div>`;

const PEN_CSS = `* { margin: 0; box-sizing: border-box; }
html, body { height: 100%; overflow: hidden; background: #07070d; }
canvas { display: block; width: 100vw; height: 100vh; }
#ui { position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 16px; align-items: center; background: rgba(8,8,18,0.9);
  border: 1px solid rgba(120,170,235,0.3); border-radius: 10px; padding: 10px 18px;
  font: 12px monospace; color: #a8c6e0; }
#ui button { background: rgba(100,200,255,0.12); border: 1px solid rgba(100,200,255,0.35);
  color: #bfe3ff; padding: 5px 12px; border-radius: 4px; cursor: pointer; font: inherit; }`;

const PEN_JS = `const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
function resize(){ canvas.width=canvas.clientWidth; canvas.height=canvas.clientHeight; } resize();
addEventListener('resize', resize);

// ─── Bézier source shapes (like an SVG path) ─────────────────────────────────
const cubic=(p0,p1,p2,p3,t)=>{const m=1-t,a=m*m*m,b=3*m*m*t,c=3*m*t*t,d=t*t*t;
  return [a*p0[0]+b*p1[0]+c*p2[0]+d*p3[0], a*p0[1]+b*p1[1]+c*p2[1]+d*p3[1]];};
const SHAPES = {
  heart: [[[0,-30],[28,-58],[62,-28],[0,36]],[[0,36],[-62,-28],[-28,-58],[0,-30]]],
  star: (()=>{const pts=[];for(let i=0;i<10;i++){const r=i%2?24:60,a=i/10*6.283-1.571;pts.push([Math.cos(a)*r,Math.sin(a)*r]);}
    return pts.map((p0,i)=>{const p3=pts[(i+1)%pts.length];
      return [p0,[p0[0]+(p3[0]-p0[0])/3,p0[1]+(p3[1]-p0[1])/3],[p0[0]+2*(p3[0]-p0[0])/3,p0[1]+2*(p3[1]-p0[1])/3],p3];});})(),
};
function sample(segs,per){const o=[];for(const[a,b,c,d] of segs)for(let i=0;i<per;i++){const[x,y]=cubic(a,b,c,d,i/per);o.push({re:x,im:y});}return o;}

// ─── Discrete Fourier Transform → rotating vectors ───────────────────────────
function dft(x){const N=x.length,out=[];
  for(let k=0;k<N;k++){let re=0,im=0;
    for(let n=0;n<N;n++){const p=2*Math.PI*k*n/N,c=Math.cos(p),s=Math.sin(p);
      re+=x[n].re*c+x[n].im*s; im+=-x[n].re*s+x[n].im*c;}
    re/=N;im/=N; out.push({freq:k,amp:Math.hypot(re,im),phase:Math.atan2(im,re)});}
  return out.sort((a,b)=>b.amp-a.amp);}

let shape='heart', circles=40, speed=12, vectors=[], N=0, t=0, trail=[];
function build(){
  const pts = sample(SHAPES[shape],28).map(p=>({re:p.re*2.6,im:p.im*2.6}));
  N = pts.length; vectors = dft(pts); trail=[]; t=0;
}
build();

function frame(){
  ctx.fillStyle='#07070d'; ctx.fillRect(0,0,canvas.width,canvas.height);
  let x=canvas.width/2, y=canvas.height/2;
  const n=Math.min(circles, vectors.length);
  for(let i=0;i<n;i++){
    const v=vectors[i], px=x, py=y;
    x += v.amp*Math.cos(v.freq*t+v.phase);
    y += v.amp*Math.sin(v.freq*t+v.phase);
    ctx.strokeStyle='rgba(140,180,255,0.18)'; ctx.beginPath(); ctx.arc(px,py,v.amp,0,7); ctx.stroke();
    ctx.strokeStyle='rgba(200,220,255,0.5)'; ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(x,y); ctx.stroke();
  }
  trail.unshift([x,y]); if(trail.length>N) trail.pop();
  ctx.strokeStyle='#ff5fa2'; ctx.lineWidth=2; ctx.beginPath();
  trail.forEach((p,i)=> i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])); ctx.stroke(); ctx.lineWidth=1;
  t += (2*Math.PI/N) * (speed/12) * 6;   // one full loop every N/(speed factor) frames
  requestAnimationFrame(frame);
}
frame();

preset.onclick = () => { shape = shape==='heart'?'star':'heart'; preset.textContent='shape: '+shape; build(); };
circles.oninput = e => circles = +e.target.value;
speed.oninput = e => speed = +e.target.value;`;

const PEN: CodePenPayload = {
  title: "Generative Logo Tracer",
  description:
    "Author a shape as Bézier curves, sample it, run a DFT, and watch a chain of rotating circles (epicycles) redraw the outline. The 'circles' slider is band-limited Fourier in action.",
  html: PEN_HTML,
  css: PEN_CSS,
  js: PEN_JS,
};

class GenerativeLogoTracer extends Template {
  static t = "Generative Logo Tracer";
  static l = "generative-logo-tracer";
  static f = { keyFunction: () => {}, dependencies: [], functionString: "" };

  private animId = 0;
  private shape: keyof typeof PRESETS = "heart";
  private circles = 40;
  private speed = 12;
  private scaleFactor = 2.6;
  private samplesPerSeg = 28;
  private vectors: Vec[] = [];
  private trail: number[][] = [];
  private t = 0;
  private panel: HTMLDivElement | null = null;

  init() {
    if (this.cont) (this.cont as HTMLElement).style.position = "relative";
    injectStudioNotes(DESIGN_NOTES);
    this.build();
    this.injectControls();
    this.loop();
  }

  private sampleCount() {
    return PRESETS[this.shape].length * this.samplesPerSeg;
  }

  private build() {
    const pts = samplePath(PRESETS[this.shape], this.samplesPerSeg).map((p) => ({
      re: p.re * this.scaleFactor,
      im: p.im * this.scaleFactor,
    }));
    this.vectors = dft(pts);
    this.trail = [];
    this.t = 0;
  }

  private loop() {
    const frame = () => {
      this.animId = requestAnimationFrame(frame);
      const { ctx } = this;
      if (!ctx) return;

      ctx.fillStyle = "#07070d";
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      let x = this.canvasWidth / 2;
      let y = this.canvasHeight / 2;
      const n = Math.min(this.circles, this.vectors.length);
      for (let i = 0; i < n; i++) {
        const v = this.vectors[i];
        const px = x, py = y;
        x += v.amp * Math.cos(v.freq * this.t + v.phase);
        y += v.amp * Math.sin(v.freq * this.t + v.phase);
        ctx.strokeStyle = "rgba(140,180,255,0.16)";
        ctx.beginPath();
        ctx.arc(px, py, v.amp, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "rgba(200,220,255,0.5)";
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      this.trail.unshift([x, y]);
      if (this.trail.length > this.sampleCount()) this.trail.pop();
      ctx.strokeStyle = "#ff5fa2";
      ctx.lineWidth = 2;
      ctx.beginPath();
      this.trail.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.stroke();
      ctx.lineWidth = 1;

      // advance one full loop over `sampleCount` frames, scaled by speed
      this.t += ((2 * Math.PI) / this.sampleCount()) * (this.speed / 12) * 6;
    };
    frame();
  }

  private injectControls() {
    if (!this.cont) return;
    const panel = makeControlPanel();
    const presetBtn = makeButton("shape: heart", () => {
      this.shape = this.shape === "heart" ? "star" : "heart";
      presetBtn.textContent = "shape: " + this.shape;
      this.build();
    });
    panel.appendChild(presetBtn);
    panel.appendChild(makeSlider({
      label: "circles", min: 2, max: 80, value: this.circles, step: 1,
      onChange: (v) => (this.circles = v),
    }));
    panel.appendChild(makeSlider({
      label: "speed", min: 1, max: 40, value: this.speed, step: 1,
      onChange: (v) => (this.speed = v),
    }));
    appendCodePenButton(panel, PEN);
    this.cont.appendChild(panel);
    this.panel = panel;
  }

  stop() {
    cancelAnimationFrame(this.animId);
    if (this.panel?.parentNode) this.panel.parentNode.removeChild(this.panel);
    super.stop();
  }
}

export default GenerativeLogoTracer;
