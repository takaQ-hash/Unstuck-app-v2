/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /api で始まるリクエストを Rails に転送する（/api は外して渡す。/api/up → Rails の /up）。
      // 同じオリジンから呼べるので、CORS と Cookie の問題を避けられる。
      // 転送先は、compose では http://backend:3000、ホストの Node では既定の localhost:3000
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
