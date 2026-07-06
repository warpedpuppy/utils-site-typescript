import AnimationBaseClass from "./AnimationBaseClass";
import { RGB, lerpColor, lerpColorHsl, rgbToCss } from "@utilspalooza/core/Color";
import { lerpColor as lerpColorFormula } from "../pages/createJSON/formulas/usefulLittleThings/LerpColor";

const ELI5 = `<h3>Two ways to blend the same two colors.</h3>
<p>The <b>top</b> bar mixes the red, green and blue channels straight across
(<code>lerpColor</code>). It looks obvious — but blend two opposite colors like
blue and yellow and the middle turns to <b>mud</b>: equal channels means gray.</p>
<p>The <b>bottom</b> bar blends through <b>HSL</b> instead
(<code>lerpColorHsl</code>), rotating the hue around the color wheel. Same start
and end, but it stays <b>vivid</b> the whole way. Watch the two big swatches as the
marker crosses the middle — that's the whole lesson.</p>
<p>Pick your own start/end colors below. Complementary pairs show the difference best.</p>`;

/**
 * Pure renderer: two stacked gradient bars (RGB-lerp on top, HSL-lerp below) with
 * a sweeping playhead and a magnified swatch from each bar at the playhead.
 * Takes pre-sampled CSS color strings so it stays free of any library import
 * (CodePen-portable, like the other drawX functions).
 */
function drawColorLerp(
  ctx: CanvasRenderingContext2D,
  rgbStops: string[],
  hslStops: string[],
  t: number,
  canvasWidth: number,
  canvasHeight: number
): void {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const margin = Math.min(70, canvasWidth * 0.08);
  const barW = canvasWidth - margin * 2;
  const barH = Math.min(96, canvasHeight * 0.2);
  const gap = Math.min(96, canvasHeight * 0.16);
  const x0 = margin;
  const rgbY = canvasHeight / 2 - barH - gap / 2;
  const hslY = canvasHeight / 2 + gap / 2;

  const drawBar = (stops: string[], y: number, label: string) => {
    const n = stops.length;
    const sw = barW / n;
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = stops[i];
      ctx.fillRect(x0 + i * sw, y, Math.ceil(sw) + 1, barH);
    }
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x0, y, barW, barH);
    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.font = "13px monospace";
    ctx.fillText(label, x0, y - 10);
  };

  const drawSwatch = (cx: number, cy: number, color: string, caption: string) => {
    const r = 26;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "11px monospace";
    ctx.textAlign = "center";
    ctx.fillText(caption, cx, cy + r + 16);
    ctx.textAlign = "left";
  };

  drawBar(rgbStops, rgbY, "RGB lerp — straight channel blend (goes muddy)");
  drawBar(hslStops, hslY, "HSL lerp — rotate hue around the wheel (stays vivid)");

  // Sweeping playhead spanning both bars.
  const px = x0 + barW * t;
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px, rgbY - 4);
  ctx.lineTo(px, hslY + barH + 4);
  ctx.stroke();

  // Magnified current color from each bar at the playhead.
  const idx = Math.round(t * (rgbStops.length - 1));
  const clampX = Math.max(x0 + 30, Math.min(px, x0 + barW - 30));
  drawSwatch(clampX, rgbY - 46, rgbStops[idx], "RGB");
  drawSwatch(clampX, hslY + barH + 50, hslStops[idx], "HSL");

  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "12px monospace";
  ctx.fillText(`t: ${t.toFixed(2)}`, x0, canvasHeight - 12);
}

export { drawColorLerp };

class ColorLerpAnimation extends AnimationBaseClass {
  static t = "color lerp (RGB vs HSL)";
  static l = "color-lerp";
  static f = lerpColorFormula;
  title = "color lerp (RGB vs HSL)";
  animationObject = lerpColorFormula;

  hexA = "#2563eb"; // blue
  hexB = "#facc15"; // yellow
  steps = 64;
  rgbStops: string[] = [];
  hslStops: string[] = [];

  t = 0;
  dir = 1;

  init() {
    if (this.textDiv) this.textDiv.innerHTML = ELI5;
    this.buildStops();
    this.draw();
  }

  hexToRgb = (hex: string): RGB => {
    const m = hex.replace("#", "");
    return {
      r: parseInt(m.slice(0, 2), 16),
      g: parseInt(m.slice(2, 4), 16),
      b: parseInt(m.slice(4, 6), 16),
    };
  };

  buildStops = () => {
    const a = this.hexToRgb(this.hexA);
    const b = this.hexToRgb(this.hexB);
    this.rgbStops = [];
    this.hslStops = [];
    for (let i = 0; i < this.steps; i++) {
      const t = i / (this.steps - 1);
      this.rgbStops.push(rgbToCss(lerpColor(a, b, t)));
      this.hslStops.push(rgbToCss(lerpColorHsl(a, b, t)));
    }
  };

  draw = () => {
    if (!this.ctx) return;

    // Ping-pong the playhead back and forth across the bars.
    this.t += 0.005 * this.dir;
    if (this.t >= 1) { this.t = 1; this.dir = -1; }
    else if (this.t <= 0) { this.t = 0; this.dir = 1; }

    drawColorLerp(this.ctx, this.rgbStops, this.hslStops, this.t, this.canvasWidth, this.canvasHeight);
    this.raf(this.draw);
  };

  extraHTML = () => {
    return (
      <div className="extra-html">
        <label style={{ marginRight: 8 }}>start:</label>
        <input
          type="color"
          defaultValue={this.hexA}
          style={{ verticalAlign: "middle", marginRight: 18 }}
          onChange={(e) => { this.hexA = e.currentTarget.value; this.buildStops(); }}
        />
        <label style={{ marginRight: 8 }}>end:</label>
        <input
          type="color"
          defaultValue={this.hexB}
          style={{ verticalAlign: "middle" }}
          onChange={(e) => { this.hexB = e.currentTarget.value; this.buildStops(); }}
        />
      </div>
    );
  };

  pointerDownHandler(_e: PointerEvent) {}
  pointerMoveHandler(_e: PointerEvent) {}
  pointerUpHandler(_e: PointerEvent) {}
}

export default ColorLerpAnimation;
