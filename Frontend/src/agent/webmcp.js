import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import profileData from '../data/profile'
import projectsData from '../data/project'
import { smoothScrollTo } from '../utils/scrollHelper'
import { requestSectionMount } from '../utils/sectionMount'

const CONTACT_FILL_EVENT = 'portfolio:agent-fill-contact'
const CONTACT_RESULT_EVENT = 'portfolio:agent-contact-result'

const VALID_STATIC_ROUTES = new Set([
  '/',
  '/about',
  '/projects',
  '/certificates',
  '/stats',
  '/contact',
])

const VALID_HOME_SECTIONS = new Set([
  'home',
  'about',
  'skills',
  'featuredProjects',
  'certificates',
  'stats',
  'contact',
])

const loadSkillsData = () => import('../data/skills').then((m) => m.default)
const loadCertificatesData = () => import('../data/certificates').then((m) => m.default)
const loadStatsCache = () => import('../utils/statsCache').then((m) => m.statsCache)

function formatTextResult(payload) {
  return {
    content: [
      {
        type: 'text',
        text: typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2),
      },
    ],
  }
}

function waitForElement(elementId, timeoutMs = 2500) {
  if (typeof document === 'undefined') return Promise.resolve(null)
  const existing = document.getElementById(elementId)
  if (existing) return Promise.resolve(existing)

  return new Promise((resolve) => {
    const start = Date.now()
    const check = () => {
      const el = document.getElementById(elementId)
      if (el) {
        observer.disconnect()
        resolve(el)
        return
      }
      if (Date.now() - start >= timeoutMs) {
        observer.disconnect()
        resolve(null)
      }
    }

    const observer = new MutationObserver(check)
    observer.observe(document.body, { childList: true, subtree: true })
    setTimeout(() => {
      observer.disconnect()
      resolve(document.getElementById(elementId))
    }, timeoutMs)
  })
}

function waitForSelector(selector, timeoutMs = 3000) {
  if (typeof document === 'undefined') return Promise.resolve(null)
  const existing = document.querySelector(selector)
  if (existing) return Promise.resolve(existing)

  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector)
      if (el) {
        observer.disconnect()
        resolve(el)
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
    setTimeout(() => {
      observer.disconnect()
      resolve(document.querySelector(selector))
    }, timeoutMs)
  })
}

async function fetchJsonWithTimeout(url, timeoutMs = 4500) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

function isKnownRoute(rawRoute) {
  if (typeof rawRoute !== 'string' || !rawRoute.startsWith('/')) return false
  const cleanPath = rawRoute.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/'
  if (VALID_STATIC_ROUTES.has(cleanPath)) return true
  if (cleanPath.startsWith('/projects/')) {
    const slug = cleanPath.slice('/projects/'.length)
    return projectsData.some((p) => p.slug === slug)
  }
  return false
}

function buildToolDefinitions({ navigate, getPathname }) {
  return [
    {
      name: 'get_developer_profile',
      description:
        'Retrieve Pardeep Shyoran’s developer profile, availability, location, resume URL, direct contact info, and social links.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      annotations: { readOnlyHint: true, idempotentHint: true },
      execute: async () =>
        formatTextResult({
          name: profileData.name,
          handle: profileData.handle,
          role: profileData.role,
          headline: profileData.headline,
          summary: profileData.summary,
          availability: profileData.availability,
          location: profileData.location,
          resumeUrl: profileData.resumeUrl,
          contact: profileData.contact,
          profiles: profileData.profiles,
          siteUrl: profileData.siteUrl,
        }),
    },
    {
      name: 'list_projects',
      description:
        'List portfolio projects with optional filtering by technology tag or featured status.',
      inputSchema: {
        type: 'object',
        properties: {
          tag: {
            type: 'string',
            description: 'Optional technology filter (e.g. React, Node.js, MongoDB, Socket.IO, JavaScript).',
          },
          featuredOnly: {
            type: 'boolean',
            description: 'If true, return only featured projects.',
          },
        },
      },
      annotations: { readOnlyHint: true, idempotentHint: true },
      execute: async (input = {}) => {
        const tagQuery = typeof input.tag === 'string' ? input.tag.trim().toLowerCase() : ''
        const featuredOnly = Boolean(input.featuredOnly)

        const filtered = projectsData.filter((p) => {
          if (featuredOnly && !p.featured) return false
          if (tagQuery) {
            return p.tags?.some((t) => t.toLowerCase().includes(tagQuery))
          }
          return true
        })

        return formatTextResult({
          count: filtered.length,
          projects: filtered.map((p) => ({
            slug: p.slug,
            title: p.title,
            subtitle: p.subtitle,
            category: p.category,
            role: p.role,
            featured: Boolean(p.featured),
            shortDescription: p.shortDescription,
            tags: p.tags,
            caseStudyPath: `/projects/${p.slug}`,
            caseStudyUrl: `${profileData.siteUrl}/projects/${p.slug}`,
            markdownUrl: `${profileData.siteUrl}/projects/${p.slug}.md`,
            demoUrl: p.demoUrl,
            repoUrl: p.repoUrl,
          })),
        })
      },
    },
    {
      name: 'get_project_case_study',
      description:
        'Retrieve full case study details for a specific project by slug (e.g. kodrax, rivo, lite-insta, moodswinger, fokus, windows-11, github-profile-search).',
      inputSchema: {
        type: 'object',
        properties: {
          slug: {
            type: 'string',
            description: 'Unique project slug identifier.',
          },
        },
        required: ['slug'],
      },
      annotations: { readOnlyHint: true, idempotentHint: true },
      execute: async (input = {}) => {
        const slug = String(input.slug || '').trim().toLowerCase()
        const project = projectsData.find((p) => p.slug.toLowerCase() === slug)
        if (!project) {
          return formatTextResult({
            ok: false,
            error: `Project with slug "${slug}" not found.`,
            availableSlugs: projectsData.map((p) => p.slug),
          })
        }
        return formatTextResult(project)
      },
    },
    {
      name: 'list_skills',
      description:
        'List categorized technical skills and tools (frontend, backend, database, tools).',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['all', 'frontend', 'backend', 'database', 'tools'],
            description: 'Optional skill category ID.',
          },
        },
      },
      annotations: { readOnlyHint: true, idempotentHint: true },
      execute: async (input = {}) => {
        const skillsData = await loadSkillsData()
        const category = String(input.category || 'all').toLowerCase()
        const result =
          category === 'all'
            ? skillsData
            : skillsData.filter((c) => c.id.toLowerCase() === category)
        return formatTextResult(result)
      },
    },
    {
      name: 'list_certificates',
      description:
        'Retrieve verified certifications, credential IDs, issuers, covered skills, and verification URLs.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      annotations: { readOnlyHint: true, idempotentHint: true },
      execute: async () => formatTextResult(await loadCertificatesData()),
    },
    {
      name: 'get_coding_stats',
      description:
        'Retrieve Pardeep’s coding metrics across GitHub, LeetCode, and GeeksforGeeks (live or cached data with verified snapshot fallback).',
      inputSchema: {
        type: 'object',
        properties: {
          refresh: {
            type: 'boolean',
            description: 'If true, attempt to fetch fresh live metrics from platform APIs before falling back to cache/snapshot.',
          },
        },
      },
      annotations: { readOnlyHint: true, idempotentHint: true },
      execute: async (input = {}) => {
        const statsCache = await loadStatsCache()

        const forceRefresh = Boolean(input.refresh)
        const ghUser = profileData.statsSnapshot.github.username
        const lcUser = profileData.statsSnapshot.leetcode.username
        const gfgUser = profileData.statsSnapshot.gfg.username

        let github = !forceRefresh ? statsCache.get('github') : null
        let leetcode = !forceRefresh ? statsCache.get('leetcode') : null
        let gfg = !forceRefresh ? statsCache.get('gfg') : null

        const sources = {
          github: github ? 'cache' : 'snapshot',
          leetcode: leetcode ? 'cache' : 'snapshot',
          gfg: gfg ? 'cache' : 'snapshot',
        }

        if (forceRefresh || !github || !leetcode || !gfg) {
          const [ghRes, lcRes, gfgStatsRes, gfgSummaryRes] = await Promise.allSettled([
            !github ? fetchJsonWithTimeout(`https://api.github.com/users/${ghUser}`) : Promise.resolve(null),
            !leetcode ? fetchJsonWithTimeout(`https://leetcode-api-faisalshohag.vercel.app/${lcUser}`) : Promise.resolve(null),
            !gfg ? fetchJsonWithTimeout(`/api/gfg/${gfgUser}`) : Promise.resolve(null),
            !gfg ? fetchJsonWithTimeout(`/api/gfg-summary/${gfgUser}`) : Promise.resolve(null),
          ])

          if (!github && ghRes.status === 'fulfilled' && ghRes.value?.login) {
            github = ghRes.value
            statsCache.set('github', github)
            sources.github = 'live'
          }
          if (!leetcode && lcRes.status === 'fulfilled' && typeof lcRes.value?.totalSolved === 'number') {
            leetcode = lcRes.value
            statsCache.set('leetcode', leetcode)
            sources.leetcode = 'live'
          }
          if (!gfg) {
            const gfgStatsOk = gfgStatsRes.status === 'fulfilled' && gfgStatsRes.value?.data?.totalSolved
            const gfgSummaryOk = gfgSummaryRes.status === 'fulfilled' && gfgSummaryRes.value?.data?.totalActiveDays
            if (gfgStatsOk || gfgSummaryOk) {
              const s = gfgStatsOk ? gfgStatsRes.value.data : {}
              const sum = gfgSummaryOk ? gfgSummaryRes.value.data : {}
              gfg = {
                totalSolved: s.totalSolved ?? profileData.statsSnapshot.gfg.totalSolved,
                easy: s.byDifficulty?.easy ?? profileData.statsSnapshot.gfg.easy,
                medium: s.byDifficulty?.medium ?? profileData.statsSnapshot.gfg.medium,
                basicSchool:
                  s.byDifficulty
                    ? (s.byDifficulty.basic ?? 0) + (s.byDifficulty.school ?? 0)
                    : profileData.statsSnapshot.gfg.basicSchool,
                activeDays: sum.totalActiveDays ?? profileData.statsSnapshot.gfg.activeDays,
              }
              statsCache.set('gfg', gfg)
              sources.gfg = 'live'
            }
          }
        }

        if (!github) {
          github = statsCache.getRaw('github') || profileData.statsSnapshot.github
          if (statsCache.getRaw('github')) sources.github = 'stale-cache'
        }
        if (!leetcode) {
          leetcode = statsCache.getRaw('leetcode') || profileData.statsSnapshot.leetcode
          if (statsCache.getRaw('leetcode')) sources.leetcode = 'stale-cache'
        }
        if (!gfg) {
          gfg = statsCache.getRaw('gfg') || profileData.statsSnapshot.gfg
          if (statsCache.getRaw('gfg')) sources.gfg = 'stale-cache'
        }

        return formatTextResult({
          fetchedAt: new Date().toISOString(),
          sources,
          summary: profileData.statsSnapshot.summary,
          github,
          leetcode,
          gfg,
          codolioCardUrl: profileData.profiles.codolio.cardUrl,
        })
      },
    },
    {
      name: 'navigate_portfolio',
      description:
        'Navigate the portfolio UI to a specific route (/, /about, /projects, /projects?tag=React, /projects/:slug, /certificates, /stats, /contact) or scroll to a home section (home, about, skills, featuredProjects, certificates, stats, contact).',
      inputSchema: {
        type: 'object',
        properties: {
          route: {
            type: 'string',
            description: 'Target route path, e.g. /projects, /projects?tag=React, or /projects/kodrax.',
          },
          sectionId: {
            type: 'string',
            description:
              'Optional section ID on the home page (home, about, skills, featuredProjects, certificates, stats, contact).',
          },
        },
      },
      annotations: { readOnlyHint: false, idempotentHint: true },
      execute: async (input = {}) => {
        const targetRoute = typeof input.route === 'string' ? input.route.trim() : ''
        const sectionId = typeof input.sectionId === 'string' ? input.sectionId.trim() : ''

        if (targetRoute) {
          if (!isKnownRoute(targetRoute)) {
            return formatTextResult({
              ok: false,
              error: `Unknown route "${targetRoute}".`,
              availableRoutes: [
                ...VALID_STATIC_ROUTES,
                ...projectsData.map((p) => `/projects/${p.slug}`),
              ],
            })
          }
          navigate(targetRoute)
          return formatTextResult({ ok: true, navigatedTo: targetRoute })
        }

        if (sectionId) {
          if (!VALID_HOME_SECTIONS.has(sectionId)) {
            return formatTextResult({
              ok: false,
              error: `Unknown sectionId "${sectionId}".`,
              availableSections: [...VALID_HOME_SECTIONS],
            })
          }

          requestSectionMount(sectionId)

          if (getPathname() !== '/') {
            navigate('/', { state: { scrollTarget: sectionId } })
            await waitForElement(sectionId === 'home' ? 'home' : sectionId, 2500)
          } else {
            await waitForElement(sectionId === 'home' ? 'home' : sectionId, 2500)
            smoothScrollTo(sectionId === 'home' ? 0 : sectionId)
          }
          return formatTextResult({ ok: true, scrolledToSection: sectionId })
        }

        return formatTextResult({ ok: false, error: 'Provide either route or sectionId.' })
      },
    },
    {
      name: 'prepare_or_submit_contact',
      description:
        'Populate the portfolio contact form with inquiry details and optionally submit it, returning validation or delivery status.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Sender full name (min 2 chars).' },
          email: { type: 'string', description: 'Valid reply-to email address.' },
          inquiryType: {
            type: 'string',
            enum: ['freelance', 'employment', 'consulting', 'general'],
            description: 'Category of inquiry.',
          },
          subject: { type: 'string', description: 'Optional inquiry subject.' },
          message: { type: 'string', description: 'Detailed message (min 10 chars).' },
          submit: {
            type: 'boolean',
            description: 'If true, submit the form after populating fields and wait for server/validation outcome.',
          },
        },
        required: ['name', 'email', 'message'],
      },
      annotations: { readOnlyHint: false, destructiveHint: false },
      execute: async (input = {}) => {
        const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
        const detail = {
          requestId,
          name: String(input.name || ''),
          email: String(input.email || ''),
          inquiryType: input.inquiryType || 'freelance',
          subject: String(input.subject || ''),
          message: String(input.message || ''),
          submit: Boolean(input.submit),
        }

        const currentPath = getPathname()
        if (currentPath !== '/contact' && currentPath !== '/') {
          navigate('/contact')
        } else if (currentPath === '/') {
          requestSectionMount('contact')
          smoothScrollTo('contact')
        }

        const readyNode = await waitForSelector('[data-contact-form-ready="true"]', 3000)
        if (!readyNode) {
          return formatTextResult({
            ok: false,
            error: 'Contact form did not mount within timeout.',
          })
        }

        const outcome = await new Promise((resolve) => {
          const timer = setTimeout(() => {
            window.removeEventListener(CONTACT_RESULT_EVENT, onResult)
            resolve({
              ok: false,
              error: 'Timed out waiting for contact form response.',
            })
          }, 15000)

          const onResult = (event) => {
            if (event.detail?.requestId !== requestId) return
            clearTimeout(timer)
            window.removeEventListener(CONTACT_RESULT_EVENT, onResult)
            resolve(event.detail)
          }

          window.addEventListener(CONTACT_RESULT_EVENT, onResult)
          window.dispatchEvent(new CustomEvent(CONTACT_FILL_EVENT, { detail }))
        })

        return formatTextResult(outcome)
      },
    },
  ]
}

/**
 * Registers imperative WebMCP tools when `navigator.modelContext` is available
 * and exposes a lightweight discovery & invocation registry for agent runtimes.
 */
export function AgentBridge() {
  const navigate = useNavigate()
  const location = useLocation()
  const pathnameRef = useRef(location.pathname)

  useEffect(() => {
    pathnameRef.current = location.pathname
  }, [location.pathname])

  useEffect(() => {
    const tools = buildToolDefinitions({
      navigate,
      getPathname: () => pathnameRef.current,
    })

    if (typeof window !== 'undefined') {
      const toolMap = new Map(tools.map((t) => [t.name, t]))
      window.__PORTFOLIO_AGENT_CONTEXT__ = {
        schemaVersion: '1.1',
        llmsTxt: '/llms.txt',
        llmsFullTxt: '/llms-full.txt',
        portfolioJson: '/portfolio.json',
        aiCatalogJson: '/.well-known/ai-catalog.json',
        sitemapXml: '/sitemap.xml',
        routes: [
          '/',
          '/about',
          '/projects',
          '/certificates',
          '/stats',
          '/contact',
          ...projectsData.map((p) => `/projects/${p.slug}`),
        ],
        tools: tools.map((t) => ({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
          annotations: t.annotations,
          execute: t.execute,
        })),
        invoke: async (name, input = {}) => {
          const tool = toolMap.get(name)
          if (!tool) {
            return formatTextResult({ ok: false, error: `Unknown tool "${name}".` })
          }
          return tool.execute(input)
        },
      }
    }

    const mc = typeof navigator !== 'undefined' ? navigator.modelContext : null
    if (!mc || typeof mc.registerTool !== 'function') {
      return undefined
    }

    const cleanups = []
    for (const tool of tools) {
      try {
        const registration = mc.registerTool(tool)
        if (registration && typeof registration.unregister === 'function') {
          cleanups.push(() => registration.unregister())
        } else if (typeof mc.unregisterTool === 'function') {
          cleanups.push(() => mc.unregisterTool(tool.name))
        }
      } catch {
        // Ignore duplicate or unsupported tool registration errors gracefully
      }
    }

    return () => {
      for (const cleanup of cleanups) {
        try {
          cleanup()
        } catch {
          // Ignore cleanup errors
        }
      }
    }
  }, [navigate])

  return null
}

export { CONTACT_FILL_EVENT, CONTACT_RESULT_EVENT }
