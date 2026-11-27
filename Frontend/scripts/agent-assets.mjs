import fs from 'node:fs'
import path from 'node:path'
import profileData from '../src/data/profile.js'
import projectsData from '../src/data/project.js'
import skillsData from '../src/data/skills.js'
import certificatesData from '../src/data/certificates.js'

const escapeXml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const escapeHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const ensureDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true })
}

const writeOutput = (filePath, content) => {
  ensureDir(path.dirname(filePath))
  fs.writeFileSync(filePath, content, 'utf8')
}

function readExistingGeneratedAt(portfolioJsonPath) {
  try {
    if (!fs.existsSync(portfolioJsonPath)) return null
    const parsed = JSON.parse(fs.readFileSync(portfolioJsonPath, 'utf8'))
    return typeof parsed?.generatedAt === 'string' ? parsed.generatedAt : null
  } catch {
    return null
  }
}

function readExistingSitemapLastmod(sitemapPath) {
  try {
    if (!fs.existsSync(sitemapPath)) return null
    const xml = fs.readFileSync(sitemapPath, 'utf8')
    const match = xml.match(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

function readExistingAiCatalogUpdatedAt(catalogPath) {
  try {
    if (!fs.existsSync(catalogPath)) return null
    const parsed = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
    const ts = parsed?.entries?.[0]?.updatedAt
    return typeof ts === 'string' ? ts : null
  } catch {
    return null
  }
}

export function buildMcpServerCardJson() {
  const base = profileData.siteUrl
  return {
    schemaVersion: '1.0',
    name: `${profileData.name} Portfolio WebMCP`,
    protocol: 'webmcp',
    transport: 'navigator.modelContext',
    siteUrl: base,
    documentationUrl: `${base}/llms.txt`,
    tools: [
      {
        name: 'get_developer_profile',
        description:
          'Retrieve Pardeep Shyoran’s developer profile, availability, location, resume URL, direct contact info, and social links.',
        readOnly: true,
      },
      {
        name: 'list_projects',
        description: 'List portfolio projects with optional filtering by technology tag or featured status.',
        readOnly: true,
      },
      {
        name: 'get_project_case_study',
        description: 'Retrieve full case study details for a specific project by slug.',
        readOnly: true,
      },
      {
        name: 'list_skills',
        description: 'List categorized technical skills and tools.',
        readOnly: true,
      },
      {
        name: 'list_certificates',
        description: 'Retrieve verified certifications, credential IDs, issuers, and verification URLs.',
        readOnly: true,
      },
      {
        name: 'get_coding_stats',
        description: 'Retrieve coding metrics across GitHub, LeetCode, and GeeksforGeeks.',
        readOnly: true,
      },
      {
        name: 'navigate_portfolio',
        description: 'Navigate the portfolio UI to a route or scroll to a home section.',
        readOnly: false,
      },
      {
        name: 'prepare_or_submit_contact',
        description: 'Populate the portfolio contact form and optionally submit it.',
        readOnly: false,
      },
      {
        name: 'send_contact_inquiry',
        description: 'Declarative WebMCP contact form at /contact.',
        declarativeForm: `${base}/contact`,
        readOnly: false,
      },
    ],
  }
}

export function buildAiCatalogJson(updatedAt = new Date().toISOString()) {
  const base = profileData.siteUrl
  const hostname = new URL(base).hostname

  return {
    specVersion: '1.0',
    host: {
      displayName: `${profileData.name} — ${profileData.role}`,
      identifier: `did:web:${hostname}`,
      documentationUrl: `${base}/llms.txt`,
      logoUrl: profileData.avatarUrl,
    },
    entries: [
      {
        identifier: `urn:air:${hostname}:dataset:portfolio-json`,
        displayName: 'Structured Portfolio JSON',
        type: 'application/json',
        url: `${base}/portfolio.json`,
        description:
          'Complete structured JSON representation of Pardeep Shyoran’s developer identity, technical skills, project case studies, credentials, coding stats, and canonical routes.',
        tags: ['portfolio', 'full-stack', 'mern', 'developer', 'resume'],
        capabilities: [
          'DeveloperProfile',
          'ProjectCaseStudies',
          'TechnicalSkills',
          'CodingMetrics',
          'Credentials',
        ],
        representativeQueries: [
          'What full-stack projects has Pardeep Shyoran built?',
          'List Pardeep Shyoran’s React, Node.js, and MongoDB skills',
          'Get Pardeep Shyoran’s contact email, availability, and resume URL',
        ],
        version: '1.0.0',
        updatedAt,
      },
      {
        identifier: `urn:air:${hostname}:doc:llms-txt`,
        displayName: 'LLM Context Summary (llms.txt)',
        type: 'text/plain',
        url: `${base}/llms.txt`,
        description:
          'Concise Markdown index of Pardeep Shyoran’s portfolio pages, project case studies, and machine-readable endpoints.',
        tags: ['llms.txt', 'documentation', 'index', 'portfolio'],
        representativeQueries: [
          'Summarize Pardeep Shyoran’s portfolio for an AI agent',
          'Find Markdown endpoints for Pardeep Shyoran’s projects',
        ],
        version: '1.0.0',
        updatedAt,
      },
      {
        identifier: `urn:air:${hostname}:doc:llms-full-txt`,
        displayName: 'Full LLM Portfolio Dossier (llms-full.txt)',
        type: 'text/markdown',
        url: `${base}/llms-full.txt`,
        description:
          'Complete single-file Markdown dossier containing bio, development workflow, skills, all project case studies, certifications, coding metrics, and contact details.',
        tags: ['llms-full.txt', 'markdown', 'case-studies', 'dossier'],
        representativeQueries: [
          'Read detailed case studies for KodraX, Rivo, and Lite-Insta',
          'Inspect Pardeep Shyoran’s verified certifications and coding stats',
        ],
        version: '1.0.0',
        updatedAt,
      },
      {
        identifier: `urn:air:${hostname}:webmcp:portfolio-tools`,
        displayName: 'Portfolio WebMCP Browser Tools',
        type: 'application/mcp-server-card+json',
        url: `${base}/.well-known/mcp-server-card.json`,
        description:
          'Client-side WebMCP tools registered via navigator.modelContext and declarative HTML form attributes for querying portfolio data, navigating routes, and submitting contact inquiries.',
        tags: ['webmcp', 'browser-tools', 'navigation', 'contact-form'],
        capabilities: [
          'get_developer_profile',
          'list_projects',
          'get_project_case_study',
          'list_skills',
          'list_certificates',
          'get_coding_stats',
          'navigate_portfolio',
          'prepare_or_submit_contact',
          'send_contact_inquiry',
        ],
        representativeQueries: [
          'Filter Pardeep Shyoran’s projects by React or Socket.IO',
          'Fetch Pardeep Shyoran’s live GitHub, LeetCode, and GeeksforGeeks coding stats',
          'Submit an employment or freelance inquiry via the portfolio contact form',
        ],
        version: '1.0.0',
        updatedAt,
      },
    ],
  }
}

export function buildPortfolioJson(generatedAt = new Date().toISOString()) {
  return {
    schemaVersion: '1.0',
    generatedAt,
    siteUrl: profileData.siteUrl,
    person: {
      name: profileData.name,
      handle: profileData.handle,
      role: profileData.role,
      headline: profileData.headline,
      summary: profileData.summary,
      location: profileData.location,
      availability: profileData.availability,
      resumeUrl: profileData.resumeUrl,
      contact: profileData.contact,
      profiles: profileData.profiles,
    },
    skills: skillsData,
    projects: projectsData.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      category: p.category,
      role: p.role,
      featured: Boolean(p.featured),
      shortDescription: p.shortDescription,
      description: p.description,
      tags: p.tags,
      demoUrl: p.demoUrl,
      repoUrl: p.repoUrl,
      caseStudyUrl: `${profileData.siteUrl}/projects/${p.slug}`,
      markdownUrl: `${profileData.siteUrl}/projects/${p.slug}.md`,
      problem: p.problem,
      approach: p.approach,
      features: p.features,
      technicalDetails: p.technicalDetails,
      challenges: p.challenges,
      learnings: p.learnings,
    })),
    certificates: certificatesData,
    codingStats: profileData.statsSnapshot,
    routes: [
      { path: '/', title: 'Home', markdown: '/index.md' },
      { path: '/about', title: 'About & Skills', markdown: '/about.md' },
      { path: '/projects', title: 'Projects Archive', markdown: '/projects.md' },
      { path: '/certificates', title: 'Certificates', markdown: '/certificates.md' },
      { path: '/stats', title: 'Coding Stats', markdown: '/stats.md' },
      { path: '/contact', title: 'Contact', markdown: '/contact.md' },
      ...projectsData.map((p) => ({
        path: `/projects/${p.slug}`,
        title: `${p.title} Case Study`,
        markdown: `/projects/${p.slug}.md`,
      })),
    ],
  }
}

export function buildProjectMarkdown(p) {
  const lines = [
    `# ${p.title} — ${p.subtitle}`,
    '',
    `- **Role**: ${p.role}`,
    `- **Category**: ${p.category}`,
    `- **Featured**: ${p.featured ? 'Yes' : 'No'}`,
    `- **Tech Stack**: ${p.tags.join(', ')}`,
    `- **Case Study URL**: ${profileData.siteUrl}/projects/${p.slug}`,
  ]
  if (p.demoUrl) lines.push(`- **Live Demo**: ${p.demoUrl}`)
  if (p.repoUrl) lines.push(`- **Source Code**: ${p.repoUrl}`)

  lines.push('', '## Overview', '', p.description)

  if (p.problem) {
    lines.push('', '## Problem', '', p.problem)
  }
  if (p.approach) {
    lines.push('', '## Engineering Approach', '', p.approach)
  }
  if (p.features?.length) {
    lines.push('', '## Key Features', '')
    for (const f of p.features) {
      lines.push(`- **${f.title}**: ${f.description}`)
    }
  }
  if (p.technicalDetails?.length) {
    lines.push('', '## Technical Implementation', '')
    for (const t of p.technicalDetails) {
      lines.push(`- **${t.area}**: ${t.detail}`)
    }
  }
  if (p.challenges?.length) {
    lines.push('', '## Engineering Challenges & Solutions', '')
    for (const c of p.challenges) {
      lines.push(`- **Challenge**: ${c.challenge}`)
      lines.push(`  - **Solution**: ${c.solution}`)
    }
  }
  if (p.learnings?.length) {
    lines.push('', '## Key Takeaways', '')
    for (const l of p.learnings) {
      lines.push(`- ${l}`)
    }
  }

  return `${lines.join('\n')}\n`
}

export function buildLlmsTxt() {
  const base = profileData.siteUrl
  const featured = projectsData.filter((p) => p.featured)
  const other = projectsData.filter((p) => !p.featured)

  return `# ${profileData.name} — ${profileData.role}

> ${profileData.summary}

- **Canonical URL**: ${base}
- **Status**: ${profileData.availability.status} (${profileData.availability.types.join(', ')})
- **Location**: ${profileData.location.display} · ${profileData.location.timezone}
- **Email**: ${profileData.contact.email}
- **Phone**: ${profileData.contact.phone}
- **Resume**: ${profileData.resumeUrl}

## Machine-Readable Endpoints

- [Full LLM Dossier (${base}/llms-full.txt)](${base}/llms-full.txt): Complete single-file Markdown profile, skills, all project case studies, credentials, and stats.
- [Structured Portfolio JSON (${base}/portfolio.json)](${base}/portfolio.json): Complete JSON representation of identity, projects, skills, certificates, stats, and routes.
- [Agentic Resource Discovery Catalog (${base}/.well-known/ai-catalog.json)](${base}/.well-known/ai-catalog.json): ARD 1.0 capability manifest indexing machine-readable endpoints and WebMCP tools.
- [Sitemap (${base}/sitemap.xml)](${base}/sitemap.xml): Canonical route and case-study index.

## Pages (HTML & Markdown)

- [Home](${base}/) ([Markdown](${base}/index.md)): Hero summary, featured projects, skills, credentials, stats, and contact form.
- [About & Skills](${base}/about) ([Markdown](${base}/about.md)): Engineering philosophy, workflow, architecture stack, and categorized technical skills.
- [Projects Archive](${base}/projects) ([Markdown](${base}/projects.md)): Filterable catalog of ${projectsData.length} full-stack and frontend projects.
- [Certificates](${base}/certificates) ([Markdown](${base}/certificates.md)): Verified credentials and specializations.
- [Coding Stats](${base}/stats) ([Markdown](${base}/stats.md)): GitHub, LeetCode, and GeeksforGeeks metrics.
- [Contact](${base}/contact) ([Markdown](${base}/contact.md)): Direct communication channels and inquiry form.

## Featured Projects

${featured
  .map(
    (p) =>
      `- [${p.title}](${base}/projects/${p.slug}) ([Markdown](${base}/projects/${p.slug}.md)): ${p.shortDescription} Stack: ${p.tags.join(', ')}.`
  )
  .join('\n')}

## Other Projects

${other
  .map(
    (p) =>
      `- [${p.title}](${base}/projects/${p.slug}) ([Markdown](${base}/projects/${p.slug}.md)): ${p.shortDescription}`
  )
  .join('\n')}

## Profiles

- [GitHub](${profileData.profiles.github.url})
- [LinkedIn](${profileData.profiles.linkedin.url})
- [Codolio](${profileData.profiles.codolio.url})
- [LeetCode](${profileData.profiles.leetcode.url})
- [GeeksforGeeks](${profileData.profiles.gfg.url})
- [X (Twitter)](${profileData.profiles.x.url})
`
}

export function buildIndexMarkdown() {
  return `# ${profileData.name} — ${profileData.role}

${profileData.headline}

${profileData.summary}

- **Availability**: ${profileData.availability.status}
- **Location**: ${profileData.location.display}
- **Resume**: ${profileData.resumeUrl}
- **Email**: ${profileData.contact.email}

## Featured Projects

${projectsData
  .filter((p) => p.featured)
  .map(
    (p) =>
      `### [${p.title}](${profileData.siteUrl}/projects/${p.slug})\n${p.subtitle}\n\n${p.shortDescription}\n\n- Stack: ${p.tags.join(', ')}\n- Live Demo: ${p.demoUrl}\n- Repo: ${p.repoUrl}`
  )
  .join('\n\n')}

## Core Tech Stack

${skillsData
  .map((cat) => `- **${cat.category}**: ${cat.skills.map((s) => s.name).join(', ')}`)
  .join('\n')}

## Coding Activity Snapshot

${profileData.statsSnapshot.summary
  .map((m) => `- **${m.label}**: ${m.value} (${m.hint})`)
  .join('\n')}
`
}

export function buildAboutMarkdown() {
  return `# About ${profileData.name}

**Role**: ${profileData.role}
**Location**: ${profileData.location.display}
**Status**: ${profileData.availability.status}

${profileData.summary}

## Development Workflow

1. **UI Architecture & Mobile-First Design**: Semantic layouts, responsive grids, and accessible components before writing state.
2. **Full-Stack API & Schema Integration**: Connecting React frontends to Node.js/Express endpoints with strict validation and JWT auth.
3. **Performance Tuning & Interaction Polish**: Optimizing Core Web Vitals, eliminating layout shifts, and purposeful GSAP animations.
4. **Testing, Audit & Production Shipping**: Validating endpoints in Postman, Git workflows, and containerized deployments.

## Skills & Technologies

${skillsData
  .map((cat) => `### ${cat.category} (${cat.tagline})\n${cat.skills.map((s) => `- ${s.name}`).join('\n')}`)
  .join('\n\n')}
`
}

export function buildProjectsIndexMarkdown() {
  return `# Selected Works — ${profileData.name}

A curated catalog of ${projectsData.length} full-stack platforms, real-time collaboration engines, and frontend experiments.

${projectsData
  .map(
    (p) =>
      `## ${p.title} — ${p.subtitle}\n\n- **Category**: ${p.category}\n- **Role**: ${p.role}\n- **Featured**: ${p.featured ? 'Yes' : 'No'}\n- **Technologies**: ${p.tags.join(', ')}\n- **Case Study**: ${profileData.siteUrl}/projects/${p.slug}\n- **Markdown**: ${profileData.siteUrl}/projects/${p.slug}.md\n- **Live Demo**: ${p.demoUrl}\n- **Repository**: ${p.repoUrl}\n\n${p.description}`
  )
  .join('\n\n')}
`
}

export function buildCertificatesMarkdown() {
  return `# Certificates & Credentials — ${profileData.name}

${certificatesData
  .map(
    (c) =>
      `## ${c.title}\n- **Issuer**: ${c.issuer}\n- **Year**: ${c.year}\n- **Type**: ${c.credentialType}\n- **Credential ID**: \`${c.credentialId}\`\n- **Skills**: ${c.skills.join(', ')}\n- **Verify**: ${c.link}\n\n${c.summary}`
  )
  .join('\n\n')}
`
}

export function buildStatsMarkdown() {
  const s = profileData.statsSnapshot
  return `# Coding Stats — ${profileData.name}

## Summary Metrics

${s.summary.map((m) => `- **${m.label}**: ${m.value} (${m.hint})`).join('\n')}

## GitHub (@${s.github.username})
- Profile: ${profileData.profiles.github.url}
- Public Repositories: ${s.github.publicRepos}
- Followers / Following: ${s.github.followers} / ${s.github.following}

## LeetCode (@${s.leetcode.username})
- Profile: ${profileData.profiles.leetcode.url}
- Total Solved: ${s.leetcode.totalSolved} (Easy: ${s.leetcode.easySolved}, Medium: ${s.leetcode.mediumSolved}, Hard: ${s.leetcode.hardSolved})
- Global Rank: ~${Math.round(s.leetcode.ranking / 1000)}k

## GeeksforGeeks (@${s.gfg.username})
- Profile: ${profileData.profiles.gfg.url}
- Total Solved: ${s.gfg.totalSolved} (Easy: ${s.gfg.easy}, Medium: ${s.gfg.medium}, Basic/School: ${s.gfg.basicSchool})
- Active Days: ${s.gfg.activeDays}

## Codolio
- Card: ${profileData.profiles.codolio.cardUrl}
`
}

export function buildContactMarkdown() {
  return `# Contact ${profileData.name}

Available for: ${profileData.availability.types.join(', ')}. Typical response time: ${profileData.availability.responseTime}.

## Direct Channels

- **Email**: ${profileData.contact.email}
- **Phone / WhatsApp**: ${profileData.contact.phone} (${profileData.location.timezone})
- **Location**: ${profileData.location.display}
- **Resume**: ${profileData.resumeUrl}

## Verified Profiles

- **GitHub**: ${profileData.profiles.github.url}
- **LinkedIn**: ${profileData.profiles.linkedin.url}
- **X (Twitter)**: ${profileData.profiles.x.url}
- **Codolio**: ${profileData.profiles.codolio.url}
`
}

export function buildLlmsFullTxt() {
  return [
    buildIndexMarkdown(),
    '---',
    buildAboutMarkdown(),
    '---',
    buildProjectsIndexMarkdown(),
    '---',
    ...projectsData.map((p) => buildProjectMarkdown(p)),
    '---',
    buildCertificatesMarkdown(),
    '---',
    buildStatsMarkdown(),
    '---',
    buildContactMarkdown(),
  ].join('\n\n')
}

export function buildSitemapXml(lastmod = new Date().toISOString().slice(0, 10)) {
  const urls = [
    { loc: `${profileData.siteUrl}/`, priority: '1.0' },
    { loc: `${profileData.siteUrl}/about`, priority: '0.8' },
    { loc: `${profileData.siteUrl}/projects`, priority: '0.9' },
    ...projectsData.map((p) => ({
      loc: `${profileData.siteUrl}/projects/${p.slug}`,
      priority: p.featured ? '0.85' : '0.75',
    })),
    { loc: `${profileData.siteUrl}/certificates`, priority: '0.7' },
    { loc: `${profileData.siteUrl}/stats`, priority: '0.7' },
    { loc: `${profileData.siteUrl}/contact`, priority: '0.8' },
  ]

  const entries = urls
    .map(
      (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`
}

export function generatePublicAgentAssets(publicDir) {
  writeOutput(path.join(publicDir, 'llms.txt'), buildLlmsTxt())
  writeOutput(path.join(publicDir, 'llms-full.txt'), buildLlmsFullTxt())

  const portfolioJsonPath = path.join(publicDir, 'portfolio.json')
  const existingGeneratedAt = readExistingGeneratedAt(portfolioJsonPath)
  if (existingGeneratedAt) {
    const candidateWithExistingTs = `${JSON.stringify(buildPortfolioJson(existingGeneratedAt), null, 2)}\n`
    const existingRaw = fs.readFileSync(portfolioJsonPath, 'utf8')
    if (candidateWithExistingTs !== existingRaw) {
      writeOutput(portfolioJsonPath, `${JSON.stringify(buildPortfolioJson(), null, 2)}\n`)
    }
  } else {
    writeOutput(portfolioJsonPath, `${JSON.stringify(buildPortfolioJson(), null, 2)}\n`)
  }

  const sitemapPath = path.join(publicDir, 'sitemap.xml')
  const existingLastmod = readExistingSitemapLastmod(sitemapPath)
  if (existingLastmod) {
    const candidateSitemap = buildSitemapXml(existingLastmod)
    const existingSitemap = fs.readFileSync(sitemapPath, 'utf8')
    if (candidateSitemap !== existingSitemap) {
      writeOutput(sitemapPath, buildSitemapXml())
    }
  } else {
    writeOutput(sitemapPath, buildSitemapXml())
  }

  const wellKnownCatalogPath = path.join(publicDir, '.well-known', 'ai-catalog.json')
  const wellKnownArdPath = path.join(publicDir, '.well-known', 'ard.json')
  const rootCatalogPath = path.join(publicDir, 'ai-catalog.json')
  const mcpCardPath = path.join(publicDir, '.well-known', 'mcp-server-card.json')
  const existingCatalogTs = readExistingAiCatalogUpdatedAt(wellKnownCatalogPath)
  let aiCatalogContent
  if (existingCatalogTs) {
    const candidateCatalog = `${JSON.stringify(buildAiCatalogJson(existingCatalogTs), null, 2)}\n`
    const existingCatalogRaw = fs.readFileSync(wellKnownCatalogPath, 'utf8')
    aiCatalogContent =
      candidateCatalog === existingCatalogRaw
        ? existingCatalogRaw
        : `${JSON.stringify(buildAiCatalogJson(), null, 2)}\n`
  } else {
    aiCatalogContent = `${JSON.stringify(buildAiCatalogJson(), null, 2)}\n`
  }
  writeOutput(wellKnownCatalogPath, aiCatalogContent)
  writeOutput(wellKnownArdPath, aiCatalogContent)
  writeOutput(rootCatalogPath, aiCatalogContent)
  writeOutput(mcpCardPath, `${JSON.stringify(buildMcpServerCardJson(), null, 2)}\n`)

  writeOutput(path.join(publicDir, 'index.md'), buildIndexMarkdown())
  writeOutput(path.join(publicDir, 'about.md'), buildAboutMarkdown())
  writeOutput(path.join(publicDir, 'projects.md'), buildProjectsIndexMarkdown())
  writeOutput(path.join(publicDir, 'certificates.md'), buildCertificatesMarkdown())
  writeOutput(path.join(publicDir, 'stats.md'), buildStatsMarkdown())
  writeOutput(path.join(publicDir, 'contact.md'), buildContactMarkdown())

  for (const project of projectsData) {
    writeOutput(path.join(publicDir, 'projects', `${project.slug}.md`), buildProjectMarkdown(project))
  }
}

/* ============================================================================
 * Phase 2: Build-time Static HTML Pre-rendering for Non-JS Agents & Crawlers
 * ============================================================================ */

function renderSharedSiteHeader() {
  return `
      <header>
        <p><strong>${escapeHtml(profileData.name)}</strong> — ${escapeHtml(profileData.role)}</p>
        <p>${escapeHtml(profileData.availability.status)} · ${escapeHtml(profileData.location.display)}</p>
        <nav aria-label="Primary Navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/projects">Projects</a></li>
            <li><a href="/certificates">Certificates</a></li>
            <li><a href="/stats">Coding Stats</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="${escapeHtml(profileData.resumeUrl)}">Resume (PDF)</a></li>
            <li><a href="/llms.txt">llms.txt</a></li>
            <li><a href="/llms-full.txt">llms-full.txt</a></li>
            <li><a href="/portfolio.json">portfolio.json</a></li>
            <li><a href="/.well-known/ai-catalog.json">ai-catalog.json</a></li>
          </ul>
        </nav>
      </header>`
}

function getRouteMetaList() {
  const base = profileData.siteUrl
  const basePerson = {
    '@type': 'Person',
    name: profileData.name,
    jobTitle: profileData.role,
    alternateName: profileData.alternateNames,
    url: base,
    email: `mailto:${profileData.contact.email}`,
    sameAs: [
      profileData.profiles.github.url,
      profileData.profiles.linkedin.url,
      profileData.profiles.x.url,
      profileData.profiles.codolio.url,
    ],
    knowsAbout: skillsData.flatMap((c) => c.skills.map((s) => s.name)),
  }

  const sharedHeader = renderSharedSiteHeader()
  const stats = profileData.statsSnapshot

  const routes = [
    {
      route: '/',
      title: 'Pardeep Shyoran | Full Stack Developer Portfolio',
      description: profileData.summary,
      canonical: `${base}/`,
      markdownHref: `${base}/index.md`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            name: `${profileData.name} Portfolio`,
            url: base,
            description: profileData.summary,
          },
          {
            '@type': 'ProfilePage',
            url: `${base}/`,
            mainEntity: basePerson,
          },
          {
            '@type': 'ItemList',
            name: 'Featured Projects',
            itemListElement: projectsData
              .filter((p) => p.featured)
              .map((p, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: p.title,
                url: `${base}/projects/${p.slug}`,
              })),
          },
        ],
      },
      bodyHtml: `${sharedHeader}
        <main id="main-content">
          <h1>${escapeHtml(profileData.name)} — ${escapeHtml(profileData.role)}</h1>
          <p>${escapeHtml(profileData.headline)}</p>
          <p>${escapeHtml(profileData.summary)}</p>
          <section aria-label="Featured Projects">
            <h2>Featured Projects</h2>
            <ul>
              ${projectsData
                .filter((p) => p.featured)
                .map(
                  (p) =>
                    `<li><a href="/projects/${escapeHtml(p.slug)}"><strong>${escapeHtml(p.title)}</strong></a> — ${escapeHtml(p.shortDescription)} (${escapeHtml(p.tags.join(', '))}) · <a href="/projects/${escapeHtml(p.slug)}.md">Markdown</a></li>`
                )
                .join('\n              ')}
            </ul>
            <p><a href="/projects">Explore All ${projectsData.length} Projects</a></p>
          </section>
          <section aria-label="Core Skills">
            <h2>Skills &amp; Technologies</h2>
            <ul>
              ${skillsData
                .map(
                  (cat) =>
                    `<li><strong>${escapeHtml(cat.category)}</strong>: ${escapeHtml(cat.skills.map((s) => s.name).join(', '))}</li>`
                )
                .join('\n              ')}
            </ul>
          </section>
          <section aria-label="Coding Stats Snapshot">
            <h2>Coding Stats</h2>
            <ul>
              ${stats.summary
                .map((m) => `<li><strong>${escapeHtml(m.label)}</strong>: ${escapeHtml(m.value)} (${escapeHtml(m.hint)})</li>`)
                .join('\n              ')}
            </ul>
          </section>
          <section aria-label="Contact">
            <h2>Contact</h2>
            <p>Email: <a href="mailto:${escapeHtml(profileData.contact.email)}">${escapeHtml(profileData.contact.email)}</a> · Phone: <a href="${escapeHtml(profileData.contact.phoneHref)}">${escapeHtml(profileData.contact.phone)}</a> · <a href="/contact">Contact Form</a></p>
          </section>
        </main>`,
    },
    {
      route: '/about',
      title: 'About | Pardeep Shyoran · Web Developer',
      description:
        'Learn about Pardeep Shyoran’s background, web engineering philosophy, workflow, and full-stack technical skills.',
      canonical: `${base}/about`,
      markdownHref: `${base}/about.md`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        url: `${base}/about`,
        mainEntity: basePerson,
      },
      bodyHtml: `${sharedHeader}
        <main id="main-content">
          <h1>About ${escapeHtml(profileData.name)}</h1>
          <p>${escapeHtml(profileData.summary)}</p>
          <dl>
            <dt>Primary Role</dt><dd>${escapeHtml(profileData.role)}</dd>
            <dt>Location &amp; Status</dt><dd>${escapeHtml(profileData.location.display)} · ${escapeHtml(profileData.availability.status)}</dd>
          </dl>
          <h2>Development Workflow</h2>
          <ol>
            <li><strong>UI Architecture &amp; Mobile-First Design</strong>: Semantic layouts, responsive grids, and accessible components before writing state.</li>
            <li><strong>Full-Stack API &amp; Schema Integration</strong>: Connecting React frontends to Node.js/Express endpoints with strict validation and JWT auth.</li>
            <li><strong>Performance Tuning &amp; Interaction Polish</strong>: Optimizing Core Web Vitals, eliminating layout shifts, and purposeful GSAP animations.</li>
            <li><strong>Testing, Audit &amp; Production Shipping</strong>: Validating endpoints in Postman, Git workflows, and containerized deployments.</li>
          </ol>
          <h2>Engineering Mindset</h2>
          <ul>
            <li><strong>Modular UI Components</strong>: Reusable, self-contained components with clean props.</li>
            <li><strong>Speed Is a Feature</strong>: Lightweight bundles, responsive imagery, and snappy feedback.</li>
            <li><strong>Predictable API Contracts</strong>: Consistent JSON schemas and indexed Mongoose models.</li>
            <li><strong>Universal Accessibility</strong>: Semantic HTML, keyboard navigability, and clear contrast ratios.</li>
          </ul>
          <h2>Skills &amp; Technologies</h2>
          ${skillsData
            .map(
              (cat) =>
                `<section><h3>${escapeHtml(cat.category)} (${escapeHtml(cat.tagline)})</h3><ul>${cat.skills
                  .map((s) => `<li>${escapeHtml(s.name)}</li>`)
                  .join('')}</ul></section>`
            )
            .join('\n          ')}
        </main>`,
    },
    {
      route: '/projects',
      title: 'Projects & Archive | Pardeep Shyoran',
      description:
        'Explore Pardeep Shyoran’s portfolio of production applications, real-time architectures, full-stack systems, and interactive web experiments.',
      canonical: `${base}/projects`,
      markdownHref: `${base}/projects.md`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Selected Works — Pardeep Shyoran',
        url: `${base}/projects`,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: projectsData.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${base}/projects/${p.slug}`,
            name: p.title,
          })),
        },
      },
      bodyHtml: `${sharedHeader}
        <main id="main-content">
          <h1>Selected Works</h1>
          <p>A curated catalog of ${projectsData.length} full-stack platforms, real-time collaboration engines, and frontend experiments.</p>
          <ul>
            ${projectsData
              .map(
                (p) =>
                  `<li><article><h2><a href="/projects/${escapeHtml(p.slug)}">${escapeHtml(p.title)}</a></h2><p>${escapeHtml(p.subtitle)} · ${escapeHtml(p.category)}</p><p>${escapeHtml(p.description)}</p><p>Stack: ${escapeHtml(p.tags.join(', '))}</p><p><a href="/projects/${escapeHtml(p.slug)}">Case Study</a> · <a href="/projects/${escapeHtml(p.slug)}.md">Markdown</a> · <a href="${escapeHtml(p.demoUrl)}">Live Demo</a> · <a href="${escapeHtml(p.repoUrl)}">GitHub Repository</a></p></article></li>`
              )
              .join('\n            ')}
          </ul>
        </main>`,
    },
    {
      route: '/certificates',
      title: 'Certificates & Credentials | Pardeep Shyoran',
      description:
        'Verified certifications and credentials earned by Pardeep Shyoran in MERN stack development and full-stack engineering.',
      canonical: `${base}/certificates`,
      markdownHref: `${base}/certificates.md`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Certificates & Credentials — Pardeep Shyoran',
        url: `${base}/certificates`,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: certificatesData.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'EducationalOccupationalCredential',
              name: c.title,
              credentialCategory: c.credentialType,
              recognizedBy: { '@type': 'Organization', name: c.issuer },
              url: c.link,
            },
          })),
        },
      },
      bodyHtml: `${sharedHeader}
        <main id="main-content">
          <h1>Certifications &amp; Specializations</h1>
          <ul>
            ${certificatesData
              .map(
                (c) =>
                  `<li><article><h2>${escapeHtml(c.title)}</h2><p>${escapeHtml(c.issuer)} (${escapeHtml(c.year)}) · ${escapeHtml(c.credentialType)} · ID: ${escapeHtml(c.credentialId)}</p><p>${escapeHtml(c.summary)}</p><p>Skills: ${escapeHtml(c.skills.join(', '))}</p><p><a href="${escapeHtml(c.link)}">Verify Credential</a></p></article></li>`
              )
              .join('\n            ')}
          </ul>
        </main>`,
    },
    {
      route: '/stats',
      title: 'Coding Stats | Pardeep Shyoran',
      description:
        'Explore Pardeep Shyoran’s coding metrics and problem-solving records across GitHub, LeetCode, and GeeksforGeeks.',
      canonical: `${base}/stats`,
      markdownHref: `${base}/stats.md`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Coding Stats — Pardeep Shyoran',
        url: `${base}/stats`,
        about: basePerson,
      },
      bodyHtml: `${sharedHeader}
        <main id="main-content">
          <h1>Coding Stats</h1>
          <h2>Summary Metrics</h2>
          <ul>
            ${stats.summary
              .map((m) => `<li><strong>${escapeHtml(m.label)}</strong>: ${escapeHtml(m.value)} (${escapeHtml(m.hint)})</li>`)
              .join('\n            ')}
          </ul>
          <h2>GitHub (@${escapeHtml(stats.github.username)})</h2>
          <ul>
            <li>Public Repositories: ${escapeHtml(stats.github.publicRepos)}</li>
            <li>Followers / Following: ${escapeHtml(stats.github.followers)} / ${escapeHtml(stats.github.following)}</li>
            <li><a href="${escapeHtml(profileData.profiles.github.url)}">GitHub Profile</a></li>
          </ul>
          <h2>LeetCode (@${escapeHtml(stats.leetcode.username)})</h2>
          <ul>
            <li>Total Solved: ${escapeHtml(stats.leetcode.totalSolved)} (Easy: ${escapeHtml(stats.leetcode.easySolved)}, Medium: ${escapeHtml(stats.leetcode.mediumSolved)}, Hard: ${escapeHtml(stats.leetcode.hardSolved)})</li>
            <li>Global Rank: ~${escapeHtml(Math.round(stats.leetcode.ranking / 1000))}k</li>
            <li><a href="${escapeHtml(profileData.profiles.leetcode.url)}">LeetCode Profile</a></li>
          </ul>
          <h2>GeeksforGeeks (@${escapeHtml(stats.gfg.username)})</h2>
          <ul>
            <li>Total Solved: ${escapeHtml(stats.gfg.totalSolved)} (Easy: ${escapeHtml(stats.gfg.easy)}, Medium: ${escapeHtml(stats.gfg.medium)}, Basic/School: ${escapeHtml(stats.gfg.basicSchool)})</li>
            <li>Active Days: ${escapeHtml(stats.gfg.activeDays)}</li>
            <li><a href="${escapeHtml(profileData.profiles.gfg.url)}">GeeksforGeeks Profile</a></li>
          </ul>
          <p><a href="${escapeHtml(profileData.profiles.codolio.cardUrl)}">View Codolio Stats Card</a></p>
        </main>`,
    },
    {
      route: '/contact',
      title: 'Contact | Pardeep Shyoran · Full-Stack Software Engineer',
      description:
        'Get in touch with Pardeep Shyoran for full-stack engineering opportunities, freelance projects, and tech collaboration.',
      canonical: `${base}/contact`,
      markdownHref: `${base}/contact.md`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        url: `${base}/contact`,
        mainEntity: {
          ...basePerson,
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'professional inquiries',
            email: profileData.contact.email,
            telephone: profileData.contact.phone,
            availableLanguage: ['English', 'Hindi'],
          },
        },
      },
      bodyHtml: `${sharedHeader}
        <main id="main-content">
          <h1>Contact ${escapeHtml(profileData.name)}</h1>
          <p>Available for: ${escapeHtml(profileData.availability.types.join(', '))}. Response time: ${escapeHtml(profileData.availability.responseTime)}.</p>
          <h2>Direct Channels</h2>
          <ul>
            <li>Email: <a href="mailto:${escapeHtml(profileData.contact.email)}">${escapeHtml(profileData.contact.email)}</a></li>
            <li>Phone / WhatsApp: <a href="${escapeHtml(profileData.contact.phoneHref)}">${escapeHtml(profileData.contact.phone)}</a> (${escapeHtml(profileData.location.timezone)})</li>
            <li>Location: ${escapeHtml(profileData.location.display)}</li>
            <li>Resume: <a href="${escapeHtml(profileData.resumeUrl)}">View Resume PDF</a></li>
          </ul>
          <h2>Verified Profiles</h2>
          <ul>
            <li><a href="${escapeHtml(profileData.profiles.github.url)}">GitHub</a></li>
            <li><a href="${escapeHtml(profileData.profiles.linkedin.url)}">LinkedIn</a></li>
            <li><a href="${escapeHtml(profileData.profiles.x.url)}">X (Twitter)</a></li>
            <li><a href="${escapeHtml(profileData.profiles.codolio.url)}">Codolio</a></li>
          </ul>
        </main>`,
    },
    ...projectsData.map((p) => ({
      route: `/projects/${p.slug}`,
      title: `${p.title} | Case Study | Pardeep Shyoran`,
      description: p.shortDescription || p.description,
      canonical: `${base}/projects/${p.slug}`,
      markdownHref: `${base}/projects/${p.slug}.md`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'SoftwareSourceCode',
            name: p.title,
            description: p.description,
            url: p.demoUrl || `${base}/projects/${p.slug}`,
            codeRepository: p.repoUrl,
            programmingLanguage: p.tags,
            author: { '@type': 'Person', name: profileData.name, url: base },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
              { '@type': 'ListItem', position: 2, name: 'Projects', item: `${base}/projects` },
              { '@type': 'ListItem', position: 3, name: p.title, item: `${base}/projects/${p.slug}` },
            ],
          },
        ],
      },
      bodyHtml: `${sharedHeader}
        <main id="main-content">
          <nav aria-label="Breadcrumb"><a href="/projects">All Projects</a></nav>
          <article>
            <h1>${escapeHtml(p.title)}</h1>
            <p><strong>${escapeHtml(p.subtitle)}</strong></p>
            <p>${escapeHtml(p.description)}</p>
            <p>Role: ${escapeHtml(p.role)} · Category: ${escapeHtml(p.category)}</p>
            <p>Technologies: ${escapeHtml(p.tags.join(', '))}</p>
            <p><a href="${escapeHtml(p.demoUrl)}">Visit Live Application</a> · <a href="${escapeHtml(p.repoUrl)}">GitHub Repository</a> · <a href="/projects/${escapeHtml(p.slug)}.md">Markdown Version</a></p>
            ${p.problem ? `<h2>Problem</h2><p>${escapeHtml(p.problem)}</p>` : ''}
            ${p.approach ? `<h2>Engineering Approach</h2><p>${escapeHtml(p.approach)}</p>` : ''}
            ${
              p.features?.length
                ? `<h2>Key Features</h2><ul>${p.features
                    .map((f) => `<li><strong>${escapeHtml(f.title)}</strong>: ${escapeHtml(f.description)}</li>`)
                    .join('')}</ul>`
                : ''
            }
            ${
              p.technicalDetails?.length
                ? `<h2>Technical Implementation</h2><ul>${p.technicalDetails
                    .map((t) => `<li><strong>${escapeHtml(t.area)}</strong>: ${escapeHtml(t.detail)}</li>`)
                    .join('')}</ul>`
                : ''
            }
            ${
              p.challenges?.length
                ? `<h2>Engineering Challenges &amp; Solutions</h2><ul>${p.challenges
                    .map(
                      (c) =>
                        `<li><strong>Challenge:</strong> ${escapeHtml(c.challenge)}<br /><strong>Solution:</strong> ${escapeHtml(c.solution)}</li>`
                    )
                    .join('')}</ul>`
                : ''
            }
            ${
              p.learnings?.length
                ? `<h2>Key Takeaways</h2><ul>${p.learnings
                    .map((l) => `<li>${escapeHtml(l)}</li>`)
                    .join('')}</ul>`
                : ''
            }
          </article>
        </main>`,
    })),
  ]

  return routes
}

function renderMetaBlock(item) {
  return `<!-- PRERENDER_META_START -->
    <meta
      name="description"
      data-prerendered="true"
      content="${escapeHtml(item.description)}"
    />
    <meta property="og:title" content="${escapeHtml(item.title)}" />
    <meta property="og:description" content="${escapeHtml(item.description)}" />
    <link rel="canonical" data-prerendered="true" href="${escapeHtml(item.canonical)}" />
    <link rel="alternate" type="text/markdown" data-prerendered="true" href="${escapeHtml(item.markdownHref)}" title="Markdown version" />
    <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Context Summary" />
    <link rel="alternate" type="text/plain" href="/llms-full.txt" title="Full LLM Dossier" />
    <link rel="alternate" type="application/json" href="/portfolio.json" title="Structured Portfolio JSON" />
    <link rel="ai-catalog" type="application/json" href="/.well-known/ai-catalog.json" title="Agentic Resource Discovery Catalog" />
    <link rel="ard" type="application/json" href="/.well-known/ard.json" title="Agentic Resource Discovery Manifest" />
    <link rel="sitemap" type="application/xml" href="/sitemap.xml" title="Sitemap" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHtml(item.canonical)}" />
    <meta
      property="og:image"
      content="${escapeHtml(profileData.ogImageUrl)}"
    />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(item.title)}" />
    <meta name="twitter:description" content="${escapeHtml(item.description)}" />
    <meta
      name="twitter:image"
      content="${escapeHtml(profileData.ogImageUrl)}"
    />
    <meta name="twitter:creator" content="@PardeepShyoran" />
    <!-- PRERENDER_META_END -->`
}

function renderJsonLdBlock(item) {
  const json = JSON.stringify(item.jsonLd).replace(/<\//g, '<\\/')
  return `<!-- PRERENDER_JSONLD_START -->
    <script type="application/ld+json" data-prerendered="true">${json}</script>
    <!-- PRERENDER_JSONLD_END -->`
}

export function prerenderDistRoutes(distDir) {
  const indexHtmlPath = path.join(distDir, 'index.html')
  if (!fs.existsSync(indexHtmlPath)) return

  const templateHtml = fs.readFileSync(indexHtmlPath, 'utf8')
  const routes = getRouteMetaList()

  for (const item of routes) {
    let html = templateHtml

    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(item.title)}</title>`)

    html = html.replace(
      /<!-- PRERENDER_META_START -->[\s\S]*?<!-- PRERENDER_META_END -->/,
      renderMetaBlock(item)
    )

    html = html.replace(
      /<!-- PRERENDER_JSONLD_START -->[\s\S]*?<!-- PRERENDER_JSONLD_END -->/,
      renderJsonLdBlock(item)
    )

    const wrappedBody = `<div id="root"><!-- PRERENDER_ROOT_START -->${item.bodyHtml}<!-- PRERENDER_ROOT_END --></div>`
    if (/<!-- PRERENDER_ROOT_START -->/.test(html)) {
      html = html.replace(
        /<div id="root"><!-- PRERENDER_ROOT_START -->[\s\S]*?<!-- PRERENDER_ROOT_END --><\/div>/,
        wrappedBody
      )
    } else {
      html = html.replace('<div id="root"></div>', wrappedBody)
    }

    const targetPath =
      item.route === '/'
        ? indexHtmlPath
        : path.join(distDir, item.route.replace(/^\//, ''), 'index.html')

    writeOutput(targetPath, html)
  }
}

// Allow direct CLI invocation: `node scripts/agent-assets.mjs`
if (import.meta.url === `file://${process.argv[1]}`) {
  const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
  generatePublicAgentAssets(path.join(rootDir, 'public'))
  const distDir = path.join(rootDir, 'dist')
  if (fs.existsSync(path.join(distDir, 'index.html'))) {
    prerenderDistRoutes(distDir)
  }
}
