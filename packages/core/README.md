# @utilspalooza/core

Framework-agnostic, fully-typed math & geometry functions for canvas / creative
coding. No React, no canvas, no dependencies — just pure functions you can drop into
any project. Ships tree-shakeable **ESM**, a **CJS** fallback, a minified **IIFE**
global for the browser, and bundled **TypeScript types**.

## Install

```sh
npm i @utilspalooza/core
```

```js
import { distance, Lerp, circleToCircle } from "@utilspalooza/core";

distance({ x: 0, y: 0 }, { x: 3, y: 4 }); // 5
Lerp(0, 100, 0.5);                        // 50
circleToCircle(0, 0, 10, 15, 0, 10);      // true (circles overlap)
```

CommonJS works too:

```js
const { distance } = require("@utilspalooza/core");
```

## Use from a CDN (no build step)

Drop a `<script>` tag on any page and call functions off the `Utilspalooza` global:

```html
<script src="https://cdn.jsdelivr.net/npm/@utilspalooza/core"></script>
<script>
  console.log(Utilspalooza.distance({ x: 0, y: 0 }, { x: 3, y: 4 })); // 5
</script>
```

unpkg serves the same minified bundle:

```html
<script src="https://unpkg.com/@utilspalooza/core"></script>
```

> Pin a version for production, e.g.
> `https://cdn.jsdelivr.net/npm/@utilspalooza/core@0.0.0`.

## What's inside

Pure functions across a handful of areas — every export is named and concretely typed:

- **Geometry & trig** — `distance`, `Lerp`, `RadToDeg`, `DegToRad`, `UnitCirclePoint`,
  `GetTriangleData`, `CircleFromThreePoints`, …
- **Collision detection** — `circleToCircle`, `pointToCircle`, `pointToRect`,
  `rectToRect`, `circleToRect`, `lineToLine`, `lineToCircle`, `polygonToPolygon`, …
- **Motion** — `OrbitalMotion`, `MoveToward`, `MoveAlongLine`, `FindPointAroundCircle`,
  easing functions, …
- **Generators & helpers** — `RandomIntegerBetween`, `RandomNumberBetween`,
  `GetRandomColors`, `NumberWithCommas`, `DistributeAroundCircle`, …

Because everything is a side-effect-free named export, bundlers tree-shake away
anything you don't import.

## TypeScript

Types ship in the package; no `@types/*` needed. Shared shapes like `Point`
(`{ x: number; y: number }`) are exported alongside the functions.

## License

MIT
