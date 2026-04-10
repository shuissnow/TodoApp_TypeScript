/// <reference types="vitest" />
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    watch: {
      usePolling: true,
    },
    hmr: {
      clientPort: 5173,
    },
  },
  build:{
    sourcemap: true
  },
  test: {
    environment: 'happy-dom',
    reporters: process.env.GITHUB_ACTIONS ? ['github-actions', 'verbose'] : ['verbose'],
  },
})
