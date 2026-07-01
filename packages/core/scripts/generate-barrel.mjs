#!/usr/bin/env node
// Regenerates packages/core/src/index.ts — the "barrel" that re-exports every
// function so `import { ... } from "@utilspalooza/core"` sees all of them.
//
// Run from the package: `npm run barrel`  (or `node scripts/generate-barrel.mjs`).
//
// Rules (must match the historical hand-written order):
//   1. `./types` is exported first (shared interfaces like Point).
//   2. Then every top-level public *.ts file, alphabetically.
//   3. Then every nested public *.ts file (e.g. CollisionObjectAPI/*), alphabetically by path.
// Excludes index.ts itself, test files, .d.ts declaration files, and explicit legacy modules.

import { readdirSync, statSync, writeFileSync, readFileSync } from 'node:fs';
import { join, relative, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const srcDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const indexPath = join(srcDir, 'index.ts');

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      out.push(...walk(full));
    } else if (
      name.endsWith('.ts') &&
      !name.endsWith('.d.ts') &&
      !name.endsWith('.test.ts') &&
      name !== 'index.ts' &&
      name !== 'legacy.ts' &&
      !name.startsWith('Legacy')
    ) {
      out.push(full);
    }
  }
  return out;
}

// Build module specifiers like './Distance' or './CollisionObjectAPI/LineLine'
const specs = walk(srcDir).map((full) => {
  const rel = relative(srcDir, full).replace(/\.ts$/, '');
  return './' + rel.split(sep).join('/'); // POSIX slashes for imports
});

const types = specs.filter((s) => s === './types');
const rest = specs.filter((s) => s !== './types');

// Top-level (no extra slash after './') before nested, each group alphabetical
// (case-insensitive, so DegToRad sorts before DFT as a human would expect).
const byName = (a, b) => a.toLowerCase().localeCompare(b.toLowerCase());
const topLevel = rest.filter((s) => s.indexOf('/', 2) === -1).sort(byName);
const nested = rest.filter((s) => s.indexOf('/', 2) !== -1).sort(byName);

const lines = [
  '// Auto-generated barrel for @utilspalooza/core — DO NOT EDIT BY HAND.',
  '// Regenerate with: npm run barrel',
  ...[...types, ...topLevel, ...nested].map((s) => `export * from '${s}';`),
  '',
].join('\n');

const previous = (() => {
  try {
    return readFileSync(indexPath, 'utf8');
  } catch {
    return '';
  }
})();

if (previous === lines) {
  console.log('barrel: index.ts already up to date (' + (topLevel.length + nested.length + types.length) + ' modules).');
} else {
  writeFileSync(indexPath, lines);
  console.log('barrel: wrote index.ts (' + (topLevel.length + nested.length + types.length) + ' modules).');
}
