import Template from "../../core-animations/animationTemplate";
import { CodePenPayload } from "./codepen";
import {
  injectStudioNotes,
  makeControlPanel,
  makeButton,
  makeSlider,
  appendCodePenButton,
  createPerlin2,
} from "./studioKit";

// ─── Organic Terrain Map ─────────────────────────────────────────────────────
// A static artifact, not a loop: fractal Perlin noise becomes an elevation
// field; hypsometric tints shade it like a real map; marching squares traces
// clean isolines (contours) you can export as SVG. This is the pipeline behind
// game terrain, generative cartography, and topographic data viz.

const DESIGN_NOTES = `
<h4>Fractal noise = believable terrain</h4>
<p>One octave of Perlin noise is too smooth to read as land. Summing several octaves at doubling frequency and halving amplitude (<em>fractal Brownian motion</em>) adds coastline-scale ridges <em>and</em> pebble-scale roughness from the same function.</p>

<h4>Marching squares draws the contours</h4>
<p>For a given elevation, walk the grid cell by cell. Each corner is above or below the threshold — 16 possible corner patterns — and a tiny lookup says which cell edges the contour crosses. Interpolating <em>where</em> on each edge gives smooth isolines instead of stair-steps.</p>

<h4>Why it's a static render, not an animation</h4>
<p>A map doesn't need 60fps. We paint the heightmap into an <code>ImageData</code> buffer once and overlay the contour strokes — cheap, crisp, and identical to what you'd bake to a texture or export.</p>

<h4>Make it yours</h4>
<p>The same contour segments feed the SVG export: each line becomes an SVG <code>&lt;path&gt;</code>. Swap the noise for real elevation data and you've got a topo-map renderer.</p>
`;

// Shared core (used verbatim, just retyped, in the CodePen below).
function fbm(noise: (x: number, y: number) => number, x: number, y: number, octaves: number): number {
  let amp = 1, freq = 1, sum = 0, norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * noise(x * freq, y * freq);
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm; // roughly [-1, 1]
}

function elevationColor(e: number): [number, number, number] {
  // e in [0,1] — deep water → shallows → lowland → highland → snow
  if (e < 0.4) { const t = e / 0.4; return [18 + t * 10, 40 + t * 60, 80 + t * 70]; }
  if (e < 0.5) { const t = (e - 0.4) / 0.1; return [60 + t * 30, 130 + t * 40, 110 - t * 30]; }
  if (e < 0.72) { const t = (e - 0.5) / 0.22; return [70 + t * 60, 150 - t * 30, 70 - t * 10]; }
  if (e < 0.86) { const t = (e - 0.72) / 0.14; return [150 + t * 50, 130 + t * 20, 90 + t * 20]; }
  const t = (e - 0.86) / 0.14; return [210 + t * 45, 210 + t * 45, 215 + t * 40];
}

// Marching squares: emit [x1,y1,x2,y2] segments where `field` crosses `level`.
function contourSegments(
  field: (gx: number, gy: number) => number,
  cols: number, rows: number, cell: number, level: number
): number[][] {
  const segs: number[][] = [];
  const interp = (a: number, b: number) => (level - a) / (b - a);
  for (let gy = 0; gy < rows - 1; gy++) {
    for (let gx = 0; gx < cols - 1; gx++) {
      const tl = field(gx, gy), tr = field(gx + 1, gy);
      const br = field(gx + 1, gy + 1), bl = field(gx, gy + 1);
      let code = 0;
      if (tl > level) code |= 8;
      if (tr > level) code |= 4;
      if (br > level) code |= 2;
      if (bl > level) code |= 1;
      if (code === 0 || code === 15) continue;
      const x = gx * cell, y = gy * cell;
      const top = [x + interp(tl, tr) * cell, y];
      const right = [x + cell, y + interp(tr, br) * cell];
      const bottom = [x + interp(bl, br) * cell, y + cell];
      const left = [x, y + interp(tl, bl) * cell];
      const e: Record<number, number[][][]> = {
        1: [[left, bottom]], 2: [[bottom, right]], 3: [[left, right]],
        4: [[top, right]], 5: [[left, top], [bottom, right]], 6: [[top, bottom]],
        7: [[left, top]], 8: [[top, left]], 9: [[top, bottom]],
        10: [[top, right], [left, bottom]], 11: [[top, right]], 12: [[left, right]],
        13: [[bottom, right]], 14: [[left, bottom]],
      };
      for (const [a, b] of e[code] || []) segs.push([a[0], a[1], b[0], b[1]]);
    }
  }
  return segs;
}

const PEN_HTML = `<canvas id="c"></canvas>
<div id="ui">
  <button id="regen">regenerate</button>
  <label>zoom <input id="zoom" type="range" min="1" max="8" value="3"></label>
  <label>contours <input id="levels" type="range" min="4" max="20" value="10"></label>
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

// ─── Perlin noise ────────────────────────────────────────────────────────────
let perm;
function seed(){ const p=Array.from({length:256},(_,i)=>i);
  for(let i=255;i>0;i--){const j=Math.random()*(i+1)|0;[p[i],p[j]]=[p[j],p[i]];} perm=[...p,...p]; }
seed();
const fade=t=>t*t*t*(t*(t*6-15)+10), lerp=(a,b,t)=>a+(b-a)*t;
const grad=(h,x,y)=>{h&=3;const u=h<2?x:y,v=h<2?y:x;return((h&1)?-u:u)+((h&2)?-v:v);};
function perlin2(x,y){const X=Math.floor(x)&255,Y=Math.floor(y)&255;x-=Math.floor(x);y-=Math.floor(y);
  const u=fade(x),v=fade(y),a=perm[X]+Y,b=perm[X+1]+Y;
  return lerp(lerp(grad(perm[a],x,y),grad(perm[b],x-1,y),u),lerp(grad(perm[a+1],x,y-1),grad(perm[b+1],x-1,y-1),u),v);}

// fractal Brownian motion — the trick that makes noise look like land
function fbm(x,y){let amp=1,freq=1,sum=0,norm=0;
  for(let o=0;o<5;o++){sum+=amp*perlin2(x*freq,y*freq);norm+=amp;amp*=0.5;freq*=2;}
  return (sum/norm)*0.5+0.5;}

let zoom=3, levels=10, scale;
function color(e){
  if(e<0.4){const t=e/0.4;return[18+t*10,40+t*60,80+t*70];}
  if(e<0.5){const t=(e-0.4)/0.1;return[60+t*30,130+t*40,110-t*30];}
  if(e<0.72){const t=(e-0.5)/0.22;return[70+t*60,150-t*30,70-t*10];}
  if(e<0.86){const t=(e-0.72)/0.14;return[150+t*50,130+t*20,90+t*20];}
  const t=(e-0.86)/0.14;return[210+t*45,210+t*45,215+t*40];}

function render(){
  canvas.width=canvas.clientWidth; canvas.height=canvas.clientHeight;
  scale = zoom/Math.min(canvas.width,canvas.height);
  // 1) paint the heightmap pixel by pixel
  const img=ctx.createImageData(canvas.width,canvas.height), d=img.data;
  for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){
    const e=fbm(x*scale,y*scale), [r,g,b]=color(e), i=(y*canvas.width+x)*4;
    d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255;}
  ctx.putImageData(img,0,0);
  // 2) marching-squares contours on a coarse grid
  const cell=6, cols=Math.ceil(canvas.width/cell)+1, rows=Math.ceil(canvas.height/cell)+1;
  const field=(gx,gy)=>fbm(gx*cell*scale,gy*cell*scale);
  ctx.lineWidth=1; ctx.strokeStyle='rgba(20,20,30,0.45)';
  for(let l=1;l<levels;l++){
    const level=l/levels; ctx.beginPath();
    for(let gy=0;gy<rows-1;gy++)for(let gx=0;gx<cols-1;gx++){
      const tl=field(gx,gy),tr=field(gx+1,gy),br=field(gx+1,gy+1),bl=field(gx,gy+1);
      let code=0; if(tl>level)code|=8; if(tr>level)code|=4; if(br>level)code|=2; if(bl>level)code|=1;
      if(code===0||code===15)continue;
      const ip=(a,b)=>(level-a)/(b-a), x=gx*cell,y=gy*cell;
      const T=[x+ip(tl,tr)*cell,y],R=[x+cell,y+ip(tr,br)*cell],B=[x+ip(bl,br)*cell,y+cell],L=[x,y+ip(tl,bl)*cell];
      const E={1:[[L,B]],2:[[B,R]],3:[[L,R]],4:[[T,R]],5:[[L,T],[B,R]],6:[[T,B]],7:[[L,T]],8:[[T,L]],9:[[T,B]],10:[[T,R],[L,B]],11:[[T,R]],12:[[L,R]],13:[[B,R]],14:[[L,B]]};
      for(const [a,b] of E[code]){ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);}
    }
    ctx.stroke();
  }
}
render();
addEventListener('resize', render);
regen.onclick = () => { seed(); render(); };
zoom.oninput = e => { window.zoom = zoom = +e.target.value; render(); };
levels.oninput = e => { window.levels = levels = +e.target.value; render(); };`;

const PEN: CodePenPayload = {
  title: "Organic Terrain Map",
  description:
    "Fractal Perlin noise → hypsometric-tinted heightmap → marching-squares contour lines. The pipeline behind game terrain and generative cartography.",
  html: PEN_HTML,
  css: PEN_CSS,
  js: PEN_JS,
};

class OrganicTerrainMap extends Template {
  static t = "Organic Terrain Map";
  static l = "organic-terrain-map";
  static f = { keyFunction: () => {}, dependencies: [], functionString: "" };

  private noise = createPerlin2();
  private zoom = 3;
  private levels = 10;
  private octaves = 5;
  private scale = 0.003;
  private lastSegments: { level: number; segs: number[][] }[] = [];
  private panel: HTMLDivElement | null = null;

  init() {
    if (this.cont) (this.cont as HTMLElement).style.position = "relative";
    injectStudioNotes(DESIGN_NOTES);
    this.injectControls();
    this.render();
  }

  private height01(x: number, y: number): number {
    return fbm(this.noise, x, y, this.octaves) * 0.5 + 0.5;
  }

  private render() {
    const { ctx, canvas } = this;
    if (!ctx || !canvas) return;
    const W = (canvas.width = this.canvasWidth = this.cont!.clientWidth);
    const H = (canvas.height = this.canvasHeight = this.cont!.clientHeight);
    this.scale = this.zoom / Math.min(W, H);

    const img = ctx.createImageData(W, H);
    const d = img.data;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const e = this.height01(x * this.scale, y * this.scale);
        const [r, g, b] = elevationColor(e);
        const i = (y * W + x) * 4;
        d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);

    const cell = 6;
    const cols = Math.ceil(W / cell) + 1;
    const rows = Math.ceil(H / cell) + 1;
    const field = (gx: number, gy: number) => this.height01(gx * cell * this.scale, gy * cell * this.scale);

    this.lastSegments = [];
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(20,20,30,0.45)";
    for (let l = 1; l < this.levels; l++) {
      const level = l / this.levels;
      const segs = contourSegments(field, cols, rows, cell, level);
      this.lastSegments.push({ level, segs });
      ctx.beginPath();
      for (const [x1, y1, x2, y2] of segs) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();
    }
  }

  private downloadSVG() {
    const W = this.canvasWidth, H = this.canvasHeight;
    let paths = "";
    for (const { segs } of this.lastSegments) {
      let d = "";
      for (const [x1, y1, x2, y2] of segs) {
        d += `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
      }
      paths += `<path d="${d}" fill="none" stroke="#1a2030" stroke-width="1"/>`;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#0a1622"/>${paths}</svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "terrain-contours.svg";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  private injectControls() {
    if (!this.cont) return;
    const panel = makeControlPanel();
    panel.appendChild(makeButton("regenerate", () => { this.noise = createPerlin2(); this.render(); }));
    panel.appendChild(makeSlider({
      label: "zoom", min: 1, max: 8, value: this.zoom, step: 1,
      onChange: (v) => { this.zoom = v; this.render(); },
    }));
    panel.appendChild(makeSlider({
      label: "contours", min: 4, max: 24, value: this.levels, step: 1,
      onChange: (v) => { this.levels = v; this.render(); },
    }));
    panel.appendChild(makeButton("download SVG", () => this.downloadSVG()));
    appendCodePenButton(panel, PEN);
    this.cont.appendChild(panel);
    this.panel = panel;
  }

  resizeHandler = () => {
    if (!this.canvas || !this.cont) return;
    this.render();
  };

  stop() {
    if (this.panel?.parentNode) this.panel.parentNode.removeChild(this.panel);
    super.stop();
  }
}

export default OrganicTerrainMap;
