import { useState, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Skills from "../Skills/Skills";
import Button from "../../components/Button/Button";
import StructuredData from "../../components/StructuredData/StructuredData";
import profileData from "../../data/profile";
import skillsData from "../../data/skills";
import { smoothScrollTo, prefersReducedMotion, refreshScrollTriggers } from "../../utils/scrollHelper";
import styles from "./About.module.css";

gsap.registerPlugin(ScrollTrigger);

const DARK_THEME_LOGO = 'https://ik.imagekit.io/00zfvrear/Images/Minimalist%20Cream%20Ribbon%20F%20Logo.png?updatedAt=1792666504824';
const LIGHT_THEME_LOGO = 'https://ik.imagekit.io/00zfvrear/Images/Abstract%20S-P%20Monogram%20Emblem-Photoroom.png?updatedAt=1792666504838';

const About = () => {
  const location = useLocation();
  const isStandalonePage = location.pathname === "/about";
  const [activeTab, setActiveTab] = useState("workflow");
  const sectionRef = useRef(null);
  const ctaRef = useRef(null);

  // Smooth scroll helper for section CTA buttons
  const handleNavigate = (e, targetId) => {
    e?.preventDefault?.();
    smoothScrollTo(targetId, { duration: 0.8, offsetY: 80 });
  };

  // Quick Specifications for Web Developer Identity
  const quickSpecs = useMemo(
    () => [
      {
        label: "Primary Role",
        value: "Full-Stack Web Developer",
        detail: "Interactive Frontends + Resilient APIs",
      },
      {
        label: "Core Stack",
        value: "React · Node.js · Express · MongoDB",
        detail: "Modern JavaScript (ES6+) & MERN",
      },
      {
        label: "Web Standards",
        value: "Semantic HTML5 · Responsive UI",
        detail: "WCAG Accessibility & Clean CSS",
      },
      {
        label: "Location & Status",
        value: "Haryana, India · Remote Ready",
        detail: "Available for Worldwide Roles",
      },
    ],
    [],
  );

  // GSAP entrance animation on scroll & refresh triggers after lazy mount
  useGSAP(
    () => {
      refreshScrollTriggers();

      if (prefersReducedMotion() || !sectionRef.current) return;

      const animElements = sectionRef.current.querySelectorAll("[data-about-anim]");
      if (animElements && animElements.length > 0) {
        gsap.fromTo(
          animElements,
          {
            opacity: 0,
            y: 24,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.08,
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 82%",
              once: true,
            },
          },
        );
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 88%",
              once: true,
            },
          },
        );
      }
    },
    { scope: sectionRef },
  );

  // Dynamic heading tag
  const HeadingTag = isStandalonePage ? "h1" : "h2";

  return (
    <>
      {isStandalonePage && (
        <>
          <Helmet>
            <title>About | Pardeep Shyoran · Web Developer</title>
            <meta
              name="description"
              content="Learn about Pardeep Shyoran's background, web engineering philosophy, and modern web development experience with React, Node.js, and MongoDB."
            />
            <meta
              name="keywords"
              content="Pardeep Shyoran, Web Developer, Full Stack Developer, Frontend Developer, React, Node.js, MongoDB, JavaScript"
            />
            <link rel="canonical" href="https://pardeep-shyoran.me/about" />
            <link rel="alternate" type="text/markdown" href="/about.md" title="Markdown version" />
          </Helmet>
          <StructuredData
            data={{
              "@context": "https://schema.org",
              "@type": "AboutPage",
              url: `${profileData.siteUrl}/about`,
              mainEntity: {
                "@type": "Person",
                name: profileData.name,
                jobTitle: profileData.role,
                url: profileData.siteUrl,
                knowsAbout: skillsData.flatMap((c) => c.skills.map((s) => s.name)),
              },
            }}
          />
        </>
      )}

      <section
        id="about"
        ref={sectionRef}
        className={`${styles.aboutSection} ${isStandalonePage ? styles.standalonePage : ""}`.trim()}
        aria-label="About Pardeep Shyoran - Web Developer"
      >
        {/* Section Header */}
        <header className={styles.header} data-about-anim>
          <span className={styles.kicker}>Web Developer · About Me</span>
          <HeadingTag className={styles.title}>
            Crafting fast, modern, and resilient web experiences.
          </HeadingTag>
          <p className={styles.subtitle}>
            I bridge user-centric frontend interfaces with robust backend engineering to build web applications that look sharp, feel natural, and scale effortlessly.
          </p>
        </header>

        {/* Bento Grid: Compact Developer Dossier */}
        <div className={styles.bentoGrid}>
          {/* Bento Card 1: Narrative Profile & Web Developer Bio */}
          <article className={`${styles.bentoCard} ${styles.profileCard}`} data-about-anim>
            {/* Card Header with Identity & Availability */}
            <div className={styles.profileHeader}>
              <div className={styles.identityWrapper}>
                <div className={styles.avatarPill} aria-hidden="true">
                  <img
                    src={DARK_THEME_LOGO}
                    alt=""
                    className={`${styles.logoImg} ${styles.darkThemeLogo}`}
                    loading="eager"
                    decoding="async"
                  />
                  <img
                    src={LIGHT_THEME_LOGO}
                    alt=""
                    className={`${styles.logoImg} ${styles.lightThemeLogo}`}
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <div className={styles.nameMeta}>
                  <h3 className={styles.devName}>Pardeep Shyoran</h3>
                  <span className={styles.devRole}>Full-Stack Web Developer</span>
                </div>
              </div>

              <div className={styles.statusBadge} title="Currently seeking web development roles and collaborations">
                <span className={styles.pulseDot} aria-hidden="true" />
                <span className={styles.statusText}>Open to Opportunities</span>
              </div>
            </div>

            {/* Concise, punchy personal developer bio */}
            <div className={styles.narrativeBody}>
              <p className={styles.leadText}>
                I&apos;m a Web Developer specializing in building modern web applications that bridge intuitive, responsive UI with scalable backend architecture.
              </p>
              <p className={styles.bodyText}>
                Across projects like <strong className={styles.highlightText}>KodraX</strong> (real-time collaborative workspace) and <strong className={styles.highlightText}>Rivo</strong> (scalable streaming platform), I focus on clean component architectures, resilient APIs, and seamless user experiences.
              </p>
            </div>

            {/* Quick Specs Matrix */}
            <dl className={styles.specsGrid}>
              {quickSpecs.map((spec) => (
                <div key={spec.label} className={styles.specItem}>
                  <dt className={styles.specLabel}>{spec.label}</dt>
                  <dd className={styles.specValue}>{spec.value}</dd>
                  <dd className={styles.specDetail}>{spec.detail}</dd>
                </div>
              ))}
            </dl>
          </article>

          {/* Bento Card 2: Interactive Web Developer Console / Dossier */}
          <aside className={`${styles.bentoCard} ${styles.consoleCard}`} data-about-anim aria-label="Web Developer Interactive Console">
            <div className={styles.consoleHeader}>
              <div className={styles.windowDots} aria-hidden="true">
                <span className={`${styles.windowDot} ${styles.dotRed}`} />
                <span className={`${styles.windowDot} ${styles.dotYellow}`} />
                <span className={`${styles.windowDot} ${styles.dotGreen}`} />
              </div>

              {/* Console Tabs */}
              <div className={styles.tabList} role="tablist" aria-label="Developer Information Tabs">
                <button
                  type="button"
                  role="tab"
                  id="tab-workflow"
                  aria-selected={activeTab === "workflow"}
                  aria-controls="panel-workflow"
                  className={`${styles.tabBtn} ${activeTab === "workflow" ? styles.activeTab : ""}`}
                  onClick={() => setActiveTab("workflow")}
                >
                  <svg className={styles.tabIcon} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  <span>workflow.js</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  id="tab-architecture"
                  aria-selected={activeTab === "architecture"}
                  aria-controls="panel-architecture"
                  className={`${styles.tabBtn} ${activeTab === "architecture" ? styles.activeTab : ""}`}
                  onClick={() => setActiveTab("architecture")}
                >
                  <svg className={styles.tabIcon} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                  <span>architecture.js</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  id="tab-mindset"
                  aria-selected={activeTab === "mindset"}
                  aria-controls="panel-mindset"
                  className={`${styles.tabBtn} ${activeTab === "mindset" ? styles.activeTab : ""}`}
                  onClick={() => setActiveTab("mindset")}
                >
                  <svg className={styles.tabIcon} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                  <span>mindset.md</span>
                </button>
              </div>
            </div>

            {/* Tab Panels */}
            <div className={styles.consoleBody}>
              <div
                id="panel-workflow"
                role="tabpanel"
                aria-labelledby="tab-workflow"
                className={styles.tabContent}
                hidden={activeTab !== "workflow"}
              >
                <div className={styles.terminalPrompt}>
                  <span className={styles.promptArrow}>❯</span>
                  <span className={styles.promptCmd}>pardeep.getDevelopmentCycle()</span>
                </div>

                <div className={styles.steppedList}>
                  <div className={styles.stepRow}>
                    <span className={styles.stepNum}>01</span>
                    <div className={styles.stepInfo}>
                      <strong className={styles.stepTitle}>UI Architecture & Mobile-First Design</strong>
                      <p className={styles.stepDesc}>Crafting semantic layouts, responsive grids, and accessible components before writing state.</p>
                    </div>
                  </div>
                  <div className={styles.stepRow}>
                    <span className={styles.stepNum}>02</span>
                    <div className={styles.stepInfo}>
                      <strong className={styles.stepTitle}>Full-Stack API & Schema Integration</strong>
                      <p className={styles.stepDesc}>Connecting React frontends to robust Node.js/Express endpoints with strict validation and JWT auth.</p>
                    </div>
                  </div>
                  <div className={styles.stepRow}>
                    <span className={styles.stepNum}>03</span>
                    <div className={styles.stepInfo}>
                      <strong className={styles.stepTitle}>Performance Tuning & Interaction Polish</strong>
                      <p className={styles.stepDesc}>Optimizing Core Web Vitals, eliminating layout shifts, and adding purposeful GSAP animations.</p>
                    </div>
                  </div>
                  <div className={styles.stepRow}>
                    <span className={styles.stepNum}>04</span>
                    <div className={styles.stepInfo}>
                      <strong className={styles.stepTitle}>Testing, Audit & Production Shipping</strong>
                      <p className={styles.stepDesc}>Validating endpoints in Postman, managing branch merges in Git, and deploying containerized apps.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                id="panel-architecture"
                role="tabpanel"
                aria-labelledby="tab-architecture"
                className={styles.tabContent}
                hidden={activeTab !== "architecture"}
              >
                <div className={styles.terminalPrompt}>
                  <span className={styles.promptArrow}>❯</span>
                  <span className={styles.promptCmd}>cat system_architecture.js</span>
                </div>

                <pre className={styles.codeSnippet}>
                  <code>
                    <span className={styles.codeLine}><span className={styles.codeComment}>// High-Performance Full-Stack Web Architecture</span></span>
                    <span className={styles.codeLine}><span className={styles.codeKeyword}>export const</span> <span className={styles.codeFunc}>webStackArchitecture</span> = &#123;</span>
                    <span className={styles.codeLine}>{"  "}<span className={styles.jsonKey}>clientSide</span>: &#123;</span>
                    <span className={styles.codeLine}>{"    "}uiPattern: <span className={styles.jsonVal}>&quot;Modular React &middot; CSS Modules &middot; GSAP&quot;</span>,</span>
                    <span className={styles.codeLine}>{"    "}principles: <span className={styles.jsonVal}>&quot;Mobile-first &middot; Zero layout shifts &middot; WCAG AA&quot;</span></span>
                    <span className={styles.codeLine}>{"  "}&#125;,</span>
                    <span className={styles.codeLine}>{"  "}<span className={styles.jsonKey}>apiLayer</span>: &#123;</span>
                    <span className={styles.codeLine}>{"    "}server: <span className={styles.jsonVal}>&quot;Node.js &middot; Express REST Controllers&quot;</span>,</span>
                    <span className={styles.codeLine}>{"    "}security: <span className={styles.jsonVal}>&quot;JWT &middot; HTTP-only cookies &middot; Rate limiting&quot;</span></span>
                    <span className={styles.codeLine}>{"  "}&#125;,</span>
                    <span className={styles.codeLine}>{"  "}<span className={styles.jsonKey}>dataStorage</span>: &#123;</span>
                    <span className={styles.codeLine}>{"    "}documents: <span className={styles.jsonVal}>&quot;MongoDB &middot; Mongoose Indexed Schemas&quot;</span>,</span>
                    <span className={styles.codeLine}>{"    "}caching: <span className={styles.jsonVal}>&quot;Redis Cache &middot; AWS S3 Asset Cloud&quot;</span></span>
                    <span className={styles.codeLine}>{"  "}&#125;</span>
                    <span className={styles.codeLine}>&#125;;</span>
                  </code>
                </pre>
              </div>

              <div
                id="panel-mindset"
                role="tabpanel"
                aria-labelledby="tab-mindset"
                className={styles.tabContent}
                hidden={activeTab !== "mindset"}
              >
                <div className={styles.terminalPrompt}>
                  <span className={styles.promptArrow}>❯</span>
                  <span className={styles.promptCmd}>cat engineering_mindset.md</span>
                </div>

                <ul className={styles.mindsetList}>
                  <li className={styles.mindsetItem}>
                    <span className={styles.mindsetCheck} aria-hidden="true">✓</span>
                    <span className={styles.mindsetText}>
                      <strong>Modular UI Components:</strong> Reusable, self-contained components with clean props rather than monolithic views.
                    </span>
                  </li>
                  <li className={styles.mindsetItem}>
                    <span className={styles.mindsetCheck} aria-hidden="true">✓</span>
                    <span className={styles.mindsetText}>
                      <strong>Speed Is a Feature:</strong> Respect device constraints with lightweight bundles, responsive imagery, and snappy feedback.
                    </span>
                  </li>
                  <li className={styles.mindsetItem}>
                    <span className={styles.mindsetCheck} aria-hidden="true">✓</span>
                    <span className={styles.mindsetText}>
                      <strong>Predictable API Contracts:</strong> Thoughtful data models and consistent JSON schemas between client and server.
                    </span>
                  </li>
                  <li className={styles.mindsetItem}>
                    <span className={styles.mindsetCheck} aria-hidden="true">✓</span>
                    <span className={styles.mindsetText}>
                      <strong>Universal Accessibility:</strong> Semantic HTML, keyboard navigability, and clear contrast ratios.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.consoleFooter}>
              <span className={styles.consoleHint}>● Terminal active · Interactive developer dossier</span>
            </div>
          </aside>
        </div>
      </section>

      {/* Embedded Categorized Skills Grid - The Single Source of Truth for Tech & Tools */}
      <Skills />

      {/* Unified Contextual CTA Bridge - Positioned Seamlessly After Full Technical Dossier */}
      <div className={styles.ctaBridgeWrapper}>
        <div ref={ctaRef} className={styles.ctaBridge} data-about-anim>
          <div className={styles.bridgeContent}>
            <h3 className={styles.bridgeHeading}>Looking for a passionate Web Developer?</h3>
            <p className={styles.bridgeSub}>
              I&apos;m ready to turn your product vision into clean, performant code. Let&apos;s build something exceptional together.
            </p>
          </div>
          <div className={styles.bridgeActions}>
            <Button
              variant="primary"
              size="md"
              to={isStandalonePage ? "/projects" : undefined}
              href={!isStandalonePage ? "/#featuredProjects" : undefined}
              target="_self"
              onClick={!isStandalonePage ? (e) => handleNavigate(e, "featuredProjects") : undefined}
              className={styles.bridgeBtn}
            >
              <span>Explore Web Projects</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Button>
            <Button
              variant="secondary"
              size="md"
              to={isStandalonePage ? "/contact" : undefined}
              href={!isStandalonePage ? "/#contact" : undefined}
              target="_self"
              onClick={!isStandalonePage ? (e) => handleNavigate(e, "contact") : undefined}
              className={styles.bridgeBtnSecondary}
            >
              <span>Get in Touch</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
