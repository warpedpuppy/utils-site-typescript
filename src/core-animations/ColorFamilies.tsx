import AnimationBaseClass from "./AnimationBaseClass";
import { HueFamily, colorFamily, rgbToCss } from "@utilspalooza/core/Color";
import { colorFamilyFormula } from "../pages/createJSON/formulas/usefulLittleThings/ColorFamily";

const ELI5 = `<h3>A "family" of color is just a slice of the wheel.</h3>
<p>Every color has a <b>hue</b> — its angle (0–360°) on the color wheel. Reds sit
near 0°, greens around 120°, blues around 220°. Pin the hue to a narrow band and
everything inside it reads as the same family: <i>all blues</i>, <i>all greens</i>.</p>
<p>Pick a family below. <code>colorFamily("blue", n)</code> walks the hue evenly
across that band (and arcs the lightness up through the middle) to hand you an
ordered <b>range</b> of that color — the grown-up version of "give me a random blue."</p>`;

/**
 * Pure renderer: a centered grid of rounded swatches. Library-free (CodePen-portable).
 * `topInset` reserves vertical space for the absolutely-positioned ELI5 text that the
 * site overlays on the top-left of the canvas, so swatches start beneath it.
 */
function drawColorFamily(
  ctx: any,
  colors: string[],
  family: string,
  canvasWidth: number,
  canvasHeight: number,
  topInset: number
): void {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const n = colors.length;
  const cols = Math.max(1, Math.min(n, Math.round(Math.sqrt(n * (canvasWidth / Math.max(1, canvasHeight))))));
  const rows = Math.ceil(n / cols);

  const padX = 24;
  const padTop = Math.max(16, topInset); // clear the ELI5 text overlay floating over the top
  const padBottom = 34;                  // room for the label at the bottom
  const gap = 10;
  const cellW = (canvasWidth - padX * 2 - gap * (cols - 1)) / cols;
  const cellH = (canvasHeight - padTop - padBottom - gap * (rows - 1)) / rows;
  const size = Math.max(8, Math.min(cellW, cellH));
  const radius = Math.min(14, size * 0.22);

  // Center the whole grid.
  const gridW = cols * size + (cols - 1) * gap;
  const gridH = rows * size + (rows - 1) * gap;
  const startX = (canvasWidth - gridW) / 2;
  // Center within the area below the header, but never let the grid ride up into it.
  const startY = padTop + Math.max(0, (canvasHeight - padTop - padBottom - gridH) / 2);

  const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  for (let i = 0; i < n; i++) {
    const c = i % cols;
    const rrow = Math.floor(i / cols);
    const x = startX + c * (size + gap);
    const y = startY + rrow * (size + gap);
    roundRect(x, y, size, size, radius);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(0,0,0,0.18)";
    ctx.stroke();
  }

  // Label at the bottom, clear of the ELI5 overlay at the top.
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "13px monospace";
  ctx.fillText(`colorFamily("${family}", ${colors.length})`, 18, canvasHeight - 12);
}

export { drawColorFamily };

class ColorFamiliesAnimation extends AnimationBaseClass {
  static t = "color families (pick a range by name)";
  static l = "color-families";
  static f = colorFamilyFormula;
  title = "color families (pick a range by name)";
  animationObject = colorFamilyFormula;

  families: HueFamily[] = ["all", "red", "orange", "yellow", "green", "cyan", "blue", "purple", "pink"];
  family: HueFamily = "all";
  count = 36;
  colors: string[] = [];

  // Static content draws once; redraw after the base resize handler resizes the canvas.
  private _redraw = () => { if (this.ctx) this.draw(); };

  init() {
    if (this.textDiv) this.textDiv.innerHTML = ELI5;
    this.buildColors();
    this.draw();
    window.addEventListener("resize", this._redraw);
  }

  buildColors = () => {
    this.colors = colorFamily(this.family, this.count).map(rgbToCss);
  };

  draw = () => {
    if (!this.ctx) return;
    // Reserve room for the ELI5 text the site overlays on the top-left of the canvas.
    // Read its actual rendered height so the grid clears it at any width (clamped to half).
    const textH = this.textDiv?.offsetHeight ?? 0;
    const topInset = Math.min(this.canvasHeight * 0.5, textH + 16);
    drawColorFamily(this.ctx, this.colors, this.family, this.canvasWidth, this.canvasHeight, topInset);
  };

  colorChangeHandler = (family: HueFamily) => {
    this.family = family;
    this.buildColors();
    this.draw();
  };

  extraHTML = () => {
    return (
      <div className="extra-html">
        {this.families.map((family, i) => (
          <button
            key={`family-${i}`}
            className="btn-primary"
            onClick={() => this.colorChangeHandler(family)}
          >
            {family}
          </button>
        ))}
      </div>
    );
  };

  stop() {
    window.removeEventListener("resize", this._redraw);
    super.stop();
  }

  pointerDownHandler(_e: PointerEvent) {}
  pointerMoveHandler(_e: PointerEvent) {}
  pointerUpHandler(_e: PointerEvent) {}
}

export default ColorFamiliesAnimation;
