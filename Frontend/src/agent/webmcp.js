import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import profileData from '../data/profile'
import projectsData from '../data/project'
import skillsData from '../data/skills'
import certificatesData from '../data/certificates'
import { statsCache } from '../utils/statsCache'
import { smoothScrollTo } from '../utils/scrollHelper'

const CONTACT_FILL_EVENT = 'portfolio:agent-fill-contact'

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
        'List portfolio projects with optional filtering by technology tag, category, or featured status.',
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
      execute: async () => formatTextResult(certificatesData),
    },
    {
      name: 'get_coding_stats',
      description:
        'Retrieve Pardeep’s coding metrics across GitHub, LeetCode, and GeeksforGeeks (live cached data when available, or verified snapshot).',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      annotations: { readOnlyHint: true, idempotentHint: true },
      execute: async () => {
        const github = statsCache.getRaw('github') || profileData.statsSnapshot.github
        const leetcode = statsCache.getRaw('leetcode') || profileData.statsSnapshot.leetcode
        const gfg = statsCache.getRaw('gfg') || profileData.statsSnapshot.gfg
        return formatTextResult({
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
        'Navigate the portfolio UI to a specific route (/, /about, /projects, /projects/:slug, /certificates, /stats, /contact) or scroll to a home section (home, about, skills, featuredProjects, certificates, stats, contact).',
      inputSchema: {
        type: 'object',
        properties: {
          route: {
            type: 'string',
            description: 'Target route path, e.g. /projects or /projects/kodrax.',
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
          navigate(targetRoute)
          return formatTextResult({ navigatedTo: targetRoute })
        }

        if (sectionId) {
          if (getPathname() !== '/') {
            navigate('/', { state: { scrollTarget: sectionId } })
          } else {
            smoothScrollTo(sectionId === 'home' ? 0 : sectionId)
          }
          return formatTextResult({ scrolledToSection: sectionId })
        }

        return formatTextResult({ error: 'Provide either route or sectionId.' })
      },
    },
    {
      name: 'prepare_or_submit_contact',
      description:
        'Populate the portfolio contact form with inquiry details and optionally submit it.',
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
            description: 'If true, also submit the form immediately after populating fields.',
          },
        },
        required: ['name', 'email', 'message'],
      },
      annotations: { readOnlyHint: false, destructiveHint: false },
      execute: async (input = {}) => {
        const detail = {
          name: String(input.name || ''),
          email: String(input.email || ''),
          inquiryType: input.inquiryType || 'freelance',
          subject: String(input.subject || ''),
          message: String(input.message || ''),
          submit: Boolean(input.submit),
        }

        if (getPathname() !== '/contact' && getPathname() !== '/') {
          navigate('/contact')
          await new Promise((r) => setTimeout(r, 150))
        } else if (getPathname() === '/') {
          smoothScrollTo('contact')
        }

        window.dispatchEvent(new CustomEvent(CONTACT_FILL_EVENT, { detail }))
        return formatTextResult({
          ok: true,
          populated: true,
          submitted: detail.submit,
          note: detail.submit
            ? 'Form populated and submission triggered. Inspect the form status banner for server confirmation or email fallback.'
            : 'Contact form populated for review.',
        })
      },
    },
  ]
}

/**
 * Registers imperative WebMCP tools when `navigator.modelContext` is available
 * and exposes a lightweight read-only discovery registry for agent runtimes.
 */
export function AgentBridge() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const tools = buildToolDefinitions({
      navigate,
      getPathname: () => location.pathname,
    })

    // Expose read-safe runtime metadata for browser automation agents
    if (typeof window !== 'undefined') {
      window.__PORTFOLIO_AGENT_CONTEXT__ = {
        schemaVersion: '1.0',
        llmsTxt: '/llms.txt',
        llmsFullTxt: '/llms-full.txt',
        portfolioJson: '/portfolio.json',
        tools: tools.map((t) => ({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
          execute: t.execute,
        })),
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
  }, [navigate, location.pathname])

  return null
}

export { CONTACT_FILL_EVENT }
