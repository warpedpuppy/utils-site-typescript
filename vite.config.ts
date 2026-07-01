import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@utilspalooza/core': fileURLToPath(
        new URL('./packages/core/src', import.meta.url)
      ),
      '@utilspalooza/effects': fileURLToPath(
        new URL('./packages/effects/src', import.meta.url)
      ),
    },
  },
})
