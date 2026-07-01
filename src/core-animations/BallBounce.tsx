import { Ball } from "../types/shapes";
import AnimationBaseClass from "./AnimationBaseClass";
import { ballBounce as ballBouncePhysics } from "@utilspalooza/core/BallBounce";
import { ballBounce as ballBounceFormula } from "../pages/createJSON/formulas/animation/BallBounce";

interface RainbowBall extends Ball {
  hue: number;
  settled: boolean;
  restFrames: number;
}

const ELI5 = `<h3>Gravity, bounce, and a little friction.</h3>
<p>Every ball runs the same one-line physics step: add gravity to its vertical
speed, move, and on each wall/floor hit reflect the speed and keep a fraction of
it — that fraction is <b>restitution</b> (bounciness). Drag the slider: near 1 the
balls barely tire; lower and they die out fast.</p>
<p>Rainbow balls keep streaming in, staggered, so there's always one in the air.
They're drawn from a fixed <b>object pool</b> — once the pit is full we never make a
new one; instead the ball that's rested longest is plucked off the floor and dropped
again. The streaks are <b>motion trails</b> — we fade the previous frame instead of
erasing it, so movement leaves a comet.</p>`;

const BG = "rgb(10, 8, 20)";

/**
 * Pure per-ball renderer — a rainbow radial-gradient sphere with a glossy
 * highlight. References nothing outside its args, so it ports straight to CodePen
 * via `.toString()`. Color comes from the ball's `hue` as a CSS `hsl()` string.
 */
function drawRainbowBall(ctx: any, ball: any): void {
  const gr = ctx.createRadialGradient(
    ball.x - ball.radius * 0.32,
    ball.y - ball.radius * 0.32,
    0,
    ball.x,
    ball.y,
    ball.radius
  );
  gr.addColorStop(0, `hsl(${ball.hue}, 90%, 78%)`);
  gr.addColorStop(0.55, `hsl(${ball.hue}, 85%, 60%)`);
  gr.addColorStop(1, `hsl(${ball.hue}, 80%, 38%)`);
  ctx.fillStyle = gr;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();

  // glossy highlight
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.arc(ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.35, ball.radius * 0.18, 0, Math.PI * 2);
  ctx.fill();
}

export { drawRainbowBall };

export default class BallBounceAnimation extends AnimationBaseClass {
  static t = "ball bounce";
  static l = "ball-bounce";
  static f = ballBounceFormula;
  title = "ball bounce";
  animationObject = ballBounceFormula;

  balls: RainbowBall[] = [];
  restitution = 0.88; // bounciness (slider-controlled)
  spawnInterval = 16; // frames between staggered entries
  spawnCounter = 0;
  spawnIndex = 0;
  maxBalls = 40; // object-pool cap: never instantiate beyond this

  init() {
    if (this.textDiv) this.textDiv.innerHTML = ELI5;
    this.balls = [];
    this.spawnCounter = 0;
    this.spawnIndex = 0;
    if (this.ctx) {
      this.ctx.fillStyle = BG;
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
    // Seed a few so the screen isn't empty on the first frame.
    for (let i = 0; i < 4; i++) this.spawnOrRecycle();
    this.draw();
  }

  /** Reset a ball object for a fresh drop from the top (reused, not re-allocated). */
  resetBall = (ball: RainbowBall) => {
    const hue = (this.spawnIndex * 47) % 360;
    const radius = 14 + Math.random() * 8;
    ball.x = this.canvasWidth * (0.08 + Math.random() * 0.84);
    ball.y = radius + Math.random() * 20;
    ball.vx = (Math.random() - 0.5) * 6;
    ball.vy = 1 + Math.random() * 2;
    ball.radius = radius;
    ball.hue = hue;
    ball.color = `hsl(${hue}, 85%, 60%)`;
    ball.settled = false;
    ball.restFrames = 0;
    this.spawnIndex++;
  };

  /** Object pool: grow until the cap, then recycle the ball that's rested longest. */
  spawnOrRecycle = () => {
    if (this.balls.length < this.maxBalls) {
      const ball: RainbowBall = {
        id: `b${this.balls.length}`,
        x: 0, y: 0, vx: 0, vy: 0, radius: 0, color: "", hue: 0,
        settled: false, restFrames: 0,
      };
      this.resetBall(ball);
      this.balls.push(ball);
      return;
    }
    // At the cap: take one from the floor — the one that's rested longest.
    let target: RainbowBall | null = null;
    for (const b of this.balls) {
      if (b.settled && (target === null || b.restFrames > target.restFrames)) target = b;
    }
    if (target) this.resetBall(target);
  };

  draw = () => {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const stage = { x: 0, y: 0, width: this.canvasWidth, height: this.canvasHeight };

    // Trails: fade the previous frame instead of clearing it.
    ctx.fillStyle = "rgba(10, 8, 20, 0.22)";
    ctx.fillRect(0, 0, stage.width, stage.height);

    // Staggered, continuous entry — there's always a ball on the way in.
    if (++this.spawnCounter >= this.spawnInterval) {
      this.spawnCounter = 0;
      this.spawnOrRecycle();
    }

    for (const ball of this.balls) {
      if (!ball.settled) {
        ballBouncePhysics(ball, stage, this.restitution);
        const onFloor = ball.y >= stage.height - ball.radius - 0.5;
        if (onFloor) ball.vx *= 0.9; // rolling friction so they actually come to rest
        if (onFloor && Math.abs(ball.vy) < 1.4 && Math.abs(ball.vx) < 0.5) {
          ball.settled = true;
          ball.y = stage.height - ball.radius;
          ball.vy = 0;
          ball.vx = 0;
        }
      } else {
        ball.restFrames++;
      }
      drawRainbowBall(ctx, ball);
    }

    this.raf(this.draw);
  };

  extraHTML = () => {
    return (
      <div className="extra-html">
        <label style={{ marginRight: 10 }}>bounciness:</label>
        <input
          type="range"
          min="0.5"
          max="0.98"
          step="0.01"
          defaultValue={this.restitution}
          style={{ verticalAlign: "middle", width: 160 }}
          onChange={(e) => { this.restitution = +e.currentTarget.value; }}
        />
        <span style={{ marginLeft: 8, opacity: 0.7, fontSize: "0.85rem" }}>
          low = thuds · high = springy
        </span>
      </div>
    );
  };

  pointerDownHandler(_e: PointerEvent) {}
  pointerUpHandler(_e: PointerEvent) {}
  pointerMoveHandler(_e: PointerEvent) {}
}
