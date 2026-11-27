import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProjectCard.module.css';

const ArrowRightIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const ExternalLinkIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

const GitHubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const CodeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const optimizeImageUrl = (url, width = 960) => {
  if (!url || !url.includes('ik.imagekit.io')) return url;
  if (url.includes('tr=')) return url;
  return `${url}${url.includes('?') ? '&' : '?'}tr=w-${width},f-auto,q-80`;
};

const ProjectCard = ({ project }) => {
  const [imgError, setImgError] = useState(false);

  if (!project) return null;

  const {
    id,
    slug,
    title,
    shortDescription,
    description,
    imageUrl,
    tags = [],
    theme = 'Project',
    category,
    demoUrl,
    repoUrl,
  } = project;

  const caseStudyUrl = slug ? `/projects/${slug}` : '/projects';
  const displayDescription = shortDescription || description;
  const displayTags = tags.slice(0, 5);

  return (
    <article
      className={styles.card}
      aria-labelledby={`project-heading-${id}`}
    >
      <div className={styles.cardInner}>
        {/* Left Column: Information & Metadata */}
        <div className={styles.infoCol}>
          <div className={styles.metaRow}>
            <span className={styles.categoryBadge}>
              <span className={styles.metaDot} aria-hidden="true" />
              {category || theme}
            </span>
          </div>

          <h3 id={`project-heading-${id}`} className={styles.title}>
            <Link to={caseStudyUrl} className={styles.titleLink}>
              {title}
            </Link>
          </h3>

          <p className={styles.description}>{displayDescription}</p>

          {displayTags.length > 0 && (
            <ul className={styles.tagList} aria-label="Technologies used">
              {displayTags.map((tag) => (
                <li key={tag} className={styles.tag}>
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <div className={styles.actions}>
            <Link
              to={caseStudyUrl}
              className={styles.caseStudyBtn}
              aria-label={`Read case study for ${title}`}
            >
              <span>Case Study</span>
              <ArrowRightIcon className={styles.btnArrowIcon} />
            </Link>

            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionBtn}
                aria-label={`Open live demo for ${title} in a new tab`}
              >
                <span>Live Demo</span>
                <ExternalLinkIcon className={styles.btnIcon} />
              </a>
            )}

            {repoUrl && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionBtn}
                aria-label={`View ${title} source code on GitHub in a new tab`}
              >
                <span>Source Code</span>
                <GitHubIcon className={styles.btnIcon} />
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Visual Preview */}
        <div className={styles.previewCol}>
          <Link
            to={caseStudyUrl}
            className={styles.previewLink}
            aria-label={`Explore ${title} case study`}
            tabIndex={0}
          >
            <div className={styles.imageContainer}>
              {!imgError && imageUrl ? (
                <img
                  src={optimizeImageUrl(imageUrl, 960)}
                  alt={`${title} project interface preview`}
                  width="960"
                  height="540"
                  className={styles.previewImage}
                  loading="lazy"
                  decoding="async"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className={styles.imageFallback}>
                  <CodeIcon className={styles.fallbackIcon} />
                  <span className={styles.fallbackTitle}>{title}</span>
                </div>
              )}
              <div className={styles.previewOverlay}>
                <span className={styles.previewBadge}>
                  <span>Explore Case Study</span>
                  <ArrowRightIcon className={styles.badgeIcon} />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
