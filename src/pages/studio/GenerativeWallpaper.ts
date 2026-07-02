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

// ─── Generative Wallpaper ────────────────────────────────────────────────────
// A repeating pattern built from Bézier "petals". Each grid cell draws a small
// flower whose angle / size / hue come from a Perlin sample at the cell centre.
// The whole thing tiles *seamlessly* because every cell is clipped to its own
// box — nothing crosses a seam — so the canvas repeats edge-to-edge. Export to
// PNG and drop it straight into a CSS `background`.

const DESIGN_NOTES = `
<h4>Bézier petals</h4>
<p>Each petal is two cubic Bézier curves sharing endpoints — a lens shape. Bézier control points give you organic, resolution-independent curves with four numbers, which is why fonts and vector tools use them.</p>

<h4>Perlin picks the variation</h4>
<p>Per-cell angle, scale, and hue are read from a Perlin field sampled at the cell centre. Because nearby cells sample nearby noise, the variation flows across the pattern instead of looking like static.</p>

<h4>Why it tiles seamlessly</h4>
<p>The seam problem in generative patterns is content crossing the edge. We sidestep it: each cell is <code>clip()</code>-ped to its own box, so a tile's right edge always matches the next tile's left edge. Any per-cell randomness is safe.</p>

<h4>Make it yours</h4>
<p>"Download PNG" exports the canvas; the "tile preview" shrinks and repeats it 3×3 so you can confirm the seams before shipping it as a wallpaper or CSS background.</p>
`;

function drawPetal(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, len: number, wid: number, angle: number, fill: string
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(-len, 0);
  ctx.bezierCurveTo(-len * 0.3, -wid, len * 0.3, -wid, len, 0); // top edge
  ctx.bezierCurveTo(len * 0.3, wid, -len * 0.3, wid, -len, 0); // bottom edge
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();
}

const PEN_HTML = `<canvas id="c"></canvas>
<div id="ui">
  <button id="regen">regenerate</button>
  <label>cell <input id="cell" type="range" min="40" max="160" value="90"></label>
  <label>hue <input id="hue" type="range" min="0" max="360" value="280"></label>
  <button id="png">download PNG</button>
</div>`;

const PEN_CSS = `* { margin: 0; box-sizing: border-box; }
html, body { height: 100%; overflow: hidden; }
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

// ─── one Bézier petal (lens of two cubic curves) ─────────────────────────────
function petal(cx,cy,len,wid,angle,fill){
  ctx.save(); ctx.translate(cx,cy); ctx.rotate(angle); ctx.beginPath();
  ctx.moveTo(-len,0);
  ctx.bezierCurveTo(-len*0.3,-wid, len*0.3,-wid, len,0);
  ctx.bezierCurveTo(len*0.3, wid,-len*0.3, wid,-len,0);
  ctx.closePath(); ctx.fillStyle=fill; ctx.fill(); ctx.restore();
}

let cell=90, baseHue=280;
function render(){
  canvas.width=canvas.clientWidth; canvas.height=canvas.clientHeight;
  ctx.fillStyle = \`hsl(\${baseHue},35%,12%)\`;
  ctx.fillRect(0,0,canvas.width,canvas.height);
  const cols=Math.ceil(canvas.width/cell), rows=Math.ceil(canvas.height/cell);
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
    const cx=i*cell+cell/2, cy=j*cell+cell/2;
    const n = perlin2(i*0.35, j*0.35);            // ← Perlin drives the variation
    const angle = n*Math.PI*2;
    const petals = 3 + Math.floor((perlin2(i*0.35+50,j*0.35)+1)*2.5);
    ctx.save();
    ctx.beginPath(); ctx.rect(i*cell,j*cell,cell,cell); ctx.clip(); // ← keeps tiling seamless
    for(let k=0;k<petals;k++){
      const a = angle + k*(Math.PI*2/petals);
      const hue = (baseHue + n*60 + k*8 + 360)%360;
      petal(cx,cy, cell*0.42, cell*0.14, a, \`hsla(\${hue},70%,\${55+n*15}%,0.85)\`);
    }
    ctx.fillStyle = \`hsl(\${(baseHue+180)%360},80%,75%)\`;
    ctx.beginPath(); ctx.arc(cx,cy,cell*0.06,0,7); ctx.fill();
    ctx.restore();
  }
}
render();
addEventListener('resize', render);
regen.onclick = () => { seed(); render(); };
cell.oninput = e => { window.cell = cell = +e.target.value; render(); };
hue.oninput = e => { window.baseHue = baseHue = +e.target.value; render(); };
png.onclick = () => { const a=document.createElement('a'); a.download='wallpaper.png'; a.href=canvas.toDataURL(); a.click(); };`;

export const GENERATIVE_WALLPAPER_PEN: CodePenPayload = {
  title: "Generative Wallpaper",
  description:
    "Seamlessly tileable pattern: Bézier petals per grid cell, varied by a Perlin field, colored with HSL math. Clipping each cell keeps the seams invisible. Download PNG and drop into a CSS background.",
  html: PEN_HTML,
  css: PEN_CSS,
  js: PEN_JS,
};

class GenerativeWallpaper extends Template {
  static t = "Generative Wallpaper";
  static l = "generative-wallpaper";
  static f = { keyFunction: () => {}, dependencies: [], functionString: "" };

  private noise = createPerlin2();
  private cell = 90;
  private baseHue = 280;
  private tilePreview = false;
  private panel: HTMLDivElement | null = null;

  init() {
    if (this.cont) (this.cont as HTMLElement).style.position = "relative";
    injectStudioNotes(DESIGN_NOTES);
    this.injectControls();
    this.render();
  }

  // Render the pattern into an arbitrary context at a given size.
  private paint(ctx: CanvasRenderingContext2D, W: number, H: number, cell: number) {
    ctx.fillStyle = `hsl(${this.baseHue},35%,12%)`;
    ctx.fillRect(0, 0, W, H);
    const cols = Math.ceil(W / cell);
    const rows = Math.ceil(H / cell);
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const cx = i * cell + cell / 2;
        const cy = j * cell + cell / 2;
        const n = this.noise(i * 0.35, j * 0.35);
        const angle = n * Math.PI * 2;
        const petals = 3 + Math.floor((this.noise(i * 0.35 + 50, j * 0.35) + 1) * 2.5);
        ctx.save();
        ctx.beginPath();
        ctx.rect(i * cell, j * cell, cell, cell);
        ctx.clip();
        for (let k = 0; k < petals; k++) {
          const a = angle + k * ((Math.PI * 2) / petals);
          const hue = (this.baseHue + n * 60 + k * 8 + 360) % 360;
          drawPetal(ctx, cx, cy, cell * 0.42, cell * 0.14, a, `hsla(${hue},70%,${55 + n * 15}%,0.85)`);
        }
        ctx.fillStyle = `hsl(${(this.baseHue + 180) % 360},80%,75%)`;
        ctx.beginPath();
        ctx.arc(cx, cy, cell * 0.06, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  private render() {
    const { ctx, canvas } = this;
    if (!ctx || !canvas) return;
    const W = (canvas.width = this.canvasWidth = this.cont!.clientWidth);
    const H = (canvas.height = this.canvasHeight = this.cont!.clientHeight);

    if (this.tilePreview) {
      // Render one tile to an offscreen canvas, then repeat it 3×3 to prove the seam.
      const tile = document.createElement("canvas");
      tile.width = Math.ceil(W / 3);
      tile.height = Math.ceil(H / 3);
      const tctx = tile.getContext("2d")!;
      this.paint(tctx, tile.width, tile.height, this.cell / 3);
      for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) ctx.drawImage(tile, x * tile.width, y * tile.height);
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      for (let x = 1; x < 3; x++) { ctx.beginPath(); ctx.moveTo(x * tile.width, 0); ctx.lineTo(x * tile.width, H); ctx.stroke(); }
      for (let y = 1; y < 3; y++) { ctx.beginPath(); ctx.moveTo(0, y * tile.height); ctx.lineTo(W, y * tile.height); ctx.stroke(); }
    } else {
      this.paint(ctx, W, H, this.cell);
    }
  }

  private downloadPNG() {
    if (!this.canvas) return;
    const a = document.createElement("a");
    a.download = "wallpaper.png";
    a.href = this.canvas.toDataURL("image/png");
    a.click();
  }

  private injectControls() {
    if (!this.cont) return;
    const panel = makeControlPanel();
    panel.appendChild(makeButton("regenerate", () => { this.noise = createPerlin2(); this.render(); }));
    panel.appendChild(makeSlider({
      label: "cell", min: 40, max: 180, value: this.cell, step: 5,
      onChange: (v) => { this.cell = v; this.render(); },
    }));
    panel.appendChild(makeSlider({
      label: "hue", min: 0, max: 360, value: this.baseHue, step: 5,
      onChange: (v) => { this.baseHue = v; this.render(); },
    }));
    const tileBtn = makeButton("tile preview: off", () => {
      this.tilePreview = !this.tilePreview;
      tileBtn.textContent = this.tilePreview ? "tile preview: on" : "tile preview: off";
      this.render();
    });
    panel.appendChild(tileBtn);
    panel.appendChild(makeButton("download PNG", () => this.downloadPNG()));
    appendCodePenButton(panel, GENERATIVE_WALLPAPER_PEN);
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

export default GenerativeWallpaper;
