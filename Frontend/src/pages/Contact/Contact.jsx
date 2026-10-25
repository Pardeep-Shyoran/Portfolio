import { useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import ContactForm from './ContactForm'
import styles from './Contact.module.css'

const MailIcon = () => (
  <svg
    className={styles.channelIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const PhoneIcon = () => (
  <svg
    className={styles.channelIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const CopyIcon = () => (
  <svg
    className={styles.btnSmallIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

const CheckIcon = () => (
  <svg
    className={styles.btnSmallIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg
    className={styles.extIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </svg>
)

const LinkedInIcon = () => (
  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28M7.86 18.5v-8.37H5.07v8.37h2.79z" />
  </svg>
)

const GitHubIcon = () => (
  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const XIcon = () => (
  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const CodolioIcon = () => (
  <svg
    className={styles.socialIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

const Contact = () => {
  const location = useLocation()
  const isStandalonePage = location.pathname === '/contact'
  const HeadingTag = isStandalonePage ? 'h1' : 'h2'

  const [activeTab, setActiveTab] = useState('all') // 'all' | 'employment' | 'freelance'
  const [copiedEmail, setCopiedEmail] = useState(false)

  const handleCopyEmail = async () => {
    const email = 'pardeepshyoran@outlook.com'
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(email)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = email
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2500)
    } catch (err) {
      console.error('Failed to copy email', err)
    }
  }

  const socialLinks = useMemo(
    () => [
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/pardeepshyoran/',
        label: 'Connect & InMail',
        icon: <LinkedInIcon />
      },
      {
        name: 'GitHub',
        url: 'https://github.com/Pardeep-Shyoran',
        label: 'Code & Repositories',
        icon: <GitHubIcon />
      },
      {
        name: 'X (Twitter)',
        url: 'https://x.com/PardeepShyoran',
        label: 'Async Tech Updates',
        icon: <XIcon />
      },
      {
        name: 'Codolio',
        url: 'https://codolio.com/profile/Pardeep_Shyoran',
        label: 'Problem Solving Profile',
        icon: <CodolioIcon />
      }
    ],
    []
  )

  const opportunityMessaging = {
    all: {
      tag: 'Open for Collaboration',
      title: 'Discuss Employment or Freelance Projects',
      description:
        'Whether you have an open engineering headcount, need a battle-tested developer for a client engagement, or want to discuss full-stack architecture—let’s talk.'
    },
    employment: {
      tag: 'Full-Time & Contract Roles',
      title: 'Full-Stack Software Engineering',
      description:
        'Available for Full-Stack (MERN) and Frontend engineering positions. Ready to hit the ground running with React, Node.js, Express, clean APIs, and maintainable systems.'
    },
    freelance: {
      tag: 'Freelance & Sprints',
      title: 'Project Builds, MVPs & Audits',
      description:
        'Partnering with founders and design teams to ship MVPs, high-performance web applications, and UI/UX component libraries on predictable timelines.'
    }
  }

  return (
    <>
      {isStandalonePage && (
        <Helmet>
          <title>Contact | Pardeep Shyoran · Full-Stack Software Engineer</title>
          <meta
            name="description"
            content="Get in touch with Pardeep Shyoran for full-stack engineering opportunities, freelance projects, and tech collaboration."
          />
          <meta
            name="keywords"
            content="Contact Pardeep Shyoran, Hire Full Stack Developer, Freelance React Engineer, Web Development Collaboration"
          />
          <link rel="canonical" href="https://pardeep-shyoran.me/contact" />
        </Helmet>
      )}

      <section id="contact" className={styles.contactSection} aria-label="Contact Section">
        {/* Section Header */}
        <header className={styles.header}>
          <span className={styles.kicker}>Get in Touch</span>
          <HeadingTag className={styles.title}>Let’s build what’s next</HeadingTag>
          <p className={styles.subtitle}>
            Have an open role, an ambitious project, or an engineering challenge to solve?
            Reach out via the form or direct channels below. I respond within 24 hours.
          </p>

          {/* Opportunity Perspective Tabs */}
          <div
            className={styles.perspectiveTabs}
            role="tablist"
            aria-label="Opportunity category switcher"
          >
            {[
              { id: 'all', label: 'All Inquiries' },
              { id: 'employment', label: 'Full-Time Roles' },
              { id: 'freelance', label: 'Freelance & Sprints' }
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={activeTab === tab.id}
                className={`${styles.tabBtn} ${
                  activeTab === tab.id ? styles.tabBtnActive : ''
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* Opportunity Context Banner */}
        <div className={styles.opportunityBanner}>
          <div className={styles.opportunityBadge}>
            <span className={styles.livePulse} aria-hidden="true" />
            <span>{opportunityMessaging[activeTab].tag}</span>
          </div>
          <div className={styles.opportunityText}>
            <h3 className={styles.opportunityTitle}>{opportunityMessaging[activeTab].title}</h3>
            <p className={styles.opportunityDesc}>{opportunityMessaging[activeTab].description}</p>
          </div>
        </div>

        {/* Main 2-Column Content Grid */}
        <div className={styles.contentGrid}>
          {/* Column 1: Direct Contact & Verified Channels */}
          <div className={styles.channelsCol}>
            {/* Primary Direct Contact Card */}
            <article className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardHeading}>Direct Communication</h3>
                <span className={styles.cardTag}>Fastest Response</span>
              </div>

              <div className={styles.channelsList}>
                {/* Email Item */}
                <div className={styles.channelItem}>
                  <div className={styles.channelIconWrap}>
                    <MailIcon />
                  </div>
                  <div className={styles.channelContent}>
                    <span className={styles.channelLabel}>Email Address</span>
                    <a
                      href="mailto:pardeepshyoran@outlook.com"
                      className={styles.channelLink}
                    >
                      pardeepshyoran@outlook.com
                    </a>
                    <div className={styles.channelActionRow}>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className={styles.copyBtn}
                        aria-label={
                          copiedEmail
                            ? 'Email address copied to clipboard'
                            : 'Copy email address to clipboard'
                        }
                      >
                        {copiedEmail ? <CheckIcon /> : <CopyIcon />}
                        <span>{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
                      </button>
                      <a
                        href="mailto:pardeepshyoran@outlook.com"
                        className={styles.sendMailLink}
                      >
                        Send Email →
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone Item */}
                <div className={styles.channelItem}>
                  <div className={styles.channelIconWrap}>
                    <PhoneIcon />
                  </div>
                  <div className={styles.channelContent}>
                    <span className={styles.channelLabel}>Phone / WhatsApp</span>
                    <a href="tel:+919729775889" className={styles.channelLink}>
                      +91 97297 75889
                    </a>
                    <span className={styles.channelDetail}>
                      IST (UTC+5:30) • Open for scheduled calls
                    </span>
                  </div>
                </div>
              </div>

              {/* Working Parameters */}
              <div className={styles.metaBox}>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Location:</span>
                  <span className={styles.metaValue}>Chandigarh, India (Remote-friendly)</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Response time:</span>
                  <span className={styles.metaValue}>Under 24 hours</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Working style:</span>
                  <span className={styles.metaValue}>Async updates, Git PRs, milestone slices</span>
                </div>
              </div>
            </article>

            {/* Verified Professional Profiles Card */}
            <article className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardHeading}>Verified Profiles</h3>
                <span className={styles.cardTag}>Professional Links</span>
              </div>
              <ul className={styles.socialGrid} role="list">
                {socialLinks.map((item) => (
                  <li key={item.name} className={styles.socialListItem}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialCardLink}
                      aria-label={`${item.name} (opens in a new tab)`}
                    >
                      <div className={styles.socialIconWrap}>{item.icon}</div>
                      <div className={styles.socialDetails}>
                        <span className={styles.socialName}>{item.name}</span>
                        <span className={styles.socialSub}>{item.label}</span>
                      </div>
                      <ExternalLinkIcon />
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          {/* Column 2: Interactive Contact Form */}
          <div className={styles.formCol}>
            <article className={`${styles.card} ${styles.formCard}`}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardHeading}>Send a Message</h3>
                  <p className={styles.cardSub}>
                    Direct transmission to Pardeep. Required fields are marked with *
                  </p>
                </div>
              </div>
              <ContactForm
                initialInquiryType={
                  activeTab === 'employment'
                    ? 'employment'
                    : activeTab === 'freelance'
                    ? 'freelance'
                    : 'freelance'
                }
              />
            </article>
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact
