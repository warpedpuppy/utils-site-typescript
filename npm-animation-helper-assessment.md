# Utilspalooza npm Assessment

## Bottom Line

This should not be positioned as a GreenSock competitor yet.

The current package is not an animation engine. It is much closer to a small,
readable creative-coding math toolkit: useful functions for canvas toys,
generative art, game-ish interactions, educational animations, and visual
experiments.

That is a better lane.

GreenSock owns timelines, DOM/SVG transforms, sequencing, plugins, browser
quirks, performance polish, and production animation ergonomics. Competing there
would force this project into a much larger and less distinctive shape.

The more interesting promise is:

> Tiny, readable math helpers for people making visual things who want to
> understand the motion.

That is specific, honest, and useful.

## What Is Already Strong

The best parts of the package are the functions where the math is small enough
to understand and useful enough to reuse:

- `lerp`, `inverseLerp`, `mapRange`, `clamp`
- `smoothstep`, `smootherstep`
- `wrap`, `pingPong`, angle wrapping/interpolation
- easing functions
- 2D vector helpers
- collision detection
- geometry helpers
- boids/flocking
- simple physics steps like bounce/orbit/move-toward

These are exactly the pieces a DIY canvas/game/generative-art developer reaches
for repeatedly.

The educational angle is also real. A lot of animation libraries hide the math.
This project can expose it without making people reinvent everything from
scratch.

## The Current Weakness

The public API still feels like a personal utility drawer.

That is not an insult; that is just where the project is right now. There are
good functions in there, but the shape is uneven:

- Some names are clean npm names: `lerp`, `distance`, `vecReflect`.
- Some are older/capitalized names: `OrbitalMotion`, `RandomIntegerBetween`.
- Some are explicitly legacy: `LegacyUtils`, `LegacyTweens`.
- Some APIs mutate objects; others return new values.
- Some collision functions take positional arguments; others take objects.
- The README shows root imports, while the site uses subpath-style imports.
- The package currently exports only the root entry, so subpath imports are not
  yet a reliable npm contract.

Before publishing seriously, the main job is not adding a hundred more
functions. The main job is making the package feel intentional.

## Product Direction

The best positioning is not:

> GreenSock, but smaller.

The better positioning is:

> Creative-coding animation math you can read, copy, and understand.

Or:

> A tiny animation math toolkit for canvas, generative art, and interactive
> toys.

This gives the project a reason to exist. It is not trying to beat production
animation libraries at their own game. It is serving people who want useful
motion helpers without surrendering the math.

## What Is Missing

### 1. A Clear Public Promise

Pick one sentence and make the README, examples, package description, and site
all agree with it.

Suggested promise:

> Utilspalooza is a small TypeScript toolkit of readable math helpers for
> creative coding, canvas animation, and visual experiments.

That promise is broad enough to cover the package but narrow enough that people
understand why they would install it.

### 2. A Tiny Animation Layer

The package has animation math, but not much animation orchestration.

It does not need to become GSAP. But a small helper layer would make it much more
usable:

- `ticker(callback)`
- `tweenValue`
- `tweenObject`
- `spring`
- `sequence`
- `loop`
- `yoyo`
- `stagger`
- `delay`
- `cancel`

The key is to keep the implementation readable. The value should be: "I can use
this, and I can understand how it works."

Example direction:

```ts
ticker(({ time, delta }) => {
  const t = pingPong(time * 0.001, 1);
  const x = lerp(0, 300, easeOutCubic(t));
  drawBall(x, 100);
});
```

Or:

```ts
const frame = tweenFrame(
  {
    x: { from: 0, to: 300 },
    y: { from: 100, to: 40 },
    alpha: { from: 0, to: 1 },
  },
  elapsedMs,
  800,
  easeOutCubic
);
```

That is enough to be useful without pretending to be a full animation runtime.

### 3. Cleaner Package Boundaries

The repo already has the right instinct: pure math belongs in the npm package;
canvas/DOM/rendering examples belong on the site.

I would keep that boundary.

Possible future shape:

- `@utilspalooza/core`: pure math, vectors, geometry, collision, interpolation
- `@utilspalooza/animate`: ticker/tween/spring/sequence helpers
- site examples: visual demos and educational explanations

You do not need to split packages immediately, but you should design as if that
boundary exists.

### 4. Public API Cleanup

Before a real `1.0`, decide what belongs in the main barrel.

I would not publish `LegacyUtils` and `LegacyTweens` from the primary export as
first-class API. Either:

- promote the good functions into properly named modules,
- move them behind a deliberate legacy subpath,
- or leave them out of the first public version.

The package should feel like a curated toolkit, not an archive.

### 5. Stable Import Strategy

Right now the README shows:

```ts
import { distance, lerp, circleToCircle } from "@utilspalooza/core";
```

That is fine.

But the site also uses imports like:

```ts
import { easeInOut } from "@utilspalooza/core/Easing";
```

For npm consumers, subpath imports need to be explicitly supported through
`exports` in `packages/core/package.json`. Otherwise, root imports are the only
contract users should depend on.

Decision needed:

- Root-only imports: simpler public API.
- Root plus subpath imports: better for advanced users and copyable examples,
  but requires package export work.

Either is fine. What matters is making it deliberate.

### 6. Better Recipes

The README should not only list functions. It should show useful things people
actually want to make:

- Move a point toward the mouse.
- Bounce a ball inside a rectangle.
- Orbit particles around a point.
- Map scroll progress to animation progress.
- Make a button overshoot.
- Draw a flock in 30 lines.
- Reflect velocity off a wall.
- Detect circle/rectangle collision.
- Create a looping yoyo animation.

The selling point is not "here are 70 exports."

The selling point is "here is how to make visual motion from small understandable
pieces."

## Recommended Roadmap

### Phase 1: Curate the Core

- Remove or quarantine legacy exports.
- Normalize naming where possible.
- Document mutating functions clearly.
- Make root exports feel intentional.
- Decide whether subpath imports are supported.
- Make sure every public function has a short example.

### Phase 2: Build the Tiny Animation Helpers

Add the smallest useful animation layer:

- clock/ticker
- scalar tween
- object tween
- spring
- loop/yoyo helpers
- sequence/stagger helpers if they stay simple

Keep the code readable. Do not build a full framework.

### Phase 3: Make the Site the Proof

Every important helper should have a visual recipe:

- the code
- the math explanation
- a canvas demo
- a copyable minimal example

The site is not separate from the npm strategy. The site is what makes the
package believable.

## Final Recommendation

Publish this first as a creative-coding math toolkit, not as an animation
library.

Then add a very small animation helper layer once the math API is clean.

Do not chase GSAP. Build the thing GSAP is bad at: transparent little functions
that let a curious developer understand exactly why the motion works.

