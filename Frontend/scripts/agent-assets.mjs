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

export function buildPortfolioJson() {
  return {
    schemaVersion: '1.0',
    generatedAt: new Date().toISOString(),
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

export function buildSitemapXml() {
  const today = new Date().toISOString().slice(0, 10)
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
    <lastmod>${today}</lastmod>
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
  writeOutput(path.join(publicDir, 'portfolio.json'), `${JSON.stringify(buildPortfolioJson(), null, 2)}\n`)
  writeOutput(path.join(publicDir, 'sitemap.xml'), buildSitemapXml())
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

function getRouteMetaList() {
  const base = profileData.siteUrl
  const basePerson = {
    '@type': 'Person',
    name: profileData.name,
    jobTitle: profileData.role,
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
        ],
      },
      bodyHtml: `
        <header>
          <h1>${escapeHtml(profileData.name)} — ${escapeHtml(profileData.role)}</h1>
          <p>${escapeHtml(profileData.headline)}</p>
          <p>${escapeHtml(profileData.summary)}</p>
          <p>Status: ${escapeHtml(profileData.availability.status)} · Location: ${escapeHtml(profileData.location.display)}</p>
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
              <li><a href="/portfolio.json">portfolio.json</a></li>
            </ul>
          </nav>
        </header>
        <main id="main-content">
          <section aria-label="Featured Projects">
            <h2>Featured Projects</h2>
            <ul>
              ${projectsData
                .filter((p) => p.featured)
                .map(
                  (p) =>
                    `<li><a href="/projects/${escapeHtml(p.slug)}"><strong>${escapeHtml(p.title)}</strong></a> — ${escapeHtml(p.shortDescription)} (${escapeHtml(p.tags.join(', '))})</li>`
                )
                .join('\n              ')}
            </ul>
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
          <section aria-label="Contact">
            <h2>Contact</h2>
            <p>Email: <a href="mailto:${escapeHtml(profileData.contact.email)}">${escapeHtml(profileData.contact.email)}</a> · Phone: <a href="${escapeHtml(profileData.contact.phoneHref)}">${escapeHtml(profileData.contact.phone)}</a></p>
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
      bodyHtml: `
        <main id="main-content">
          <h1>About ${escapeHtml(profileData.name)}</h1>
          <p>${escapeHtml(profileData.summary)}</p>
          <h2>Skills &amp; Technologies</h2>
          ${skillsData
            .map(
              (cat) =>
                `<section><h3>${escapeHtml(cat.category)}</h3><ul>${cat.skills
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
      bodyHtml: `
        <main id="main-content">
          <h1>Selected Works</h1>
          <ul>
            ${projectsData
              .map(
                (p) =>
                  `<li><article><h2><a href="/projects/${escapeHtml(p.slug)}">${escapeHtml(p.title)}</a></h2><p>${escapeHtml(p.subtitle)}</p><p>${escapeHtml(p.description)}</p><p>Stack: ${escapeHtml(p.tags.join(', '))}</p><p><a href="${escapeHtml(p.demoUrl)}">Live Demo</a> · <a href="${escapeHtml(p.repoUrl)}">GitHub Repository</a></p></article></li>`
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
      bodyHtml: `
        <main id="main-content">
          <h1>Certifications &amp; Specializations</h1>
          <ul>
            ${certificatesData
              .map(
                (c) =>
                  `<li><article><h2>${escapeHtml(c.title)}</h2><p>${escapeHtml(c.issuer)} (${escapeHtml(c.year)}) · ID: ${escapeHtml(c.credentialId)}</p><p>${escapeHtml(c.summary)}</p><p><a href="${escapeHtml(c.link)}">Verify Credential</a></p></article></li>`
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
      bodyHtml: `
        <main id="main-content">
          <h1>Coding Stats</h1>
          <ul>
            ${profileData.statsSnapshot.summary
              .map((m) => `<li><strong>${escapeHtml(m.label)}</strong>: ${escapeHtml(m.value)} (${escapeHtml(m.hint)})</li>`)
              .join('\n            ')}
          </ul>
          <p><a href="${escapeHtml(profileData.profiles.github.url)}">GitHub</a> · <a href="${escapeHtml(profileData.profiles.leetcode.url)}">LeetCode</a> · <a href="${escapeHtml(profileData.profiles.gfg.url)}">GeeksforGeeks</a> · <a href="${escapeHtml(profileData.profiles.codolio.cardUrl)}">Codolio</a></p>
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
      bodyHtml: `
        <main id="main-content">
          <h1>Contact ${escapeHtml(profileData.name)}</h1>
          <p>Email: <a href="mailto:${escapeHtml(profileData.contact.email)}">${escapeHtml(profileData.contact.email)}</a></p>
          <p>Phone / WhatsApp: <a href="${escapeHtml(profileData.contact.phoneHref)}">${escapeHtml(profileData.contact.phone)}</a></p>
          <p>Location: ${escapeHtml(profileData.location.display)} · Response time: ${escapeHtml(profileData.availability.responseTime)}</p>
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
      bodyHtml: `
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
          </article>
        </main>`,
    })),
  ]

  return routes
}

export function prerenderDistRoutes(distDir) {
  const indexHtmlPath = path.join(distDir, 'index.html')
  if (!fs.existsSync(indexHtmlPath)) return

  const templateHtml = fs.readFileSync(indexHtmlPath, 'utf8')
  const routes = getRouteMetaList()

  for (const item of routes) {
    let html = templateHtml

    // Update <title>
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(item.title)}</title>`)

    // Update meta description
    html = html.replace(
      /<meta\s+name="description"[\s\S]*?\/>/i,
      `<meta name="description" content="${escapeHtml(item.description)}" />`
    )

    // Update canonical link
    html = html.replace(
      /<link\s+rel="canonical"[\s\S]*?\/>/i,
      `<link rel="canonical" href="${escapeHtml(item.canonical)}" />`
    )

    // Inject route-specific alternate markdown link & JSON-LD right before </head>
    const headAdditions = `    <link rel="alternate" type="text/markdown" href="${escapeHtml(item.markdownHref)}" title="Markdown version" />\n    <script type="application/ld+json">${JSON.stringify(item.jsonLd).replace(/<\//g, '<\\/')}</script>\n  </head>`
    html = html.replace('</head>', headAdditions)

    // Inject semantic fallback inside <div id="root">...</div> (React 19 createRoot replaces it on boot)
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${item.bodyHtml}</div>`
    )

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
