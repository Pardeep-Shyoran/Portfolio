import React, { useMemo, useState } from 'react';
import ProjectCard from '../../components/ProjectCard/ProjectCard.jsx';
import projectsData from '../../data/project.js';
import styles from './Projects.module.css';


const ProjectsPage = () => {
  const [selectedTheme, setSelectedTheme] = useState('All')

  const themes = useMemo(() => {
    const set = new Set(projectsData.map(p => p.theme || 'General'))
    return ['All', ...Array.from(set)]
  }, [])

  const visible = useMemo(() => {
    if (selectedTheme === 'All') return projectsData
    return projectsData.filter(p => (p.theme || 'General') === selectedTheme)
  }, [selectedTheme])

  return (
    <section className={styles['projects-section']} id="projects">
      <div className={styles['projects-container']}>
        <h2 className={styles['projects-heading']}>My Work & Projects</h2>
        <div className={styles['projects-filters']} style={{
          display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem'
        }}>
          {themes.map(th => (
            <button
              key={th}
              type="button"
              onClick={() => setSelectedTheme(th)}
              className={styles["project-filter-chip"]}
              aria-pressed={selectedTheme === th}
              style={{
                padding: '0.4rem 0.9rem', borderRadius: '999px', cursor: 'pointer',
                border: '1px solid var(--border-color)',
                background: selectedTheme === th ? 'var(--text-color)' : 'transparent',
                color: selectedTheme === th ? 'var(--background-color)' : 'var(--text-color)',
                transition: 'all .2s ease'
              }}
            >
              {th}
            </button>
          ))}
        </div>
        <div className={styles['projects-grid']}>
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsPage;