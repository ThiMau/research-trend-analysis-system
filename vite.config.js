import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/bookmarks': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/follow': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/premiums': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/invoices': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/payments': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})