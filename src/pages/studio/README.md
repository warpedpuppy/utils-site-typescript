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
   Effects mounted through `@utilspalooza/effects` (`glitter`,
   `pretty-ring`, `sparklies`) are explicit exceptions and stay enforced only
   at the slug-sync layer.

Studio-only projects are explicit exceptions in `STUDIO_ONLY_KEYS`.

## Current Canonical Draw Coverage

As of 2026-06-27, `52` example-derived pens are canonicalized and `3` are
explicit effects exceptions.
The authoritative slug list lives in `CANONICAL_DRAW_PEN_KEYS` inside
`src/pages/studio/studio-pens-sync.test.ts`; do not maintain a second manual
slug list here.

## Remaining Work

The old "Bucket 1 candidates" framing is no longer enough. The real live
checklist for the remaining non-canonicalized slugs now lives in
`.claude/STUDIO-CANONICALIZATION-CHECKLIST.md`.

As of 2026-06-27, there are `0` remaining canonicalization items. The only
non-canonical draw-layer entries are the `3` explicit effects exceptions in
`.claude/STUDIO-CANONICALIZATION-CHECKLIST.md`.

## Resume Checklist

1. Inspect `src/pages/studio/studio-pens-sync.test.ts`.
2. If new draw-layer work appears later, pick the slug from
   `.claude/STUDIO-CANONICALIZATION-CHECKLIST.md`.
3. Update the matching Studio pen payload file (`src/pages/studio/pens-examples.ts`
   or `src/pages/studio/pens.ts`) so the CodePen JS embeds that draw helper via
   `.toString()` plus any support helpers it references.
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
