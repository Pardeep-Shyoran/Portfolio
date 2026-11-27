import { useMemo } from 'react';
import styles from './FeaturedProjects.module.css';
import ProjectCard from '../ProjectCard/ProjectCard';
import projectsData from '../../data/project';
import Button from '../Button/Button';

const FeaturedProjects = () => {
  // Curate top featured projects
  const featuredProjects = useMemo(() => {
    const featured = projectsData.filter((p) => p.featured);
    return featured.length > 0 ? featured : projectsData.slice(0, 3);
  }, []);

  return (
    <section id="featuredProjects" className={styles.section}>
      <div className={styles.header}>
        <span className={styles.kicker}>SELECTED WORK</span>
        <h2 className={styles.title}>Projects built with purpose.</h2>
        <p className={styles.subtitle}>
          A selection of web applications, interfaces, and engineering projects.
        </p>
      </div>

      <div className={styles.grid}>
        {featuredProjects.map((project) => (
          <div key={project.id} className={styles.cardItem}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      <div className={styles.actionRow}>
        <Button
          to="/projects"
          variant="secondary"
          size="lg"
          className={styles.seeMoreBtn}
        >
          Explore All Projects
        </Button>
      </div>
    </section>
  );
};

export default FeaturedProjects;
