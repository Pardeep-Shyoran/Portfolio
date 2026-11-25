import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './Footer.module.css'
import Button from '../Button/Button'
import { smoothScrollTo } from '../../utils/scrollHelper'

const MailIcon = () => (
  <svg className={styles.btnIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const CopyIcon = () => (
  <svg className={styles.btnIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

const CheckIcon = () => (
  <svg className={styles.btnIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const ArrowUpIcon = () => (
  <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m18 15-6-6-6 6" />
  </svg>
)

const ExternalIcon = () => (
  <svg className={styles.extIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </svg>
)

const GitHubIcon = () => (
  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28M7.86 18.5v-8.37H5.07v8.37h2.79z" />
  </svg>
)

const XIcon = () => (
  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const CodolioIcon = () => (
  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

const Footer = () => {
  const [copied, setCopied] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleCopyEmail = async () => {
    const email = 'pardeepshyoran@outlook.com'
    let success = false

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(email)
        success = true
      }
    } catch {
      // Browser permissions or context restriction: fallback to execCommand below
    }

    if (!success) {
      try {
        const textarea = document.createElement('textarea')
        textarea.value = email
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'fixed'
        textarea.style.left = '-9999px'
        textarea.style.top = '-9999px'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        success = document.execCommand('copy')
        document.body.removeChild(textarea)
      } catch (err) {
        console.warn('Clipboard fallback failed:', err)
      }
    }

    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleScrollToTop = () => {
    smoothScrollTo(0)
  }

  const handleNavClick = (e, targetId) => {
    e.preventDefault()
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTarget: targetId } })
    } else {
      if (targetId === 'home') {
        smoothScrollTo(0)
      } else {
        smoothScrollTo(targetId)
      }
    }
  }

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        {/* Restrained Closing Invitation */}
        <div className={styles.invitationSection}>
          <div className={styles.invitationContent}>
            <div className={styles.statusBadge}>
              <span className={styles.statusDot} aria-hidden="true" />
              <span>Available for select opportunities & technical consulting</span>
            </div>
            <h2 className={styles.invitationHeading}>
              Let&apos;s build something exceptional together.
            </h2>
            <p className={styles.invitationText}>
              Whether discussing full-stack systems, frontend polish, or new engineering opportunities, my inbox is always open.
            </p>
          </div>

          <div className={styles.actionRow}>
            <Button
              href="mailto:pardeepshyoran@outlook.com?subject=Let's%20Connect%20-%20Portfolio%20Inquiry"
              variant="primary"
              size="md"
              className={styles.emailCta}
              target="_self"
            >
              <MailIcon />
              <span>pardeepshyoran@outlook.com</span>
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handleCopyEmail}
              className={`${styles.copyBtn} ${copied ? styles.copyBtnSuccess : ''}`}
              aria-label={copied ? 'Email address copied' : 'Copy email address to clipboard'}
            >
              <span className={styles.copyIconWrap}>
                {copied ? <CheckIcon /> : <CopyIcon />}
              </span>
              <span className={styles.copyText}>{copied ? 'Email Copied!' : 'Copy Email'}</span>
            </Button>
          </div>
        </div>

        {/* Directory Grid */}
        <div className={styles.directoryGrid}>
          {/* Brand Info */}
          <div className={styles.brandCol}>
            <div className={styles.brandWordmark}>
              <span>Pardeep Shyoran</span>
              <span className={styles.accentDot} aria-hidden="true">.</span>
            </div>
            <p className={styles.brandBio}>
              Full-stack software engineer engineering resilient web applications, performant user interfaces, and dependable backend APIs.
            </p>
            <div className={styles.locationTag}>
              <span className={styles.locationPin} aria-hidden="true">📍</span>
              <span>Chandigarh, India • IST (UTC+5:30)</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className={styles.navCol}>
            <h3 className={styles.colTitle}>Navigation</h3>
            <ul className={styles.navList} role="list">
              <li>
                <a href="/#home" onClick={(e) => handleNavClick(e, 'home')} className={styles.navLink}>
                  Home
                </a>
              </li>
              <li>
                <a href="/#about" onClick={(e) => handleNavClick(e, 'about')} className={styles.navLink}>
                  About
                </a>
              </li>
              <li>
                <a href="/#featuredProjects" onClick={(e) => handleNavClick(e, 'featuredProjects')} className={styles.navLink}>
                  Projects
                </a>
              </li>
              <li>
                <a href="/#certificates" onClick={(e) => handleNavClick(e, 'certificates')} className={styles.navLink}>
                  Certificates
                </a>
              </li>
              <li>
                <a href="/#stats" onClick={(e) => handleNavClick(e, 'stats')} className={styles.navLink}>
                  Stats
                </a>
              </li>
              <li>
                <a href="/#contact" onClick={(e) => handleNavClick(e, 'contact')} className={styles.navLink}>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Connect & Verified Profiles */}
          <div className={styles.connectCol}>
            <h3 className={styles.colTitle}>Connect</h3>
            <ul className={styles.socialList} role="list">
              <li>
                <a
                  href="https://github.com/Pardeep-Shyoran"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialItem}
                  aria-label="GitHub profile (opens in new tab)"
                >
                  <GitHubIcon />
                  <span className={styles.socialLabel}>GitHub</span>
                  <ExternalIcon />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/pardeepshyoran/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialItem}
                  aria-label="LinkedIn profile (opens in new tab)"
                >
                  <LinkedInIcon />
                  <span className={styles.socialLabel}>LinkedIn</span>
                  <ExternalIcon />
                </a>
              </li>
              <li>
                <a
                  href="https://codolio.com/profile/Pardeep_Shyoran"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialItem}
                  aria-label="Codolio competitive programming profile (opens in new tab)"
                >
                  <CodolioIcon />
                  <span className={styles.socialLabel}>Codolio</span>
                  <ExternalIcon />
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/PardeepShyoran"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialItem}
                  aria-label="X Twitter profile (opens in new tab)"
                >
                  <XIcon />
                  <span className={styles.socialLabel}>X (Twitter)</span>
                  <ExternalIcon />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className={styles.colophonBar}>
          <div className={styles.copyright}>
            &copy; {new Date().getFullYear()} Pardeep Shyoran. All rights reserved.
          </div>

          <div className={styles.techNote}>
            Designed & engineered with precision.
          </div>

          <button
            type="button"
            onClick={handleScrollToTop}
            className={styles.backToTop}
            aria-label="Scroll back to top of page"
          >
            <span>Back to top</span>
            <ArrowUpIcon />
          </button>
        </div>
      </div>

      {/* Stylized Background Watermark */}
      <div className={styles.watermark} aria-hidden="true">
        <span className={styles.watermarkText}>pardeep</span>
      </div>
    </footer>
  )
}

export default Footer
