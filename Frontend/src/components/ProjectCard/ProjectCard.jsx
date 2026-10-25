import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProjectCard.module.css';
import { FaGithub, FaExternalLinkAlt, FaCode, FaArrowRight } from 'react-icons/fa';

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
              <FaArrowRight className={styles.btnArrowIcon} aria-hidden="true" />
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
                <FaExternalLinkAlt className={styles.btnIcon} aria-hidden="true" />
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
                <FaGithub className={styles.btnIcon} aria-hidden="true" />
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
                  src={imageUrl}
                  alt={`${title} project interface preview`}
                  className={styles.previewImage}
                  loading="lazy"
                  decoding="async"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className={styles.imageFallback}>
                  <FaCode className={styles.fallbackIcon} aria-hidden="true" />
                  <span className={styles.fallbackTitle}>{title}</span>
                </div>
              )}
              <div className={styles.previewOverlay}>
                <span className={styles.previewBadge}>
                  <span>Explore Case Study</span>
                  <FaArrowRight className={styles.badgeIcon} aria-hidden="true" />
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