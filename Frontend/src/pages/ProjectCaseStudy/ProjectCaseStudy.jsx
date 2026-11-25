import React, { useMemo, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import {
  FaGithub,
  FaExternalLinkAlt,
  FaArrowLeft,
  FaArrowRight,
  FaCode,
  FaLayerGroup,
  FaTools,
  FaLightbulb,
  FaExclamationTriangle,
  FaImages,
} from 'react-icons/fa';
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
