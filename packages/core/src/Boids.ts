import { Vector } from './types';
import { vecAdd, vecSubtract, vecScale, vecNormalize, vecLimit } from './Vec2';

/*
 * Boids — Craig Reynolds' flocking model.
 *
 * CREDIT: The algorithm below is Craig W. Reynolds' "boids" (bird-oids), first
 * presented in 1986 and published as "Flocks, Herds, and Schools: A Distributed
 * Behavioral Model" (SIGGRAPH '87, Computer Graphics 21(4): 25–34). The three
 * steering rules — separation, alignment, cohesion — are his. This is an
 * independent from-scratch TypeScript implementation of that public algorithm;
 * no third-party source was copied.
 *
 * Each boid looks only at its local neighbors and obeys three rules:
 *   1. SEPARATION — steer away from neighbors that are too close (avoid crowding).
 *   2. ALIGNMENT  — steer toward the average heading of nearby neighbors.
 *   3. COHESION   — steer toward the average position of nearby neighbors.
 * The lifelike flock emerges; nothing steers the group as a whole.
 *
 * This module is pure: no canvas, no DOM, no clock reads. `boidsStep` advances the
 * simulation one tick deterministically from its inputs, so it is unit-testable and
 * safe to publish. Rendering and timing belong to the caller.
 */

/** One agent in the flock: where it is and where it is heading. */
export interface Boid {
  position: Vector;
  velocity: Vector;
}

/** Tunable weights and radii for {@link boidsStep}. */
export interface BoidsOptions {
  /** Sight radius for alignment + cohesion (neighbors within this distance count). */
  perceptionRadius: number;
  /** Closer radius at which separation kicks in (avoid crowding). */
  separationRadius: number;
  /** Maximum speed a boid may travel (caps the velocity each tick). */
  maxSpeed: number;
  /** Maximum steering force any single rule may apply per tick. */
  maxForce: number;
  /** Relative strength of the separation rule. */
  separationWeight: number;
  /** Relative strength of the alignment rule. */
  alignmentWeight: number;
  /** Relative strength of the cohesion rule. */
  cohesionWeight: number;
  /** Optional attractor the flock drifts toward (e.g. a wandering roost point). */
  target?: Vector;
  /** Strength of the pull toward `target`. `0` (default) = pure boids, no attractor. */
  targetWeight: number;
}

/** Sensible starting values; spread-override any field you like. */
export const DEFAULT_BOIDS_OPTIONS: BoidsOptions = {
  perceptionRadius: 50,
  separationRadius: 24,
  maxSpeed: 3,
  maxForce: 0.05,
  separationWeight: 1.6,
  alignmentWeight: 1.0,
  cohesionWeight: 0.9,
  targetWeight: 0,
};

/** Toroidal bounds — boids that leave one edge re-enter the opposite one. */
export interface FlockBounds {
  width: number;
  height: number;
}

/**
 * Reynolds steering: turn a *desired direction* into a force that nudges the
 * current velocity toward travelling that way at full speed, capped to `maxForce`.
 */
function steer(
  desired: Vector,
  velocity: Vector,
  maxSpeed: number,
  maxForce: number
): Vector {
  if (desired.x === 0 && desired.y === 0) return { x: 0, y: 0 };
  const aim = vecScale(vecNormalize(desired), maxSpeed);
  return vecLimit(vecSubtract(aim, velocity), maxForce);
}

/**
 * Advance a flock by one tick, in place, using Craig Reynolds' three boids rules.
 *
 * Accelerations are computed for every boid first (reading the *old* state), then
 * applied — so the result is independent of array order and fully deterministic for
 * the same inputs (no RNG, no clock). Neighbor search is the naive O(n²) all-pairs
 * scan: clear and correct, but for thousands of boids swap in a spatial grid.
 *
 * @param boids - The flock; each boid's `position` and `velocity` are mutated.
 * @param options - Weights/radii; merged over {@link DEFAULT_BOIDS_OPTIONS}.
 * @param bounds - Optional toroidal wrap so the flock never flies off-screen.
 * @returns Nothing; `boids` is updated in place.
 * @example
 * const flock = [{ position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } },
 *                { position: { x: 10, y: 0 }, velocity: { x: 0, y: 0 } }];
 * boidsStep(flock, { cohesionWeight: 1, alignmentWeight: 0, separationWeight: 0 });
 * // the two boids now steer toward each other
 */
export function boidsStep(
  boids: Boid[],
  options: Partial<BoidsOptions> = {},
  bounds?: FlockBounds
): void {
  const o: BoidsOptions = { ...DEFAULT_BOIDS_OPTIONS, ...options };
  const perceptionSq = o.perceptionRadius * o.perceptionRadius;
  const separationSq = o.separationRadius * o.separationRadius;

  const accelerations: Vector[] = new Array(boids.length);

  for (let i = 0; i < boids.length; i++) {
    const b = boids[i];

    let sep: Vector = { x: 0, y: 0 };
    let ali: Vector = { x: 0, y: 0 };
    let coh: Vector = { x: 0, y: 0 };
    let aliCount = 0;
    let cohCount = 0;

    for (let j = 0; j < boids.length; j++) {
      if (i === j) continue;
      const other = boids[j];
      const offset = vecSubtract(b.position, other.position); // points away from neighbor
      const distSq = offset.x * offset.x + offset.y * offset.y;
      if (distSq === 0) continue;

      if (distSq < perceptionSq) {
        ali = vecAdd(ali, other.velocity);
        coh = vecAdd(coh, other.position);
        aliCount++;
        cohCount++;
      }
      if (distSq < separationSq) {
        // weight by closeness: the nearer the neighbor, the harder we shove away
        const dist = Math.sqrt(distSq);
        sep = vecAdd(sep, vecScale(vecNormalize(offset), 1 / dist));
      }
    }

    let accel: Vector = { x: 0, y: 0 };

    if (sep.x !== 0 || sep.y !== 0) {
      const f = steer(sep, b.velocity, o.maxSpeed, o.maxForce);
      accel = vecAdd(accel, vecScale(f, o.separationWeight));
    }
    if (aliCount > 0) {
      const f = steer(vecScale(ali, 1 / aliCount), b.velocity, o.maxSpeed, o.maxForce);
      accel = vecAdd(accel, vecScale(f, o.alignmentWeight));
    }
    if (cohCount > 0) {
      const center = vecScale(coh, 1 / cohCount);
      const f = steer(vecSubtract(center, b.position), b.velocity, o.maxSpeed, o.maxForce);
      accel = vecAdd(accel, vecScale(f, o.cohesionWeight));
    }
    if (o.target && o.targetWeight !== 0) {
      const f = steer(vecSubtract(o.target, b.position), b.velocity, o.maxSpeed, o.maxForce);
      accel = vecAdd(accel, vecScale(f, o.targetWeight));
    }

    accelerations[i] = accel;
  }

  for (let i = 0; i < boids.length; i++) {
    const b = boids[i];
    b.velocity = vecLimit(vecAdd(b.velocity, accelerations[i]), o.maxSpeed);
    b.position = vecAdd(b.position, b.velocity);

    if (bounds) {
      if (b.position.x < 0) b.position.x += bounds.width;
      else if (b.position.x >= bounds.width) b.position.x -= bounds.width;
      if (b.position.y < 0) b.position.y += bounds.height;
      else if (b.position.y >= bounds.height) b.position.y -= bounds.height;
    }
  }
}

/**
 * An instantiable flock that owns its agents and advances them with {@link boidsStep}.
 *
 * Pure of any framework — it never touches a canvas, the DOM, or the clock — so it
 * runs identically in a browser, in Node, or in a test. Build one, call `step()` once
 * per frame (optionally passing a wandering target), then read `boids` to draw them.
 *
 * @example
 * const flock = new Flock(200, { width: 800, height: 600 });
 * // each animation frame:
 * flock.step();
 * for (const b of flock.boids) drawTriangle(ctx, b.position, b.velocity);
 */
export class Flock {
  boids: Boid[] = [];
  options: BoidsOptions;
  bounds?: FlockBounds;

  /**
   * @param count - How many boids to spawn.
   * @param bounds - Optional toroidal play area; boids spawn randomly inside it.
   * @param options - Overrides merged over {@link DEFAULT_BOIDS_OPTIONS}.
   */
  constructor(count: number, bounds?: FlockBounds, options: Partial<BoidsOptions> = {}) {
    this.bounds = bounds;
    this.options = { ...DEFAULT_BOIDS_OPTIONS, ...options };

    const w = bounds?.width ?? 1;
    const h = bounds?.height ?? 1;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = this.options.maxSpeed * (0.5 + Math.random() * 0.5);
      this.boids.push({
        position: { x: Math.random() * w, y: Math.random() * h },
        velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      });
    }
  }

  /**
   * Advance the flock one tick.
   * @param target - Optional attractor for this tick; only pulls if `options.targetWeight > 0`.
   */
  step(target?: Vector): void {
    if (target) this.options.target = target;
    boidsStep(this.boids, this.options, this.bounds);
  }
}
