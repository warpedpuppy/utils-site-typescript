import {
  createLoop,
  createRuntime,
  fadeFill,
  jewelPalette,
  rgb,
  TAU,
  type BaseEffectOptions,
  type EffectHandle,
  type RGBTuple,
  type Target,
} from './mountHarness';

export interface KlimtOptions extends BaseEffectOptions {
  ribbonCount?: number;
  tileCount?: number;
  palettes?: RGBTuple[];
  brickWidth?: number;
  brickHeight?: number;
  trail?: number;
}

interface Ribbon {
  x: number;
  y: number;
  rotation: number;
  curve: number;
  curveCounter: number;
  curveLimit: number;
  interval: number;
  tick: number;
  cursor: number;
  bricks: Array<{ x: number; y: number; rotation: number; color: string; placed: boolean }>;
}

/**
 * The next brick position along a Klimt ribbon, stepping `brickHeight` forward
 * from the previous point at the given rotation. Exported so the site's Klimt
 * example can embed the stepping math in a CodePen.
 */
export function nextKlimtBrickPoint(
  previousX: number,
  previousY: number,
  previousRotation: number,
  brickHeight: number,
): { x: number; y: number } {
  return {
    x: previousX + brickHeight * Math.sin(previousRotation),
    y: previousY - brickHeight * Math.cos(previousRotation),
  };
}

function ribbonSeed(index: number, count: number, width: number, height: number): { x: number; y: number } {
  const angle = (index / count) * TAU - Math.PI / 2;
  return {
    x: width / 2 + Math.cos(angle) * width * 0.26,
    y: height / 2 + Math.sin(angle) * height * 0.22,
  };
}

export function mountKlimt(target: Target, options: KlimtOptions = {}): EffectHandle {
  const runtime = createRuntime(target, options);
  const palette = options.palettes ?? [[255, 240, 245], [230, 230, 250], ...jewelPalette];
  const ribbonCount = Math.max(1, Math.floor(options.ribbonCount ?? 6));
  const tileCount = Math.max(20, Math.floor(options.tileCount ?? 130));
  const brickWidth = options.brickWidth ?? 30;
  const brickHeight = options.brickHeight ?? 15;
  let ribbons: Ribbon[] = [];

  const makeRibbon = (index: number): Ribbon => {
    const seed = ribbonSeed(index, ribbonCount, runtime.width, runtime.height);
    return {
      x: seed.x,
      y: seed.y,
      rotation: (runtime.random() * 2 - 1) * Math.PI,
      curve: [-45, 45, 135, -135][Math.floor(runtime.random() * 4)],
      curveCounter: 0,
      curveLimit: 36 + Math.floor(runtime.random() * 70),
      interval: 1 + Math.floor(runtime.random() * 3),
      tick: 0,
      bricks: Array.from({ length: tileCount }, (_, i) => ({
        x: seed.x,
        y: seed.y,
        rotation: 0,
        color: rgb(palette[i % palette.length]),
        placed: false,
      })),
      cursor: 0,
    };
  };

  const rebuild = () => {
    ribbons = Array.from({ length: ribbonCount }, (_, i) => makeRibbon(i));
  };

  const stepRibbon = (ribbon: Ribbon) => {
    ribbon.tick += 1;
    if (ribbon.tick % ribbon.interval !== 0) return;
    const brick = ribbon.bricks[ribbon.cursor];
    ribbon.curveCounter += 1;
    ribbon.curve *= 1.035;
    ribbon.rotation = (ribbon.curve * Math.PI) / 180;
    const next = nextKlimtBrickPoint(ribbon.x, ribbon.y, ribbon.rotation, brickHeight);
    ribbon.x = next.x;
    ribbon.y = next.y;
    if (
      ribbon.curveCounter > ribbon.curveLimit ||
      ribbon.x < -60 ||
      ribbon.x > runtime.width + 60 ||
      ribbon.y < -60 ||
      ribbon.y > runtime.height + 60
    ) {
      const seed = ribbonSeed(Math.floor(runtime.random() * ribbonCount), ribbonCount, runtime.width, runtime.height);
      ribbon.x = seed.x;
      ribbon.y = seed.y;
      ribbon.curve = [-45, 45, 135, -135][Math.floor(runtime.random() * 4)];
      ribbon.curveCounter = 0;
      ribbon.curveLimit = 36 + Math.floor(runtime.random() * 70);
    }
    brick.x = ribbon.x;
    brick.y = ribbon.y;
    brick.rotation = ribbon.rotation;
    brick.placed = true;
    ribbon.cursor = (ribbon.cursor + 1) % ribbon.bricks.length;
  };

  rebuild();

  return createLoop(runtime, (ctx, width, height) => {
    ctx.fillStyle = fadeFill(options.background ?? '#020202', options.trail ?? 0.12);
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    for (const ribbon of ribbons) {
      stepRibbon(ribbon);
      ctx.globalAlpha = 0.22;
      for (const brick of ribbon.bricks) {
        if (!brick.placed) continue;
        ctx.save();
        ctx.translate(brick.x, brick.y);
        ctx.rotate(brick.rotation);
        ctx.fillStyle = brick.color;
        ctx.fillRect(-brickWidth / 2, -brickHeight, brickWidth, brickHeight);
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }, rebuild);
}
