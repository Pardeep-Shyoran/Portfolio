import React, { useMemo, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
// Inline SVGs replace react-icons to eliminate the vendor-icons chunk
const FaGithub = ({ className }) => (
  <svg className={className} viewBox="0 0 496 512" fill="currentColor" aria-hidden="true">
    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z"/>
  </svg>
);
const FaExternalLinkAlt = ({ className }) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
    <path d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"/>
  </svg>
);
const FaArrowLeft = ({ className }) => (
  <svg className={className} viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
    <path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"/>
  </svg>
);
const FaArrowRight = ({ className }) => (
  <svg className={className} viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
    <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/>
  </svg>
);
const FaCode = ({ className }) => (
  <svg className={className} viewBox="0 0 640 512" fill="currentColor" aria-hidden="true">
    <path d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.2-46.8c4.1-4.4 3.9-11.3-.4-15.5L163.5 256l44.1-80.9c4.3-4.2 4.6-11.1.4-15.5l-43.2-46.8c-4.6-5-12.6-4.3-16.2 1.6L41.3 248.3a16 16 0 0 0 0 15.4L148.7 400.9c3.6 5.9 11.6 6.5 16.2 1.4zm298.3 0l107.4-136.2a16 16 0 0 0 0-15.4L463.2 115.1c-3.6-5.9-11.6-6.5-16.2-1.4l-43.2 46.8c-4.1 4.4-3.9 11.3.4 15.5L476.5 256l-44.1 80.9c-4.3 4.2-4.6 11.1-.4 15.5l43.2 46.8c4.6 5 12.6 4.3 16.2-1.4z"/>
  </svg>
);
const FaLayerGroup = ({ className }) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
    <path d="M12.41 148.02l232.94 105.67c6.8 3.09 14.49 3.09 21.29 0l232.94-105.67c16.55-7.51 16.55-32.52 0-40.03L266.65 2.31a25.606 25.606 0 0 0-21.29 0L12.41 107.98c-16.55 7.51-16.55 32.53 0 40.04zm487.18 88.28l-58.09-26.33-161.64 73.27c-7.56 3.43-15.59 5.17-23.86 5.17s-16.29-1.74-23.86-5.17L70.51 209.97l-58.1 26.33c-16.55 7.5-16.55 32.5 0 40l232.94 105.59c6.8 3.08 14.49 3.08 21.29 0L499.59 276.3c16.55-7.5 16.55-32.5 0-40zm0 127.8l-57.87-26.23-161.86 73.37c-7.56 3.43-15.59 5.17-23.86 5.17s-16.29-1.74-23.86-5.17L70.29 337.87 12.41 364.1c-16.55 7.5-16.55 32.5 0 40l232.94 105.59c6.8 3.08 14.49 3.08 21.29 0L499.59 404.1c16.55-7.5 16.55-32.5 0-40z"/>
  </svg>
);
const FaTools = ({ className }) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
    <path d="M501.1 395.7L384 278.6c-23.1-23.1-57.6-27.6-85.4-13.9L192 158.1V96L64 0 0 64l96 128h62.1l106.6 106.6c-13.6 27.8-9.2 62.3 13.9 85.4l117.1 117.1c14.6 14.6 38.2 14.6 52.7 0l52.7-52.7c14.5-14.6 14.5-38.2 0-52.7zM331.7 225c28.3 0 54.9 11 74.9 31l19.4 19.4c15.8-6.9 30.8-16.5 43.8-29.5 37.1-37.1 49.7-89.3 37.9-136.7-2.2-9-13.5-12.1-20.1-5.5l-74.4 74.4-67.9-11.3L334 98.9l74.4-74.4c6.6-6.6 3.4-17.9-5.7-20.2-47.4-11.7-99.6.9-136.6 37.9-28.5 28.5-41.9 66.1-41.2 103.6l82.1 82.1c8.1-1.9 16.5-2.9 24.7-2.9zm-103.9 82l-56.7-56.7-141.1 141.1c-19.5 19.5-19.5 51.2 0 70.7l19.8 19.8c19.5 19.5 51.2 19.5 70.7 0l141.1-141.1-33.8-33.8z"/>
  </svg>
);
const FaLightbulb = ({ className }) => (
  <svg className={className} viewBox="0 0 352 512" fill="currentColor" aria-hidden="true">
    <path d="M176 80c-52.94 0-96 43.06-96 96 0 8.84 7.16 16 16 16s16-7.16 16-16c0-35.3 28.72-64 64-64 8.84 0 16-7.16 16-16s-7.16-16-16-16zM96.06 459.17c0 3.15.93 6.22 2.68 8.84l24.51 36.84c2.97 4.46 7.97 7.14 13.32 7.14h78.85c5.36 0 10.36-2.68 13.32-7.14l24.51-36.84c1.74-2.62 2.67-5.7 2.68-8.84l.05-43.18H96l.06 43.18zM176 0C73.72 0 0 82.97 0 176c0 44.37 16.45 84.85 43.56 115.78 16.64 18.99 42.74 58.8 52.42 92.16v.06h48v-.12c-.01-4.77-.72-9.51-2.15-14.07-5.59-17.81-22.82-64.77-62.17-109.67-20.54-23.43-31.52-53.15-31.61-84.14-.2-73.64 59.67-128 127.95-128 70.58 0 128 57.42 128 128 0 30.97-11.24 60.85-31.65 84.14-39.11 44.61-56.42 91.47-62.1 109.46a47.507 47.507 0 0 0-2.22 14.3v.1h48v-.05c9.68-33.37 35.78-73.18 52.42-92.16C335.55 260.85 352 220.37 352 176 352 78.8 273.2 0 176 0z"/>
  </svg>
);
const FaExclamationTriangle = ({ className }) => (
  <svg className={className} viewBox="0 0 576 512" fill="currentColor" aria-hidden="true">
    <path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"/>
  </svg>
);
const FaImages = ({ className }) => (
  <svg className={className} viewBox="0 0 576 512" fill="currentColor" aria-hidden="true">
    <path d="M480 416v16c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V176c0-26.51 21.49-48 48-48h16v208c0 44.112 35.888 80 80 80h336zm96-80c0 26.51-21.49 48-48 48H144c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h384c26.51 0 48 21.49 48 48v256zM256 128c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-96 144l55.515-55.515c4.686-4.686 12.284-4.686 16.971 0L272 256l135.515-135.515C412.201 115.799 419.799 115.799 424.485 120.485L528 224v128H160v-80z"/>
  </svg>
);
import projectsData from '../../data/project';
import profileData from '../../data/profile';
import Button from '../../components/Button/Button';
import StructuredData from '../../components/StructuredData/StructuredData';
import { prefersReducedMotion } from '../../utils/scrollHelper';
import styles from './ProjectCaseStudy.module.css';

const ProjectCaseStudy = () => {
  const { slug } = useParams();
  const containerRef = useRef(null);

  // Locate project by unique slug
  const { project, prevProject, nextProject } = useMemo(() => {
    const index = projectsData.findIndex((p) => p.slug === slug);
    if (index === -1) {
      return { project: null, prevProject: null, nextProject: null };
    }
    const current = projectsData[index];
    const prev = projectsData[(index - 1 + projectsData.length) % projectsData.length];
    const next = projectsData[(index + 1) % projectsData.length];
    return {
      project: current,
      prevProject: prev,
      nextProject: next,
    };
  }, [slug]);

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  // GSAP subtle entrance animation
  useEffect(() => {
    if (!project || !containerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const animatedElements = containerRef.current.querySelectorAll(`.${styles.animateIn}`);
      if (!animatedElements || animatedElements.length === 0) return;

      gsap.fromTo(
        animatedElements,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [project]);

  // Unknown slug fallback view
  if (!project) {
    return (
      <>
        <Helmet>
          <title>Project Not Found | Pardeep Shyoran</title>
          <meta name="robots" content="noindex, follow" />
          <meta
            name="description"
            content="The requested project case study could not be found in Pardeep Shyoran's portfolio."
          />
        </Helmet>
        <div className={styles.notFoundPage}>
          <div className={styles.notFoundContainer}>
            <span className={styles.kicker}>PROJECT ARCHIVE</span>
            <h1 className={styles.notFoundTitle}>Case Study Not Found</h1>
            <p className={styles.notFoundCopy}>
              No project case study matches the identifier <code>{slug}</code>. It may have been renamed or moved.
            </p>
            <div className={styles.notFoundActions}>
              <Button
                to="/projects"
                variant="primary"
                size="md"
              >
                Explore All Projects
              </Button>
              <Button
                to="/"
                variant="secondary"
                size="md"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const {
    title,
    subtitle,
    shortDescription,
    description,
    imageUrl,
    gallery = [],
    tags = [],
    role,
    category,
    problem,
    approach,
    features = [],
    technicalDetails = [],
    challenges = [],
    learnings = [],
    demoUrl,
    repoUrl,
  } = project;

  return (
    <>
      <Helmet>
        <title>{`${title} | Case Study | Pardeep Shyoran`}</title>
        <meta
          name="description"
          content={shortDescription || description || `${title} case study by Pardeep Shyoran.`}
        />
        <meta
          name="keywords"
          content={`${title}, ${tags.join(', ')}, Web Development, Software Engineering, Case Study, Pardeep Shyoran`}
        />
        <link rel="canonical" href={`https://pardeep-shyoran.me/projects/${slug}`} />
        <link rel="alternate" type="text/markdown" href={`/projects/${slug}.md`} title="Markdown version" />
      </Helmet>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'SoftwareSourceCode',
              name: title,
              description: description || shortDescription,
              url: demoUrl || `${profileData.siteUrl}/projects/${slug}`,
              codeRepository: repoUrl,
              programmingLanguage: tags,
              author: {
                '@type': 'Person',
                name: profileData.name,
                url: profileData.siteUrl,
              },
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${profileData.siteUrl}/` },
                { '@type': 'ListItem', position: 2, name: 'Projects', item: `${profileData.siteUrl}/projects` },
                { '@type': 'ListItem', position: 3, name: title, item: `${profileData.siteUrl}/projects/${slug}` },
              ],
            },
          ],
        }}
      />

      <div className={styles.caseStudyPage} ref={containerRef}>
        {/* Navigation Breadcrumb */}
        <div className={styles.topBar}>
          <div className={styles.pageContainer}>
            <Link to="/projects" className={styles.backLink} aria-label="Back to all projects">
              <FaArrowLeft className={styles.backIcon} aria-hidden="true" />
              <span>All Projects</span>
            </Link>
          </div>
        </div>

        {/* HERO SECTION */}
        <header className={`${styles.hero} ${styles.animateIn}`}>
          <div className={styles.pageContainer}>
            <div className={styles.heroHeader}>
              <div className={styles.eyebrowRow}>
                <span className={styles.kicker}>PROJECT CASE STUDY</span>
                {category && <span className={styles.categoryBadge}>{category}</span>}
              </div>

              <h1 className={styles.title}>{title}</h1>

              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

              <p className={styles.leadSummary}>
                {shortDescription || description}
              </p>

              {/* Metadata strip */}
              <dl className={styles.metaStrip} aria-label="Project metadata">
                {role && (
                  <div className={styles.metaCell}>
                    <dt className={styles.metaLabel}>Role</dt>
                    <dd className={styles.metaValue}>{role}</dd>
                  </div>
                )}
                {category && (
                  <div className={styles.metaCell}>
                    <dt className={styles.metaLabel}>Focus</dt>
                    <dd className={styles.metaValue}>{category}</dd>
                  </div>
                )}
                {tags.length > 0 && (
                  <div className={styles.metaCellWide}>
                    <dt className={styles.metaLabel}>Core Technologies</dt>
                    <dd className={styles.metaTagsList}>
                      {tags.map((t) => (
                        <span key={t} className={styles.tagBadge}>
                          {t}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>

              {/* Action Buttons */}
              <div className={styles.heroActions}>
                {demoUrl && (
                  <a
                    href={demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.primaryActionBtn}
                    aria-label={`Open live application for ${title} in a new tab`}
                  >
                    <span>Visit Live Application</span>
                    <FaExternalLinkAlt className={styles.btnIcon} aria-hidden="true" />
                  </a>
                )}
                {repoUrl && (
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.secondaryActionBtn}
                    aria-label={`View ${title} source code repository on GitHub in a new tab`}
                  >
                    <span>GitHub Repository</span>
                    <FaGithub className={styles.btnIcon} aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>

            {/* Primary Hero Screenshot */}
            <div className={styles.heroImageWrapper}>
              <div className={styles.heroImageContainer}>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={`${title} interface preview`}
                    className={styles.heroImage}
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <div className={styles.imageFallback}>
                    <FaCode className={styles.fallbackIcon} aria-hidden="true" />
                    <span>{title} Preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CASE STUDY CONTENT */}
        <div className={styles.mainContent}>
          <div className={styles.pageContainer}>
            {/* OVERVIEW SECTION */}
            <section className={`${styles.contentSection} ${styles.animateIn}`} aria-labelledby="overview-heading">
              <div className={styles.sectionHeadingWrapper}>
                <span className={styles.sectionNumber}>01</span>
                <div>
                  <h2 id="overview-heading" className={styles.sectionTitle}>
                    Project Overview
                  </h2>
                  <p className={styles.sectionSubtitle}>
                    Context, scope, and objectives of the project
                  </p>
                </div>
              </div>

              <div className={styles.proseBlock}>
                <p className={styles.paragraph}>{description}</p>
              </div>
            </section>

            {/* PROBLEM & APPROACH SECTION */}
            {(problem || approach) && (
              <section className={`${styles.contentSection} ${styles.animateIn}`} aria-labelledby="architecture-heading">
                <div className={styles.sectionHeadingWrapper}>
                  <span className={styles.sectionNumber}>02</span>
                  <div>
                    <h2 id="architecture-heading" className={styles.sectionTitle}>
                      Problem & Engineering Approach
                    </h2>
                    <p className={styles.sectionSubtitle}>
                      The technical challenge and the architectural response
                    </p>
                  </div>
                </div>

                <div className={styles.twoColumnGrid}>
                  {problem && (
                    <div className={styles.cardBox}>
                      <div className={styles.cardHeader}>
                        <FaExclamationTriangle className={styles.cardIcon} aria-hidden="true" />
                        <h3 className={styles.cardTitle}>The Need & Context</h3>
                      </div>
                      <p className={styles.cardText}>{problem}</p>
                    </div>
                  )}

                  {approach && (
                    <div className={styles.cardBox}>
                      <div className={styles.cardHeader}>
                        <FaLayerGroup className={styles.cardIcon} aria-hidden="true" />
                        <h3 className={styles.cardTitle}>Engineering Approach</h3>
                      </div>
                      <p className={styles.cardText}>{approach}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* FEATURES SECTION */}
            {features.length > 0 && (
              <section className={`${styles.contentSection} ${styles.animateIn}`} aria-labelledby="features-heading">
                <div className={styles.sectionHeadingWrapper}>
                  <span className={styles.sectionNumber}>03</span>
                  <div>
                    <h2 id="features-heading" className={styles.sectionTitle}>
                      Key Features & Capabilities
                    </h2>
                    <p className={styles.sectionSubtitle}>
                      Verified implementation capabilities built into the application
                    </p>
                  </div>
                </div>

                <div className={styles.featuresGrid}>
                  {features.map((feat, i) => (
                    <div key={i} className={styles.featureCard}>
                      <div className={styles.featureHeader}>
                        <span className={styles.featureIndex}>0{i + 1}</span>
                        <h3 className={styles.featureTitle}>{feat.title}</h3>
                      </div>
                      <p className={styles.featureDescription}>{feat.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* TECHNICAL IMPLEMENTATION */}
            {technicalDetails.length > 0 && (
              <section className={`${styles.contentSection} ${styles.animateIn}`} aria-labelledby="technical-heading">
                <div className={styles.sectionHeadingWrapper}>
                  <span className={styles.sectionNumber}>04</span>
                  <div>
                    <h2 id="technical-heading" className={styles.sectionTitle}>
                      Technical Implementation
                    </h2>
                    <p className={styles.sectionSubtitle}>
                      Verified architectural components, dependencies, and subsystems
                    </p>
                  </div>
                </div>

                <div className={styles.techDetailsList}>
                  {technicalDetails.map((tech, idx) => (
                    <div key={idx} className={styles.techDetailRow}>
                      <div className={styles.techDetailHeader}>
                        <FaTools className={styles.techIcon} aria-hidden="true" />
                        <h3 className={styles.techAreaTitle}>{tech.area}</h3>
                      </div>
                      <p className={styles.techDetailText}>{tech.detail}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CHALLENGES & LEARNINGS */}
            {(challenges.length > 0 || learnings.length > 0) && (
              <section className={`${styles.contentSection} ${styles.animateIn}`} aria-labelledby="learnings-heading">
                <div className={styles.sectionHeadingWrapper}>
                  <span className={styles.sectionNumber}>05</span>
                  <div>
                    <h2 id="learnings-heading" className={styles.sectionTitle}>
                      Engineering Challenges & Learnings
                    </h2>
                    <p className={styles.sectionSubtitle}>
                      Technical hurdles encountered during development and architectural takeaways
                    </p>
                  </div>
                </div>

                {challenges.length > 0 && (
                  <div className={styles.challengesContainer}>
                    <h3 className={styles.subHeading}>Resolved Technical Hurdles</h3>
                    <div className={styles.challengesList}>
                      {challenges.map((c, i) => (
                        <div key={i} className={styles.challengeItem}>
                          <div className={styles.challengeQuestion}>
                            <span className={styles.challengeBadge}>Challenge</span>
                            <p className={styles.challengeProblem}>{c.challenge}</p>
                          </div>
                          <div className={styles.challengeAnswer}>
                            <span className={styles.solutionBadge}>Solution</span>
                            <p className={styles.challengeSolution}>{c.solution}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {learnings.length > 0 && (
                  <div className={styles.learningsContainer}>
                    <h3 className={styles.subHeading}>Key Takeaways</h3>
                    <ul className={styles.learningsList}>
                      {learnings.map((item, idx) => (
                        <li key={idx} className={styles.learningItem}>
                          <FaLightbulb className={styles.learningIcon} aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* GALLERY SECTION */}
            {gallery.length > 0 && (
              <section className={`${styles.contentSection} ${styles.animateIn}`} aria-labelledby="gallery-heading">
                <div className={styles.sectionHeadingWrapper}>
                  <span className={styles.sectionNumber}>06</span>
                  <div>
                    <h2 id="gallery-heading" className={styles.sectionTitle}>
                      Visual Showcase
                    </h2>
                    <p className={styles.sectionSubtitle}>
                      Genuine interface captures and subsystem views
                    </p>
                  </div>
                </div>

                <div className={styles.galleryGrid}>
                  {gallery.map((item, i) => (
                    <figure key={i} className={styles.galleryFigure}>
                      <div className={styles.galleryImageContainer}>
                        <img
                          src={item.url}
                          alt={item.alt || `${title} screenshot ${i + 1}`}
                          className={styles.galleryImage}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      {item.caption && (
                        <figcaption className={styles.galleryCaption}>
                          <FaImages className={styles.captionIcon} aria-hidden="true" />
                          <span>{item.caption}</span>
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {/* FOOTER NAVIGATION & NEXT PROJECT */}
            <nav className={`${styles.nextNavSection} ${styles.animateIn}`} aria-label="Project pagination">
              <div className={styles.paginationRow}>
                {prevProject && (
                  <Link
                    to={`/projects/${prevProject.slug}`}
                    className={styles.navProjectCard}
                    aria-label={`Previous project: ${prevProject.title}`}
                  >
                    <span className={styles.navDirection}>
                      <FaArrowLeft aria-hidden="true" /> Previous Project
                    </span>
                    <span className={styles.navProjectTitle}>{prevProject.title}</span>
                  </Link>
                )}

                <Link
                  to="/projects"
                  className={styles.navAllBtn}
                  aria-label="View all portfolio projects"
                >
                  All Projects
                </Link>

                {nextProject && (
                  <Link
                    to={`/projects/${nextProject.slug}`}
                    className={`${styles.navProjectCard} ${styles.navProjectCardRight}`}
                    aria-label={`Next project: ${nextProject.title}`}
                  >
                    <span className={styles.navDirection}>
                      Next Project <FaArrowRight aria-hidden="true" />
                    </span>
                    <span className={styles.navProjectTitle}>{nextProject.title}</span>
                  </Link>
                )}
              </div>

              {/* Contact Call to Action */}
              <div className={styles.contactCta}>
                <div className={styles.ctaCard}>
                  <div className={styles.ctaText}>
                    <h3 className={styles.ctaTitle}>Interested in collaborating?</h3>
                    <p className={styles.ctaSubtitle}>
                      Whether exploring full-stack engineering opportunities, discussing system architecture, or building performant applications, let’s talk.
                    </p>
                  </div>
                  <div className={styles.ctaActions}>
                    <Button
                      to="/contact"
                      variant="primary"
                      size="md"
                    >
                      Get in Touch
                    </Button>
                    <Button
                      to="/projects"
                      variant="secondary"
                      size="md"
                    >
                      Browse More Projects
                    </Button>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectCaseStudy;
