import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function contactApiPlugin() {
  return {
    name: 'contact-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res, next) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}')

              // Bot honeypot check
              if (data.website) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ ok: false, error: 'Spam detected.' }))
                return
              }

              // Test error trigger: email containing 'simulate-error' or name 'ErrorTest'
              if (data.email?.includes('simulate-error') || data.name?.toLowerCase().includes('errortest')) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ ok: false, error: 'Simulated server failure: could not deliver message to inbox.' }))
                return
              }

              // Required field validation
              if (!data.name || !data.email || !data.message) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ ok: false, error: 'Please provide name, email, and message.' }))
                return
              }

              // Basic email format validation
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ ok: false, error: 'Please provide a valid email address.' }))
                return
              }

              // Successful submission
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                ok: true,
                message: 'Your message has been received! Pardeep will review it and follow up within 24 hours.'
              }))
            } catch {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: false, error: 'Invalid JSON payload received.' }))
            }
          })
        } else {
          next()
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), contactApiPlugin()],
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
