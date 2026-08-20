import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/gfg-summary': {
        target: 'https://gfg-stats.tashif.codes',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gfg-summary\//, '/')
      },
      '/api/gfg-heatmap': {
        target: 'https://gfg-stats.tashif.codes',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gfg-heatmap\//, '/') + '/heatmap'
      },
      '/api/gfg': {
        target: 'https://gfg-stats.tashif.codes',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gfg\//, '/') + '/stats'
      }
    }
  }
})
