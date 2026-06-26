import { CollisionDetectionObject } from "./types/types";

const noop = () => {};

// Lightweight formula objects for demos whose copy-code snippet used to live
// inside the heavy animation module.
export const BezierFormula: CollisionDetectionObject = {
  keyFunction: noop,
  functionString: `function deCasteljau(pts: Point[], t: number): { point: Point; levels: Point[][] } {
  const levels: Point[][] = [pts.map(p => ({ ...p }))];
  let current = pts.map(p => ({ ...p }));
  while (current.length > 1) {
    const next: Point[] = [];
    for (let i = 0; i < current.length - 1; i++) {
      next.push({
        x: (1 - t) * current[i].x + t * current[i + 1].x,
        y: (1 - t) * current[i].y + t * current[i + 1].y,
      });
    }
    levels.push(next);
    current = next;
  }
  return { point: current[0], levels };
}`,
  dependencies: [],
};

export const FourierFormula: CollisionDetectionObject = {
  keyFunction: noop,
  dependencies: [],
  functionString: `function dft(signal: { x: number; y: number }[]): FreqComponent[] {
  const N = signal.length;
  const result: FreqComponent[] = [];
  for (let k = 0; k < N; k++) {
    let re = 0, im = 0;
    for (let n = 0; n < N; n++) {
      const phi = (2 * Math.PI * k * n) / N;
      re += signal[n].x * Math.cos(phi) + signal[n].y * Math.sin(phi);
      im += -signal[n].x * Math.sin(phi) + signal[n].y * Math.cos(phi);
    }
    re /= N; im /= N;
    result.push({
      freq: k,
      amp: Math.sqrt(re * re + im * im),
      phase: Math.atan2(im, re),
      re, im,
    });
  }
  return result.sort((a, b) => b.amp - a.amp);
}`,
};

export const GameOfLifeFormula: CollisionDetectionObject = {
  keyFunction: noop,
  dependencies: [],
  functionString: `function nextGeneration(grid: Uint8Array, cols: number, rows: number): Uint8Array {
  const next = new Uint8Array(grid.length);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let neighbors = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const r = (row + dr + rows) % rows;
          const c = (col + dc + cols) % cols;
          neighbors += grid[r * cols + c];
        }
      }
      const alive = grid[row * cols + col];
      next[row * cols + col] =
        alive ? (neighbors === 2 || neighbors === 3 ? 1 : 0)
              : (neighbors === 3 ? 1 : 0);
    }
  }
  return next;
}`,
};

export const FlowFieldFormula: CollisionDetectionObject = {
  keyFunction: noop,
  dependencies: [],
  functionString: `function buildPermTable(): number[] {
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  return [...p, ...p];
}
function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a: number, b: number, t: number) { return a + t * (b - a); }
function grad(hash: number, x: number, y: number): number {
  const h = hash & 3;
  const u = h < 2 ? x : y, v = h < 2 ? y : x;
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
}
function perlin2(x: number, y: number): number {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
  x -= Math.floor(x); y -= Math.floor(y);
  const u = fade(x), v = fade(y);
  const a = perm[X] + Y, b = perm[X + 1] + Y;
  return lerp(
    lerp(grad(perm[a], x, y), grad(perm[b], x - 1, y), u),
    lerp(grad(perm[a+1], x, y-1), grad(perm[b+1], x-1, y-1), u),
    v
  );
}
function getFlowAngle(x: number, y: number, scale: number, z: number): number {
  return perlin2(x * scale, y * scale + z) * Math.PI * 4;
}`,
};

export const WaveFormula: CollisionDetectionObject = {
  keyFunction: noop,
  dependencies: [],
  functionString: `// Amplitude at pixel (px, py) from N wave sources
function waveAmplitude(px, py, sources, k, t) {
  let amp = 0;
  for (const src of sources) {
    const r = Math.hypot(px - src.x, py - src.y);
    amp += Math.cos(k * r - t);   // k = 2π/λ
  }
  return amp;  // range: [-N, N]
}

// Per-pixel brightness (0-1), gamma-curved so fringes pop:
const n = (amp / N + 1) / 2;          // normalise to [0, 1]
const b = Math.pow(n, 1.4);           // gamma darkens midtones`,
};

export const LensingFormula: CollisionDetectionObject = {
  keyFunction: noop,
  dependencies: [],
  functionString: `// Thin-lens gravitational deflection
// b = impact parameter (signed distance from lens axis)
// Returns post-lens slope (dy/dx) of the deflected ray
function deflect(rayY, lensY, mass) {
  const b = rayY - lensY;
  return -mass / b;       // alpha proportional to 1/b, toward the lens
}`,
};

export const PrecessionFormula: CollisionDetectionObject = {
  keyFunction: noop,
  dependencies: [],
  functionString: `// Newtonian gravity
function newtonAccel(bx, by, sunX, sunY, GM) {
  const dx = bx - sunX, dy = by - sunY;
  const r3 = Math.pow(dx*dx + dy*dy, 1.5);
  return [-GM * dx / r3, -GM * dy / r3];
}

// GR-corrected gravity - adds a 1/r^2 term to the force
function grAccel(bx, by, sunX, sunY, GM, epsilon) {
  const dx = bx - sunX, dy = by - sunY;
  const r2 = dx*dx + dy*dy;
  const r3 = r2 * Math.sqrt(r2);
  const f = -GM / r3 * (1 + epsilon / r2);
  return [f * dx, f * dy];
}`,
};

export const PhyllotaxisFormula: CollisionDetectionObject = {
  keyFunction: noop,
  dependencies: [],
  functionString: `// Vogel's model (1979) - place seed n at:
//   theta = n * angleDeg * (PI/180)
//   r = c * sqrt(n)
//   x = r*cos(theta), y = r*sin(theta)
function phyllotaxisPoint(n, angleDeg, scale) {
  const theta = n * angleDeg * Math.PI / 180;
  const r = scale * Math.sqrt(n);
  return [r * Math.cos(theta), r * Math.sin(theta)];
}`,
};

export const VectorReflectFormula: CollisionDetectionObject = {
  keyFunction: noop,
  dependencies: [],
  functionString: `function vecReflect(v: { x: number; y: number }, normal: { x: number; y: number }) {
  // normal must be a unit vector; r = v - 2(v dot n)n
  const d = 2 * (v.x * normal.x + v.y * normal.y);
  return { x: v.x - d * normal.x, y: v.y - d * normal.y };
}`,
};

export const VectorRotateFormula: CollisionDetectionObject = {
  keyFunction: noop,
  dependencies: [],
  functionString: `function vecRotate(v: { x: number; y: number }, radians: number) {
  const c = Math.cos(radians);
  const s = Math.sin(radians);
  return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
}`,
};

export const AngleLerpFormula: CollisionDetectionObject = {
  keyFunction: noop,
  dependencies: [],
  functionString: `function wrapAngle(radians: number): number {
  return Math.atan2(Math.sin(radians), Math.cos(radians));
}
function shortestAngleBetween(a: number, b: number): number {
  return wrapAngle(b - a);
}
function lerpAngle(a: number, b: number, t: number): number {
  return a + shortestAngleBetween(a, b) * t;
}`,
};

export const SpringFormula: CollisionDetectionObject = {
  keyFunction: noop,
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

// critical damping (no overshoot) = 2 * sqrt(k * m)
function criticalDamping(stiffness: number, mass = 1): number {
  return 2 * Math.sqrt(stiffness * mass);
}`,
};

export const SierpinskiFormula: CollisionDetectionObject = {
  keyFunction: noop,
  dependencies: [],
  functionString: `// The subdivision step: midpoints of an equilateral triangle's
// three edges. Connect them and you've drawn the next generation.
function sierpinskiMidpoints(radius, phase) {
  const TAU = 2 * Math.PI;
  const vertex = (k) => ({
    x: radius * Math.cos(phase + (k * TAU) / 3),
    y: radius * Math.sin(phase + (k * TAU) / 3),
  });
  const v1 = vertex(0), v2 = vertex(1), v3 = vertex(2);
  return [
    { x: (v1.x + v2.x) / 2, y: (v1.y + v2.y) / 2 },
    { x: (v2.x + v3.x) / 2, y: (v2.y + v3.y) / 2 },
    { x: (v1.x + v3.x) / 2, y: (v1.y + v3.y) / 2 },
  ];
}`,
};

export const GlitterFormula: CollisionDetectionObject = {
  keyFunction: noop,
  dependencies: [],
  functionString: `// Each dot and beam breathes around a resting value.
function cosWave(start, diff, speed, clock) {
  return start + Math.cos(clock * speed) * diff;
}`,
};

export const PrettyRingFormula: CollisionDetectionObject = {
  keyFunction: noop,
  dependencies: [],
  functionString: `// A frame-driven cosine oscillator.
function cosWave(start, diff, speed, clock) {
  return start + Math.cos(clock * speed) * diff;
}`,
};

export const SparkliesFormula: CollisionDetectionObject = {
  keyFunction: noop,
  dependencies: [],
  functionString: `// Rotate a beam's local (0, distance) offset into canvas space.
function sparklyBeamPoint(originX, originY, distance, rotation) {
  return {
    x: originX - distance * Math.sin(rotation),
    y: originY + distance * Math.cos(rotation),
  };
}`,
};

export const KlimtFormula: CollisionDetectionObject = {
  keyFunction: noop,
  dependencies: [],
  functionString: `// Place the next rectangle tip-to-tail from the previous one.
function nextKlimtBrickPoint(previousX, previousY, previousRotation, brickHeight) {
  return {
    x: previousX + brickHeight * Math.sin(previousRotation),
    y: previousY - brickHeight * Math.cos(previousRotation),
  };
}`,
};
