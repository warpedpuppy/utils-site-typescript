import { defineConfig } from 'tsup'

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm', 'cjs'],
  dts: true,
  minify: false,
  treeshake: true,
  clean: true,
  outDir: 'dist',
})
