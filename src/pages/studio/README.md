# Studio Pen Sync

This directory owns `/studio` and the CodePen payloads generated for the Studio
gallery.

## Current Rule

The registry is the status source. Each `/examples` animation record in
`src/registry/categories/*.ts` carries a `pen` field:

- `canonical-vm-tested` — embeds the exported `draw*` function and boots in the VM smoke test.
- `canonical` — embeds the exported `draw*` function and is identity-checked, but is not VM-booted.
- `effects-mount` — synced by slug only because the example is mounted through `@utilspalooza/effects`.
- `mini-demo-no-pen` — docs-first scalar mini-demo; intentionally has no Studio pen.

`src/pages/studio/studio-pens-sync.test.ts` and
`src/pages/studio/studio-codepen-runtime.test.ts` derive their allowlists from those registry
statuses. Do not maintain a second manual slug list.

Studio-only projects are separate from `/examples` and live in
`src/pages/studio/studioProjects.ts`.

## Adding Or Changing A Pen

1. Add or expose a module-level exported `draw*` helper in the matching `src/core-animations/*`
   file when the pen should be canonical.
2. Update the matching payload file (`src/pages/studio/pens-examples.ts` or
   `src/pages/studio/pens.ts`) so the CodePen JS embeds that helper via `.toString()` plus any
   support helpers it references.
3. Update the record's `pen` status in `src/registry/categories/*.ts`.
4. Run:

```sh
npx vitest run src/pages/studio/studio-pens-sync.test.ts
npx tsc --noEmit
npm test
npm run build
```

Historical canonicalization notes are archived in `.claude/old/`, especially
`.claude/old/STUDIO-CANONICALIZATION-CHECKLIST.md`.
