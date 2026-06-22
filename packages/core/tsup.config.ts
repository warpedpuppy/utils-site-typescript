import { defineConfig } from 'tsup'

export default defineConfig([
  // ESM + CJS for npm consumers — unminified, tree-shakeable
  {
    entry: { index: 'src/index.ts' },
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
