import { useNavigate } from 'react-router-dom'
import { useRef, useEffect } from 'react'
import styles from './FeaturedProjects.module.css'
import ProjectCard from '../ProjectCard/ProjectCard'
import projectsData from '../../data/project'
import Button from '../Button/Button'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FeaturedProjects = () => {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const topProjects = projectsData.slice(0, 2)

  // Stack effect animation
  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll(`.${styles["project-card-stack"]}`)
    
    if (!cards || cards.length === 0) return

    // Clear any existing animations
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    gsap.killTweensOf(cards)

    cards.forEach((card, index) => {
      // Initial state - stack the cards
      gsap.set(card, {
        y: index * 25,
        opacity: 1 - index * 0.1,
        rotationX: index * 1.5,
        scale: 1 - index * 0.015,
        zIndex: cards.length - index,
      })

      // Animate when scrolling
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
          markers: false,
        },
        y: 0,
        opacity: 1,
        rotationX: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [topProjects])

  return (
    <section id="featuredProjects" className={styles.projects}>
      <h1 className={styles.title}>Featured Projects</h1>
      <div className={styles.projectsGrid} ref={containerRef}>
        {topProjects.map((project) => (
          <div key={project.id} className={styles["project-card-stack"]}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
      <Button
        onClick={() => navigate('/projects')}
        variant="secondary"
        size="lg"
        className={styles.seeMoreBtn}
      >
        See More Projects
      </Button>
    </section>
  )
}

export default FeaturedProjects