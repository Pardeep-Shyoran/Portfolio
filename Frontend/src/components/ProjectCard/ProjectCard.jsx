import styles from './ProjectCard.module.css';
// You can add icons from react-icons if you like:
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectCard = ({ project }) => {
  const accent = project.accentColor || 'var(--primary-color)'
  const themeName = project.theme || 'General'
  return (
    <div className={styles["project-card"]} style={{
      // Expose per-card CSS variables used by global styles
      ['--project-accent']: accent,
      ['--project-accent-weak']: `${accent}20`, // ~12% opacity
    }}>
      <div className={styles["project-image-container"]}>
        <img
          src={project.imageUrl}
          alt={`${project.title} screenshot`}
          className={styles["project-image"]}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className={styles["project-content"]}>
        <div className={styles["project-meta"]}>
          <span className={styles["project-theme-badge"]} title={`Theme: ${themeName}`}>{themeName}</span>
        </div>
        <h3 className={styles["project-title"]}>{project.title}</h3>
        <p className={styles["project-description"]}>{project.description}</p>
        <div className={styles["project-tags"]}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles["project-tag"]}>{tag}</span>
          ))}
        </div>
        <div className={styles["project-links"]}>
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={styles["project-link"]}>
            {<FaExternalLinkAlt />} Live Demo
          </a>
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className={styles["project-link"]}>
            {<FaGithub />} Code
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;