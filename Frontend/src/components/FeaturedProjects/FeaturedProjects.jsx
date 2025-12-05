import { useNavigate } from 'react-router-dom'
import styles from './FeaturedProjects.module.css'
import ProjectCard from '../ProjectCard/ProjectCard'
import projectsData from '../../data/project'

const FeaturedProjects = () => {
  const navigate = useNavigate()
  const topProjects = projectsData.slice(0, 2)

  return (
    <section id="featuredProjects" className={styles.projects}>
      <h1 className={styles.title}>Featured Projects</h1>
      <div className={styles.projectsGrid}>
        {topProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <button className={styles.seeMoreBtn} onClick={() => navigate('/projects')}>
        See More Projects
      </button>
    </section>
  )
}

export default FeaturedProjects