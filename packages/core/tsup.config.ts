import { readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { defineConfig } from 'tsup'

const srcDir = 'src'

function walk(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      out.push(...walk(full))
    } else if (name.endsWith('.ts') && !name.endsWith('.d.ts') && !name.endsWith('.test.ts')) {
      out.push(full)
    }
  }
  return out
}

const moduleEntries = Object.fromEntries(
  walk(srcDir).map((file) => {
    const name = relative(srcDir, file).replace(/\.ts$/, '').split(sep).join('/')
    return [name, file]
  }),
)

export default defineConfig([
  // ESM + CJS for npm consumers — unminified, tree-shakeable
  {
    entry: moduleEntries,
    format: ['esm', 'cjs'],
    dts: true,
    minify: false,
    treeshake: true,
    clean: true,        // runs first; wipes dist once
    outDir: 'dist',
  },
  // IIFE global for <script>/CDN — minified, window.Utilspalooza
  {
    entry: { index: 'src/index.ts' },
    format: ['iife'],
    globalName: 'Utilspalooza',
    dts: false,
    minify: true,
    treeshake: true,
    clean: false,       // must NOT wipe the ESM/CJS output above
    outDir: 'dist',
  },
])
