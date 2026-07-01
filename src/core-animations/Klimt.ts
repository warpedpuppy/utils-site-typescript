import Template from "./animationTemplate";
import { CollisionDetectionObject } from "../types/types";

const BG = "#0a0705";
const COLORS = [
  0xffd700, // gold
  0xdaa520, // goldenrod
  0xb8860b, // dark goldenrod
  0xcd853f, // bronze
  0xb87333, // copper
  0xf0e68c, // pale gold
  0x8b6914, // antique gold
  0x191970, // midnight blue (Klimt shadow tones)
  0x4b0082, // deep indigo
  0x8b0000, // dark red
];
const CURVES = [45, -45, 135, -135];
const CURVED_QS = [85, 150] as const;
const TILE_Q = 260;
const BRICK_W = 18;
const BRICK_H = 9;
const BRICK_ALPHA = 0.24;

type Quadrant = "TL" | "TR" | "BL" | "BR";

interface Brick {
  x: number;
  y: number;
  rotation: number;
  color: string;
  placed: boolean;
}

const randIntBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max + 1 - min) + min);
const deg2rad = (deg: number) => deg * (Math.PI / 180);
const toCss = (n: number) =>
  `rgb(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255})`;

interface KlimtSwirl {
  quadrant: string;
  w: number;
  h: number;
  curve: number;
  interval: number;
  curveCounter: number;
  curveQ: number;
  poolCounter: number;
  testCounter: number;
  pool: Array<{ x: number; y: number; rotation: number; color: string; placed: boolean }>;
}

/**
 * Create the initial state for the Klimt animation — four swirls, one per
 * canvas quadrant. Pass the returned array to `drawKlimt` each frame.
 * Self-contained (no module-level imports) so a CodePen can embed it via .toString().
 */
export function createKlimtSwirls(width: number, height: number): KlimtSwirl[] {
  const COLORS = [
    0xffd700, 0xdaa520, 0xb8860b,
    0xcd853f, 0xb87333, 0xf0e68c,
    0x8b6914, 0x191970, 0x4b0082, 0x8b0000,
  ];
  const CURVES = [45, -45, 135, -135];
  const TILE_Q = 260;
  const toCss = (n: number) => `rgb(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255})`;
  const randInt = (min: number, max: number) => Math.floor(Math.random() * (max + 1 - min) + min);
  const seedXY = (q: string, w: number, h: number) => {
    if (q === 'TL') return { x: w * 0.25, y: h * 0.15 };
    if (q === 'TR') return { x: w * 0.75, y: h * 0.15 };
    if (q === 'BL') return { x: w * 0.75, y: h * 0.35 };
    return { x: w * 0.25, y: h * 0.35 }; // BR
  };

  return (['TL', 'TR', 'BL', 'BR'] as const).map(quadrant => {
    const pool: KlimtSwirl['pool'] = [];
    let colorCounter = 0;
    for (let i = 0; i < TILE_Q; i++) {
      pool.push({ x: 0, y: 0, rotation: 0, color: toCss(COLORS[colorCounter]), placed: false });
      colorCounter = (colorCounter + 1) % COLORS.length;
    }
    const seed = seedXY(quadrant, width, height);
    pool[0].x = seed.x;
    pool[0].y = seed.y;
    pool[0].placed = true;
    return {
      quadrant,
      w: width,
      h: height,
      curve: CURVES[Math.floor(Math.random() * CURVES.length)],
      interval: randInt(4, 7),
      curveCounter: 0,
      curveQ: randInt(85, 150),
      poolCounter: 1,
      testCounter: 0,
      pool,
    };
  });
}

/**
 * Step and render one frame of the Klimt animation.
 * Mutates each swirl's state in place. Call `createKlimtSwirls` once to build
 * the initial state, then call this every animation frame.
 * Self-contained (no module-level imports) so a CodePen can embed it via .toString().
 */
export function drawKlimt(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  swirls: KlimtSwirl[]
): void {
  const CURVES = [45, -45, 135, -135];
  const BRICK_W = 18;
  const BRICK_H = 9;
  const BRICK_ALPHA = 0.24;
  const deg2rad = (deg: number) => deg * (Math.PI / 180);
  const randInt = (min: number, max: number) => Math.floor(Math.random() * (max + 1 - min) + min);
  const seedXY = (q: string, w: number, h: number) => {
    if (q === 'TL') return { x: w * 0.25, y: h * 0.15 };
    if (q === 'TR') return { x: w * 0.75, y: h * 0.15 };
    if (q === 'BL') return { x: w * 0.75, y: h * 0.35 };
    return { x: w * 0.25, y: h * 0.35 }; // BR
  };

  ctx.fillStyle = '#0a0705';
  ctx.fillRect(0, 0, width, height);

  for (const swirl of swirls) {
    swirl.w = width;
    swirl.h = height;

    swirl.testCounter++;
    if (swirl.testCounter % swirl.interval === 0) {
      swirl.testCounter = 0;
      const s = swirl.pool[swirl.poolCounter];
      swirl.poolCounter = (swirl.poolCounter + 1) % swirl.pool.length;

      swirl.curveCounter++;
      swirl.curve *= 1.025;
      s.rotation = deg2rad(swirl.curve);

      if (swirl.curveCounter > swirl.curveQ) {
        swirl.curve = CURVES[Math.floor(Math.random() * CURVES.length)];
        swirl.curveCounter = 0;
        swirl.curveQ = randInt(85, 150);
      }

      const prevIndex = swirl.poolCounter > 1 ? swirl.poolCounter - 2 : swirl.pool.length - 1;
      const prev = swirl.pool[prevIndex];
      s.x = prev.x + BRICK_H * Math.sin(prev.rotation);
      s.y = prev.y - BRICK_H * Math.cos(prev.rotation);

      const buffer = 1;
      if (swirl.poolCounter === 0 || s.y < -buffer || s.x < -buffer || s.x > width + buffer || s.y > height + buffer) {
        const np = seedXY(swirl.quadrant, width, height);
        s.x = np.x;
        s.y = np.y;
      }
      s.placed = true;
    }

    ctx.globalAlpha = BRICK_ALPHA;
    for (const s of swirl.pool) {
      if (!s.placed) continue;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      ctx.fillStyle = s.color;
      ctx.fillRect(-BRICK_W / 2, -BRICK_H, BRICK_W, BRICK_H);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
}

/**
 * Place the next rectangle tip-to-tail after the previous rectangle.
 */
export function nextKlimtBrickPoint(
  previousX: number,
  previousY: number,
  previousRotation: number,
  brickHeight: number
): { x: number; y: number } {
  return {
    x: previousX + brickHeight * Math.sin(previousRotation),
    y: previousY - brickHeight * Math.cos(previousRotation),
  };
}

class RainbowSwirls {
  quadrant: Quadrant;
  w: number;
  h: number;
  curve: number;
  interval: number;
  curveCounter = 0;
  curveQ: number;
  poolCounter = 0;
  testCounter = 0;
  pool: Brick[] = [];

  constructor(quadrant: Quadrant, w: number, h: number) {
    this.quadrant = quadrant;
    this.w = w;
    this.h = h;
    this.curve = CURVES[Math.floor(Math.random() * CURVES.length)];
    this.interval = randIntBetween(4, 7);
    this.curveQ = randIntBetween(CURVED_QS[0], CURVED_QS[1]);

    let colorCounter = 0;
    for (let i = 0; i < TILE_Q; i++) {
      this.pool.push({
        x: 0,
        y: 0,
        rotation: 0,
        color: toCss(COLORS[colorCounter]),
        placed: false,
      });
      colorCounter = (colorCounter + 1) % COLORS.length;
    }

    const first = this.pool[0];
    const seed = this.newXY();
    first.x = seed.x;
    first.y = seed.y;
    first.placed = true;
    this.poolCounter = 1;
  }

  resize(w: number, h: number) {
    this.w = w;
    this.h = h;
  }

  newXY(): { x: number; y: number } {
    switch (this.quadrant) {
      case "TL":
        return { x: this.w * 0.25, y: this.h * 0.15 };
      case "TR":
        return { x: this.w * 0.75, y: this.h * 0.15 };
      case "BL":
        return { x: this.w * 0.75, y: this.h * 0.35 };
      case "BR":
        return { x: this.w * 0.25, y: this.h * 0.35 };
    }
  }

  newBrick() {
    const s = this.pool[this.poolCounter];
    this.poolCounter++;
    if (this.poolCounter > this.pool.length - 1) this.poolCounter = 0;

    this.curveCounter++;
    this.curve *= 1.025;
    s.rotation = deg2rad(this.curve);

    if (this.curveCounter > this.curveQ) {
      this.curve = CURVES[Math.floor(Math.random() * CURVES.length)];
      this.curveCounter = 0;
      this.curveQ = randIntBetween(CURVED_QS[0], CURVED_QS[1]);
      const np = this.newXY();
      s.x = np.x;
      s.y = np.y;
    }

    const prevIndex =
      this.poolCounter > 1 ? this.poolCounter - 2 : this.pool.length - 1;
    const prev = this.pool[prevIndex];
    const next = nextKlimtBrickPoint(prev.x, prev.y, prev.rotation, BRICK_H);
    s.x = next.x;
    s.y = next.y;

    const buffer = 1;
    if (
      this.poolCounter === 0 ||
      s.y < -buffer ||
      s.x < -buffer ||
      s.x > this.w + buffer ||
      s.y > this.h + buffer
    ) {
      const np = this.newXY();
      s.x = np.x;
      s.y = np.y;
    }
    s.placed = true;
  }

  animate() {
    this.testCounter++;
    if (this.testCounter % this.interval === 0) {
      this.newBrick();
      this.testCounter = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = BRICK_ALPHA;
    for (const s of this.pool) {
      if (!s.placed) continue;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      ctx.fillStyle = s.color;
      ctx.fillRect(-BRICK_W / 2, -BRICK_H, BRICK_W, BRICK_H);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
}

const KlimtFormula: CollisionDetectionObject = {
  keyFunction: nextKlimtBrickPoint,
  dependencies: [],
  functionString: `// Place the next rectangle tip-to-tail from the previous one.
function nextKlimtBrickPoint(previousX, previousY, previousRotation, brickHeight) {
  return {
    x: previousX + brickHeight * Math.sin(previousRotation),
    y: previousY - brickHeight * Math.cos(previousRotation),
  };
}`,
};

class Klimt extends Template {
  static t = "Klimt-Inspired Swirls";
  static l = "klimt";
  static f = KlimtFormula;
  title = "Klimt-Inspired Swirls";

  animationObject = KlimtFormula;
  animId = 0;
  swirls: RainbowSwirls[] = [];

  init() {
    if (this.textDiv) this.textDiv.innerHTML = ELI5;
    if (!this.ctx) return;
    this.build();
    this.animate();
  }

  build() {
    const quadrants: Quadrant[] = ["TL", "BL", "TR", "BR"];
    this.swirls = quadrants.map(
      (q) => new RainbowSwirls(q, this.canvasWidth, this.canvasHeight)
    );
  }

  animate = () => {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    for (const swirl of this.swirls) {
      swirl.animate();
      swirl.draw(ctx);
    }

    this.animId = requestAnimationFrame(this.animate);
  };

  resizeHandler = () => {
    if (!this.canvas || !this.ctx || !this.cont) return;
    this.canvas.width = this.canvasWidth = this.cont.clientWidth;
    this.canvas.height = this.canvasHeight = this.cont.clientHeight;
    this.halfHeight = this.cont.clientHeight / 2;
    this.halfWidth = this.cont.clientWidth / 2;
    const { top, left } = this.canvas.getBoundingClientRect();
    this.top = top;
    this.left = left;
    for (const swirl of this.swirls) {
      swirl.resize(this.canvasWidth, this.canvasHeight);
    }
  };

  stop() {
    cancelAnimationFrame(this.animId);
    super.stop();
  }
}

const ELI5 = `Klimt-Inspired Swirls — gold-leaf ribbons built from translucent rectangles.

Inspired by Gustav Klimt's "Tree of Life" and "The Kiss" — the same tip-to-tail
brick math, now in golds, bronzes, and midnight blues. Each swirl slowly places
a brick every several frames, rotating it a little more each time, so the trail
curves into an organic spiral. The palette pulls from gold leaf, copper, indigo,
and deep crimson — Klimt's ornamental vocabulary, reduced to math.`;

export default Klimt;
