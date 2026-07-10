<p align="center">
  <a href="https://utilspalooza.com">
    <img src="https://utilspalooza.com/npm-banner.png" alt="Utilspalooza — canvas animation math you can see, understand, and copy into your own project" width="100%" />
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@utilspalooza/core"><img src="https://img.shields.io/npm/v/%40utilspalooza%2Fcore?style=flat-square&labelColor=12100e&color=e5261f" alt="npm version" /></a>
  <img src="https://img.shields.io/badge/license-MIT-ffd630?style=flat-square&labelColor=12100e" alt="MIT license" />
  <a href="https://utilspalooza.com/api"><img src="https://img.shields.io/badge/docs-read_the_comic-1d53c0?style=flat-square&labelColor=12100e" alt="docs: read the comic" /></a>
</p>

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
- `/recipes` route is currently implemented at `/create-json` — choose formulas and copy/download standalone snippets when npm is not the right path
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

1. Add a named export in `packages/core/src/`, with a JSDoc description and an
   `@example` block — the docs test suite fails on any function missing either.
2. Add tests in `packages/core/src/core.test.ts`.
3. Regenerate the barrel and the committed API extract (a sync test fails if
   `src/pages/api/core-api.json` drifts from source):

```sh
npm run barrel --workspace @utilspalooza/core
npm run docs --workspace @utilspalooza/core
```

4. Write the hand-authored intro for the `/api` "Explain It" tab: an
   `ENTRY_DOCS` entry (`whatItIs` + `howToUse`) in
   `src/pages/api/docsManifest.ts`. A test in
   `src/pages/api/docsManifest.test.ts` fails on any function export missing
   one. (The Easing family is the sole sanctioned exception — its intros are
   generated from the shared family writeup plus each curve's own JSDoc line.)
5. If the function should appear on the Copy Code page, add a wrapper in
   `src/pages/createJSON/formulas/`.
6. Give the function a teaching demo — a class in `src/core-animations/` plus a
   `RegistryRecord` in the matching `src/registry/categories/*.ts` file (see
   "Adding A Demo Animation"). A registry drift test requires every core export
   to be taught by an animation or explicitly listed, with a one-line
   justification, in `DOCS_ONLY_EXPORTS` in `src/registry/registry.test.ts` —
   that list is a visible debt ledger, not a loophole.
7. Finish with `npx vitest run` and `npx tsc --noEmit` at the repo root — the
   drift and completeness tests above are the real checklist.

## Adding A Demo Animation

Animation classes live in `src/core-animations/`. Each animation is registered
once as a `RegistryRecord` in the matching `src/registry/categories/*.ts` file.
That single record is the source of truth from which the `/examples` sidebar, the
Copy Code list, and the manifest are all derived — `src/animationManifest.ts` and
`src/SiteData.ts` are compatibility shims, so do not edit them directly. Drift
tests in `src/registry/registry.test.ts` fail if a record is missing a pen, a
`load()` that resolves, or a core export that no animation teaches.

Every visible animation also needs its CodePen entry in
`src/pages/studio/pens-examples.ts`: the entry's `key` must match the
animation's slug (`static l`), and its `js` embeds the standalone `drawX()`
verbatim via `.toString()` so the pen and the example cannot drift.

Each class should:

- draw into the provided canvas
- use package math instead of retyping formulas
- include a useful plain-English explanation
- cleanly stop its animation loop
- schedule every frame through `this.raf(...)`, never `requestAnimationFrame`
  directly — `raf()` is where the reduced-motion gate and pause/resume live,
  and a source-scan test in `src/core-animations/core-animations.test.ts`
  fails on any direct call

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
