import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': {
        target: 'http://localhost:1045',
        changeOrigin: true,
      },
      '/event': {
        target: 'http://localhost:1045',
        changeOrigin: true,
      },
      '/events': {
        target: 'http://localhost:1045',
        changeOrigin: true,
      }
    }
  },
  build: {
    rollupOptions: {
      // external: ['jspdf']
    }
  }
})
