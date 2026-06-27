# Studio Pen Sync

This directory owns `/studio` and the CodePen payloads generated for the Studio
gallery.

Current resume snapshot: `.claude/handoffs/2026-06-27-api-trig-studio-handoff.md`

Tracked remaining-items checklist:
`.claude/STUDIO-CANONICALIZATION-CHECKLIST.md`

## Current Rule

`src/pages/studio/studio-pens-sync.test.ts` is the enforceable source of truth.
It checks two separate contracts:

1. Every included `/examples` animation has exactly one Studio pen whose `key`
   matches the animation slug (`static l`).
2. Pens listed in `CANONICAL_DRAW_PEN_KEYS` embed their exported
   `src/core-animations` `draw*` function verbatim via `.toString()`.

Studio-only projects are explicit exceptions in `STUDIO_ONLY_KEYS`.

## Current Canonical Draw Coverage

As of 2026-06-27, these example-derived pens are canonicalized and enforced:

- `angle-lerp-shortest-turn`
- `ball-bounce`
- `ball-orbiting-a-sun`
- `balls-bouncing-against-each-other`
- `circle-to-circle-collision`
- `circle-to-rectangle-collision`
- `circle-from-three-points`
- `color-families`
- `color-lerp`
- `distribute-around-circle`
- `easing-functions`
- `draw-rectangle`
- `draw-star`
- `equilateral-trianlge-points`
- `demystify-sine-and-cosine`
- `find-points-on-a-circle`
- `get-a-point-on-a-line`
- `get-triangle-data-from-line`
- `line-length`
- `lerp-smooth-follow`
- `line-to-line-collision`
- `line-to-point-collision`
- `line-to-rectangle-collision`
- `move-to-changing-point`
- `murmuration`
- `point-object-towards-another`
- `point-to-circle-collision`
- `point-to-rectangle-collision`
- `quadratic-bezier-curve`
- `rectangle-to-rectangle-collision`
- `sine-curve`
- `spring-damped-harmonic`
- `vector-reflection`
- `vector-rotation`
- `line-to-circle-collision`
- `polygon-to-polygon-collision`

When another pen is changed to embed its core `draw*` helper, add its slug to
`CANONICAL_DRAW_PEN_KEYS`.

## Remaining Work

The old "Bucket 1 candidates" framing is no longer enough. The real live
checklist for the remaining non-canonicalized slugs now lives in
`.claude/STUDIO-CANONICALIZATION-CHECKLIST.md`.

As of 2026-06-27, `36` example-derived pens are canonicalized and `19` still
need work.

## Resume Checklist

1. Inspect `src/pages/studio/studio-pens-sync.test.ts`.
2. Pick a remaining slug from `.claude/STUDIO-CANONICALIZATION-CHECKLIST.md`.
3. Update `src/pages/studio/pens-examples.ts` so the CodePen JS embeds that
   draw helper via `.toString()` plus any support helpers it references.
4. Add the slug to `CANONICAL_DRAW_PEN_KEYS`.
5. Run:

```sh
npx vitest run src/pages/studio/studio-pens-sync.test.ts
npx tsc --noEmit
npm test
npm run build
```

Ignored local notes may also exist at
`.claude/handoffs/2026-06-26-studio-pen-sync-checklist.md`, but this README is
the tracked handoff for future agents.
