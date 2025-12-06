
import styles from './ProjectCard.module.css';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectCard = ({ project }) => {
  const accent = project.accentColor || 'var(--primary-color)';
  const themeName = project.theme || 'General';
  
  // Generate a subtle background from accent color
  const generateBackground = (accentColor) => {
    // Use the accent color with reduced opacity to create a solid background
    return `${accentColor}35`;
  };
  
  const background = generateBackground(accent);

  return (
    <div
      className={styles["project-card-modern"]}
      style={{
        ['--project-accent']: accent,
        ['--project-accent-weak']: `${accent}20`,
        ['--project-theme-bg']: background,
        background: `var(--project-theme-bg)`,
      }}
    >
      <div className={styles["project-card-content"]}>
        <div className={styles["project-card-left"]}>
          <div className={styles["project-card-theme-badge"]}>{themeName}</div>
          <h1 className={styles["project-card-title"]}>{project.title}</h1>
          <p className={styles["project-card-description"]}>{project.description}</p>
          <div className={styles["project-card-tags"]}>
            {project.tags.map((tag) => (
              <span key={tag} className={styles["project-card-tag"]}>{tag}</span>
            ))}
          </div>
          <div className={styles["project-card-buttons"]}>
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles["project-card-button"] + ' ' + styles["project-card-button-demo"]}
            >
              <span>Get a Demo</span>
              <span className={styles["project-card-button-icon"]}><FaExternalLinkAlt /></span>
            </a>
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles["project-card-button"] + ' ' + styles["project-card-button-code"]}
            >
              <span>View Code</span>
              <span className={styles["project-card-button-icon"]}><FaGithub /></span>
            </a>
          </div>
        </div>
        <div className={styles["project-card-right"]}>
          <img
            src={project.imageUrl}
            alt={`${project.title} screenshot`}
            className={styles["project-card-image"]}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;