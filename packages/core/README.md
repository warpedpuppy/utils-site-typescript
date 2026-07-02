# @utilspalooza/core

Utilspalooza is a small TypeScript toolkit of readable math helpers for creative
coding, canvas animation, and visual experiments.

It is not a timeline engine and it is not trying to compete with GSAP. The package is
for the small bits of motion math you reach for when making canvas toys,
generative art, game-ish interactions, educational animations, or visual demos:
interpolation, easing, vectors, geometry, collision checks, flocking, and tiny
time-driven animation helpers.

No React, no canvas dependency, no runtime dependencies. Just pure functions you
can use, inspect, and adapt.

## Install

```sh
npm i @utilspalooza/core
```

```ts
import { circleToCircle, distance, lerp } from "@utilspalooza/core";

distance({ x: 0, y: 0 }, { x: 3, y: 4 }); // 5
lerp(0, 100, 0.5); // 50
circleToCircle(0, 0, 10, 15, 0, 10); // true
```

CommonJS works too:

```js
const { distance } = require("@utilspalooza/core");
```

## Import Strategy

Root imports are the recommended public API:

```ts
import { easeOutCubic, pingPong, tweenObject } from "@utilspalooza/core";
```

Subpath imports are also supported for examples, focused bundles, and people who
prefer module-level imports:

```ts
import { easeOutCubic } from "@utilspalooza/core/Easing";
import { tweenObject } from "@utilspalooza/core/Animate";
```

Legacy migration helpers are intentionally not exported from the root barrel.
Import them explicitly if you are moving older code over:

```ts
import { centerOnStage, legacyCosWave } from "@utilspalooza/core/legacy";
```

## Recipes

### Move a Point Toward the Mouse

```ts
import { moveToward } from "@utilspalooza/core";

const dot = { x: 0, y: 0 };
const mouse = { x: 240, y: 120 };

moveToward(dot, mouse, 4);
```

### Bounce a Ball Inside a Rectangle

```ts
import { ballBounce } from "@utilspalooza/core";

const ball = { id: "ball", x: 80, y: 40, vx: 2, vy: 0, radius: 12, color: "#fff" };
const stage = { x: 0, y: 0, width: 640, height: 360 };

ballBounce(ball, stage);
```

### Create a Looping Yoyo Animation

```ts
import { easeOutCubic, lerp, ticker, yoyo } from "@utilspalooza/core";

const stop = ticker(({ elapsed }) => {
  const t = yoyo(elapsed, 900);
  const x = lerp(0, 300, easeOutCubic(t));
  drawBall(x, 100);
});

// later
stop.cancel();
```

### Sample an Object Tween

```ts
import { easeInOutCubic, tweenObject } from "@utilspalooza/core";

const frame = tweenObject(
  {
    x: { from: 0, to: 300 },
    y: { from: 100, to: 40 },
    alpha: { from: 0, to: 1 },
  },
  elapsedMs,
  800,
  easeInOutCubic,
);
```

### Reflect Velocity Off a Wall

```ts
import { vecReflect } from "@utilspalooza/core";

const velocity = { x: 4, y: -6 };
const floorNormal = { x: 0, y: 1 };

const bounced = vecReflect(velocity, floorNormal);
```

### Detect Circle/Rectangle Collision

```ts
import { circleToRect } from "@utilspalooza/core";

const hit = circleToRect(ball.x, ball.y, ball.radius, wall.x, wall.y, wall.width, wall.height);
```

## What's Inside

- **Interpolation and ranges**: `lerp`, `inverseLerp`, `mapRange`, `clamp`, `wrap`, `pingPong`
- **Easing and smooth curves**: `linear`, `easeInOutCubic`, `easeOutBounce`, `smoothstep`, `smootherstep`
- **Tiny animation helpers**: `ticker`, `tweenValue`, `tweenObject`, `springValue`, `loop`, `yoyo`, `delay`, `stagger`
- **Vectors**: `vecAdd`, `vecScale`, `vecNormalize`, `vecReflect`, `vecLerp`, `vecLimit`
- **Geometry and trig**: `distance`, `lineLength`, `getPointOnLine`, `getRotation`, `circleFromThreePoints`, `starVertices`
- **Collision detection**: circle, rectangle, line, polygon, and object-shaped collision helpers
- **Motion and simulation**: `moveToward`, `moveAlongLine`, `ballBounce`, `ballToBallBounce`, `boidsStep`
- **Visual math extras**: `dft`, `gameOfLifeStep`, `waveAmplitude`, `lensDeflection`, `sphereLighting`

Everything in the root barrel is a named export, and the package is marked
side-effect-free so bundlers can tree-shake unused helpers.

## Use From a CDN

Drop a `<script>` tag on any page and call functions off the `Utilspalooza`
global:

```html
<script src="https://cdn.jsdelivr.net/npm/@utilspalooza/core"></script>
<script>
  console.log(Utilspalooza.distance({ x: 0, y: 0 }, { x: 3, y: 4 }));
</script>
```

Pin a version for production:

```html
<script src="https://cdn.jsdelivr.net/npm/@utilspalooza/core@0.1.0"></script>
```

unpkg serves the same browser bundle:

```html
<script src="https://unpkg.com/@utilspalooza/core"></script>
```

## TypeScript

Types ship with the package. Shared shapes like `Point`, `Vector`, `Circle`,
`Line`, `Polygon`, `Container`, and `Ball` are exported alongside the functions.

## License

MIT
