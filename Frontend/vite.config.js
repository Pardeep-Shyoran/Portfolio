import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { generatePublicAgentAssets, prerenderDistRoutes } from './scripts/agent-assets.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const STATIC_AGENT_HEADERS = {
  '/.well-known/ai-catalog.json': 'application/json; charset=utf-8',
  '/.well-known/ard.json': 'application/json; charset=utf-8',
  '/.well-known/mcp-server-card.json': 'application/json; charset=utf-8',
  '/ai-catalog.json': 'application/json; charset=utf-8',
  '/portfolio.json': 'application/json; charset=utf-8',
  '/llms.txt': 'text/plain; charset=utf-8',
  '/llms-full.txt': 'text/plain; charset=utf-8',
  '/sitemap.xml': 'application/xml; charset=utf-8',
}

function attachAgentStaticMiddleware(server, rootDir) {
  server.middlewares.use((req, res, next) => {
    const cleanPath = (req.url || '/').split('?')[0]
    const contentType =
      STATIC_AGENT_HEADERS[cleanPath] ||
      (cleanPath.endsWith('.md') ? 'text/markdown; charset=utf-8' : null)

    if (!contentType) {
      next()
      return
    }

    const filePath = path.join(rootDir, cleanPath.replace(/^\//, ''))
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      next()
      return
    }

    res.statusCode = 200
    res.setHeader('Content-Type', contentType)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.end(fs.readFileSync(filePath, 'utf8'))
  })
}

function agentAssetsPlugin() {
  const publicDir = path.join(__dirname, 'public')
  const distDir = path.join(__dirname, 'dist')

  return {
    name: 'agent-assets-plugin',
    configureServer(server) {
      generatePublicAgentAssets(publicDir)
      attachAgentStaticMiddleware(server, publicDir)
    },
    configurePreviewServer(server) {
      attachAgentStaticMiddleware(server, distDir)
    },
    buildStart() {
      generatePublicAgentAssets(publicDir)
    },
    closeBundle() {
      prerenderDistRoutes(distDir)
    },
  }
}

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
              const name = typeof data.name === 'string' ? data.name.trim() : ''
              const email = typeof data.email === 'string' ? data.email.trim() : ''
              const message = typeof data.message === 'string' ? data.message.trim() : ''
              const fieldErrors = {}
              if (name.length < 2) fieldErrors.name = 'Name must be at least 2 characters.'
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = 'Please provide a valid email address.'
              if (message.length < 10) fieldErrors.message = 'Message must be at least 10 characters.'

              if (Object.keys(fieldErrors).length > 0) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json; charset=utf-8')
                res.end(JSON.stringify({
                  ok: false,
                  error: Object.values(fieldErrors)[0],
                  fieldErrors
                }))
                return
              }

              // Successful submission
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json; charset=utf-8')
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
  plugins: [react(), contactApiPlugin(), agentAssetsPlugin()],
  build: {
    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter(
          (dep) =>
            !dep.includes('vendor-calendar') &&
            !dep.includes('vendor-gsap') &&
            !dep.includes('vendor-icons')
        ),
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('react-github-calendar') || id.includes('react-activity-calendar') || id.includes('date-fns') || id.includes('@floating-ui')) {
            return 'vendor-calendar'
          }
          if (id.includes('react-icons')) {
            return 'vendor-icons'
          }
          if (id.includes('gsap')) {
            return 'vendor-gsap'
          }
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/scheduler/') ||
            id.includes('react-router') ||
            id.includes('react-helmet')
          ) {
            return 'vendor-react'
          }
          return undefined
        },
      },
    },
  },
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
