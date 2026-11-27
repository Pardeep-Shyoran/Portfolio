import React, { lazy, useEffect } from "react";
import styles from "./Home.module.css";
import { Helmet } from "react-helmet";
import FeaturedProjects from "../../components/FeaturedProjects/FeaturedProjects";
import DeferredSection from "../../components/DeferredSection/DeferredSection";
import { requestSectionMount } from "../../utils/sectionMount";
import Button from "../../components/Button/Button";
import StructuredData from "../../components/StructuredData/StructuredData";
import profileData from "../../data/profile";
import projectsData from "../../data/project";
import { useLocation, useNavigate } from "react-router-dom";
import { smoothScrollTo } from "../../utils/scrollHelper";

const About = lazy(() => import("../About/About"));
const Certificates = lazy(() => import("../Certificates/Certificates"));
const Stats = lazy(() => import("../Stats/Stats"));
const Contact = lazy(() => import("../Contact/Contact"));

const ResumeIcon = () => (
  <svg className={styles.buttonIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M7.5 3.75h7.08L18 7.17v10.08A2.75 2.75 0 0 1 15.25 20H7.5A2.75 2.75 0 0 1 4.75 17.25v-10.75A2.75 2.75 0 0 1 7.5 3.75Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M14.58 3.75V7.2h3.42" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 8.25v6.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9.8 12.7 12 14.9l2.2-2.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TalkIcon = () => (
  <svg className={styles.buttonIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M5 4.75h14A2.25 2.25 0 0 1 21.25 7v6A2.25 2.25 0 0 1 19 15.25h-7.35L8 19v-3.75H5A2.25 2.25 0 0 1 2.75 13V7A2.25 2.25 0 0 1 5 4.75Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M7.5 8.25h9M7.5 11.25h6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const ArrowDownIcon = () => (
  <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className={styles.linkArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const CodolioIcon = () => (
  <svg className={styles.profileLogo} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const heroHighlights = ["React + Node.js", "API Architecture", "Performance UI", "MongoDB"];

  // Handle route state scroll targets cleanly via React Router
  useEffect(() => {
    const targetId = location.state?.scrollTarget;
    if (!targetId) return;

    requestSectionMount(targetId);

    let attempts = 0;
    let rafId = 0;
    const tryScroll = () => {
      const cleanId = targetId === "home" ? "home" : targetId;
      if (document.getElementById(cleanId) || attempts >= 30) {
        smoothScrollTo(targetId === "home" ? 0 : targetId);
        navigate(location.pathname, { replace: true, state: {} });
        return;
      }
      attempts += 1;
      rafId = requestAnimationFrame(tryScroll);
    };

    rafId = requestAnimationFrame(tryScroll);
    return () => cancelAnimationFrame(rafId);
  }, [location.state, location.pathname, navigate]);

  const onProjectsClick = (e) => {
    e?.preventDefault?.();
    smoothScrollTo("featuredProjects");
  };

  const onContactClick = (e) => {
    e?.preventDefault?.();
    smoothScrollTo("contact");
  };

  const codolioProfileUrl = profileData.profiles.codolio.cardUrl;

  const homeStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: `${profileData.name} Portfolio`,
        url: profileData.siteUrl,
        description: profileData.summary,
      },
      {
        "@type": "ProfilePage",
        url: `${profileData.siteUrl}/`,
        mainEntity: {
          "@type": "Person",
          name: profileData.name,
          jobTitle: profileData.role,
          url: profileData.siteUrl,
          email: `mailto:${profileData.contact.email}`,
          sameAs: [
            profileData.profiles.github.url,
            profileData.profiles.linkedin.url,
            profileData.profiles.x.url,
            profileData.profiles.codolio.url,
          ],
        },
      },
      {
        "@type": "ItemList",
        name: "Featured Projects",
        itemListElement: projectsData
          .filter((p) => p.featured)
          .map((p, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: p.title,
            url: `${profileData.siteUrl}/projects/${p.slug}`,
          })),
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Pardeep Shyoran | Full Stack Developer Portfolio</title>
        <meta
          name="description"
          content="Explore Pardeep Shyoran's journey in full stack development—backend architecture, milestone visuals, and branding."
        />
        <meta
          name="keywords"
          content="Pardeep Shyoran, Full Stack Developer, ReactJS, MongoDB, Portfolio, Backend Developer"
        />
        <link rel="canonical" href="https://pardeep-shyoran.me/" />
        <link rel="alternate" type="text/markdown" href="/index.md" title="Markdown version" />
      </Helmet>
      <StructuredData data={homeStructuredData} />

      {/* Hero Section */}
      <section id="home" className={styles.heroSection}>
        <div className={styles.heroInner}>
          {/* Left Column: Personal Developer Intro & Actions */}
          <div className={styles.heroContent}>
            {/* 1. Availability & Identity Eyebrow */}
            <div className={styles.roleBadge} data-hero-anim>
              <span className={styles.statusDot} aria-hidden="true" />
              <span className={styles.roleText}>Available for Hire</span>
              <span className={styles.badgeSeparator} aria-hidden="true">•</span>
              <span className={styles.roleSubtext}>Full-Stack Web Developer</span>
            </div>

            {/* 2. Personal, Direct Developer Headline */}
            <h1 className={styles.headline} data-hero-anim>
              Hi, I&apos;m Pardeep.<br />
              I build <span className={styles.headlineHighlight}>fast, modern web apps</span> with clean code.
            </h1>

            {/* 3. Authentic Developer Bio */}
            <p className={styles.description} data-hero-anim>
              I&apos;m a software developer passionate about crafting things for the web. From responsive React frontends to robust Node.js and MongoDB backends, I turn ideas and complex logic into smooth, reliable digital experiences.
            </p>

            {/* Core Tech Stack / Skills */}
            <div className={styles.highlights} data-hero-anim>
              {heroHighlights.map((highlight) => (
                <span className={styles.highlightPill} key={highlight}>
                  <span className={styles.pillDot} aria-hidden="true" />
                  {highlight}
                </span>
              ))}
            </div>

            {/* 4, 5, 6. Primary and Secondary Actions */}
            <div className={styles.ctaRow} data-hero-anim>
              <Button
                href="/#featuredProjects"
                target="_self"
                onClick={onProjectsClick}
                variant="primary"
                size="lg"
                className={styles.primaryCta}
              >
                <span>View Projects</span>
                <ArrowDownIcon />
              </Button>

              <Button
                href="/#contact"
                target="_self"
                onClick={onContactClick}
                variant="secondary"
                size="lg"
                className={styles.secondaryCta}
              >
                <TalkIcon />
                <span>Contact Me</span>
              </Button>

              <Button
                href={profileData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="lg"
                className={styles.resumeCta}
                aria-label="Open Pardeep Shyoran Resume PDF in a new tab"
              >
                <ResumeIcon />
                <span>Resume</span>
              </Button>
            </div>

            {/* 7. Compact Profile & Social Bar */}
            <div className={styles.profileBar} data-hero-anim>
              <a
                href={codolioProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.profileBadge}
                title="View Codolio Profile (GFG + LeetCode achievements)"
              >
                <CodolioIcon />
                <span className={styles.profileLabel}>Codolio</span>
                <span className={styles.profileMeta}>Stats Card</span>
                <ExternalLinkIcon />
              </a>

              <div className={styles.barDivider} aria-hidden="true" />

              <a
                href="https://github.com/Pardeep-Shyoran"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.profileLink}
              >
                <span>GitHub</span>
                <ExternalLinkIcon />
              </a>

              <a
                href="https://www.linkedin.com/in/pardeepshyoran/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.profileLink}
              >
                <span>LinkedIn</span>
                <ExternalLinkIcon />
              </a>
            </div>
          </div>

          {/* Right Column: Personal Developer Profile & Workspace Card */}
          <div className={styles.heroVisual} data-hero-anim>
            <div className={styles.devCard}>
              <div className={styles.devCardHeader}>
                <div className={styles.devProfileGroup}>
                  <img
                    src="https://ik.imagekit.io/00zfvrear/Images/cropped_circle_image.png?tr=w-128,h-128,f-auto,q-85"
                    alt="Pardeep Shyoran"
                    width="44"
                    height="44"
                    decoding="async"
                    className={styles.devAvatar}
                  />
                  <div className={styles.devMeta}>
                    <div className={styles.devNameRow}>
                      <span className={styles.devName}>Pardeep Shyoran</span>
                      <span className={styles.devHandle}>@pardeep</span>
                    </div>
                    <span className={styles.devRole}>Full-Stack Web Developer</span>
                  </div>
                </div>
                <div className={styles.devLiveStatus}>
                  <span className={styles.livePulse} aria-hidden="true" />
                  <span className={styles.liveText}>OPEN TO WORK</span>
                </div>
              </div>

              <div className={styles.devCardBody}>
                <div className={styles.devPromptLine}>
                  <span className={styles.promptSymbol}>❯</span>
                  <span className={styles.promptCmd}>cat developer.json</span>
                </div>

                <div className={styles.devJsonBox}>
                  <div className={styles.codeLine}>
                    <span className={styles.tokenKey}>"name"</span>: <span className={styles.tokenString}>"Pardeep Shyoran"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.tokenKey}>"role"</span>: <span className={styles.tokenString}>"Full-Stack Web Developer"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.tokenKey}>"stack"</span>: [<span className={styles.tokenString}>"React"</span>, <span className={styles.tokenString}>"Node.js"</span>, <span className={styles.tokenString}>"Express"</span>, <span className={styles.tokenString}>"MongoDB"</span>],
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.tokenKey}>"dsa"</span>: <span className={styles.tokenString}>"400+ problems solved"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.tokenKey}>"location"</span>: <span className={styles.tokenString}>"Haryana, India (Remote-Ready)"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.tokenKey}>"mission"</span>: <span className={styles.tokenAccent}>"Building fast, delightful web apps"</span>
                  </div>
                </div>

                <div className={styles.telemetryGrid}>
                  <div className={styles.telemetryItem}>
                    <span className={styles.telemetryVal}>400+</span>
                    <span className={styles.telemetryKey}>DSA Challenges</span>
                  </div>
                  <div className={styles.telemetryDivider} aria-hidden="true" />
                  <div className={styles.telemetryItem}>
                    <span className={styles.telemetryVal}>MERN</span>
                    <span className={styles.telemetryKey}>Core Stack</span>
                  </div>
                  <div className={styles.telemetryDivider} aria-hidden="true" />
                  <div className={styles.telemetryItem}>
                    <span className={styles.telemetryVal}>100%</span>
                    <span className={styles.telemetryKey}>Responsive UI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Downstream Sections */}
      <DeferredSection
        id="about"
        matchIds={["about", "skills"]}
        minHeight="320px"
        rootMargin="120px"
        render={() => <About />}
      />
      <FeaturedProjects />
      <DeferredSection
        id="certificates"
        minHeight="280px"
        render={() => <Certificates />}
      />
      <DeferredSection
        id="stats"
        minHeight="320px"
        render={() => <Stats />}
      />
      <DeferredSection
        id="contact"
        minHeight="360px"
        render={() => <Contact />}
      />
    </>
  );
};

export default Home;

