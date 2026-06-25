# Utilspalooza

Readable animation math for canvas, creative coding, and visual experiments.

Utilspalooza is both:

- a Vite/React site with live Canvas 2D demos
- a small npm workspace for reusable TypeScript packages

The site teaches the math visually. The packages expose the reusable pieces.

## Packages

### `@utilspalooza/core`

Pure, framework-agnostic math helpers. No React, no canvas, no DOM, no animation
loop ownership.

Use this for interpolation, easing, vectors, geometry, collision detection,
small physics helpers, boids, and tiny animation sampling helpers.

```ts
import { lerp, easeOutCubic, circleToCircle } from "@utilspalooza/core";

const t = easeOutCubic(0.5);
const x = lerp(0, 300, t);
const hit = circleToCircle(0, 0, 10, 15, 0, 10);
```

Legacy migration helpers are deliberately isolated:

```ts
import { centerOnStage, legacyCosWave } from "@utilspalooza/core/legacy";
```

### `@utilspalooza/effects`

Drop-in Canvas 2D background effects. These create or use a canvas, run an
animation loop, listen for resize/pointer events, and return lifecycle handles.

```ts
import { mountGlitter } from "@utilspalooza/effects";

const effect = mountGlitter("#hero", {
  density: 0.8,
  interactive: true,
  seed: 23,
});

effect.destroy();
```

Available effects:

- `mountGlitter`
- `mountPrettyRing`
- `mountSparklies`
- `mountKlimt`

## Site

The site is the proof layer:

- `/examples` — live demos that show what the math does
- `/recipes` route is currently implemented at `/create-json` — choose formulas and copy/download code
- `/api` — package API reference
- `/studio` — larger build-with-it projects and CodePen-style examples
- `/about` — project context

## Architecture

```text
packages/
├── core/                 pure math package: @utilspalooza/core
│   ├── src/              one named-export module per function
│   ├── src/index.ts      generated public barrel
│   ├── src/legacy.ts     explicit legacy subpath
│   └── dist/             tsup output
└── effects/              drop-in canvas effects: @utilspalooza/effects
    ├── src/index.ts      effect mount functions
    └── dist/             tsup output

src/
├── core-animations/      website demo classes
├── pages/
│   ├── examples/         examples page
│   ├── createJSON/       copy-code/recipes page
│   ├── api/              API docs page
│   ├── studio/           studio projects
│   └── about/            about page
├── components/
├── SiteData.ts           examples table of contents
└── types/
```

## Iron Rules

1. Pure math lives in `packages/core/src/`.
2. Website animations live in `src/core-animations/`.
3. Canvas effects that mount and run themselves live in `packages/effects/src/`.
4. Do not copy the same formula into multiple places. Import it from the canonical package.
5. Root `@utilspalooza/core` stays curated. Legacy stays behind `@utilspalooza/core/legacy`.

## Adding A Core Function

1. Add a named export in `packages/core/src/`.
2. Add tests in `packages/core/src/core.test.ts`.
3. Run the barrel generator:

```sh
npm run barrel --workspace @utilspalooza/core
```

4. If the function should appear on the Copy Code page, add a wrapper in
   `src/pages/createJSON/formulas/`.
5. Register a teaching demo in `src/core-animations/` and `src/SiteData.ts` if the
   function needs a visual explanation.

## Adding A Demo Animation

Animation classes live in `src/core-animations/` and are registered in
`src/SiteData.ts`.

Each class should:

- draw into the provided canvas
- use package math instead of retyping formulas
- include a useful plain-English explanation
- cleanly stop its animation loop

## Adding A Drop-In Effect

Effects live in `packages/effects/src/index.ts` unless they grow large enough to split
into separate modules.

Every effect should accept a target and options, then return:

```ts
{
  pause();
  resume();
  resize();
  destroy();
}
```

## Local Development

```sh
npm install
npm run dev
```

Build the site:

```sh
npm run build
```

Build packages:

```sh
npm run build --workspace @utilspalooza/core
npm run build --workspace @utilspalooza/effects
```

Run core tests:

```sh
npm test -- packages/core/src/core.test.ts
```

## Publishing

Do not publish from casual repo work. Before publishing:

- update package versions deliberately
- run package builds
- run tests
- inspect `npm pack --dry-run`
- confirm README/API docs match the exported package surface

## License

MIT.
