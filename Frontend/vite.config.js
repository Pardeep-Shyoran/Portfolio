import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/gfg': {
        target: 'https://gfgstatscard.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gfg/, '') + '?raw=true'
      }
    }
  }
})
