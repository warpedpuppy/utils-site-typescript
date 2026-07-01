import AnimationBaseClass from "./AnimationBaseClass";
import { springValue, criticalDamping, SpringState } from "@utilspalooza/core/Animate";
import { CollisionDetectionObject } from "../types/types";

function drawSpring(
  ctx: any,
  canvasWidth: number,
  canvasHeight: number,
  target: number,
  lanes: { y: number; pos: number; color: string; label: string }[]
): void {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // the moving target — a vertical line every lane chases
  ctx.strokeStyle = "rgba(52,211,153,0.6)";
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(target, 0);
  ctx.lineTo(target, canvasHeight);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(52,211,153,0.7)";
  ctx.font = "12px monospace";
  ctx.fillText("target", target + 8, 18);

  for (const lane of lanes) {
    // rail
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, lane.y);
    ctx.lineTo(canvasWidth - 40, lane.y);
    ctx.stroke();

    // the spring "coil" from the rail start to the follower
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const coils = 14;
    const x0 = 40;
    const span = lane.pos - x0;
    ctx.moveTo(x0, lane.y);
    for (let i = 1; i <= coils; i++) {
      const t = i / coils;
      const x = x0 + span * t;
      const y = lane.y + (i % 2 === 0 ? -8 : 8) * (i === coils ? 0 : 1);
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // follower
    ctx.fillStyle = lane.color;
    ctx.beginPath();
    ctx.arc(lane.pos, lane.y, 13, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = lane.color;
    ctx.font = "bold 13px monospace";
    ctx.fillText(lane.label, 40, lane.y - 24);
  }
}

export { drawSpring };

const SpringFormula: CollisionDetectionObject = {
  keyFunction: springValue,
  dependencies: [],
  functionString: `interface SpringState {
  value: number;
  velocity: number;
}
function springValue(
  state: SpringState,
  target: number,
  { stiffness = 170, damping = 26, mass = 1, deltaSeconds = 1 / 60 } = {}
): SpringState {
  const force = -stiffness * (state.value - target);
  const damper = -damping * state.velocity;
  const acceleration = (force + damper) / mass;
  const velocity = state.velocity + acceleration * deltaSeconds;
  const value = state.value + velocity * deltaSeconds;
  return { value, velocity };
}

// critical damping (no overshoot) = 2·√(k·m)
function criticalDamping(stiffness: number, mass = 1): number {
  return 2 * Math.sqrt(stiffness * mass);
}`,
};

class SpringAnimation extends AnimationBaseClass {
  static t = "spring (damped harmonic motion)";
  static l = "spring-damped-harmonic";
  static f = SpringFormula;
  title = "spring (damped harmonic motion)";
  animationObject = SpringFormula;

  stiffness = 170;
  target = 0;
  time = 0;

  // three springs, same stiffness, different damping → the three regimes
  under: SpringState = { value: 0, velocity: 0 };
  critical: SpringState = { value: 0, velocity: 0 };
  over: SpringState = { value: 0, velocity: 0 };

  init() {
    if (this.textDiv) {
      this.textDiv.innerHTML =
        "<h3>All three balls chase the green target line with the same spring stiffness — only the <em>damping</em> differs. The red one is <strong>underdamped</strong>: it overshoots and bounces. The green is <strong>critically damped</strong> (damping = 2·√stiffness): the fastest approach with no overshoot. The blue is <strong>overdamped</strong>: no bounce, but it crawls. Drag the slider to change the stiffness.</h3>";
    }
    const start = this.canvasWidth * 0.15;
    this.under.value = start;
    this.critical.value = start;
    this.over.value = start;
    this.draw();
  }

  draw = () => {
    if (!this.ctx) return;
    const deltaSeconds = 1 / 60;
    this.time += deltaSeconds;

    // target hops between two thirds of the canvas every ~2.2s
    const left = this.canvasWidth * 0.3;
    const right = this.canvasWidth * 0.75;
    this.target = Math.floor(this.time / 2.2) % 2 === 0 ? right : left;

    const critDamp = criticalDamping(this.stiffness);
    this.under = springValue(this.under, this.target, {
      stiffness: this.stiffness,
      damping: critDamp * 0.25,
      deltaSeconds,
    });
    this.critical = springValue(this.critical, this.target, {
      stiffness: this.stiffness,
      damping: critDamp,
      deltaSeconds,
    });
    this.over = springValue(this.over, this.target, {
      stiffness: this.stiffness,
      damping: critDamp * 2.5,
      deltaSeconds,
    });

    const h = this.canvasHeight;
    drawSpring(this.ctx, this.canvasWidth, h, this.target, [
      { y: h * 0.3, pos: this.under.value, color: "#ef4444", label: "underdamped — bounces" },
      { y: h * 0.55, pos: this.critical.value, color: "#34d399", label: "critically damped — no overshoot" },
      { y: h * 0.8, pos: this.over.value, color: "#6366f1", label: "overdamped — sluggish" },
    ]);
    this.raf(this.draw);
  };

  extraHTML = () => {
    return (
      <div className="extra-html">
        <label style={{ marginRight: 10 }}>stiffness:</label>
        <input
          type="range"
          min="40"
          max="400"
          step="10"
          defaultValue={this.stiffness}
          style={{ verticalAlign: "middle", width: 160 }}
          onChange={(e) => {
            this.stiffness = +e.currentTarget.value;
          }}
        />
      </div>
    );
  };
}

export default SpringAnimation;
