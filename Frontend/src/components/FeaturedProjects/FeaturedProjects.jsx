import { useMemo, useRef, useEffect } from 'react';
import styles from './FeaturedProjects.module.css';
import ProjectCard from '../ProjectCard/ProjectCard';
import projectsData from '../../data/project';
import Button from '../Button/Button';
import { prefersReducedMotion } from '../../utils/scrollHelper';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FeaturedProjects = () => {
  const sectionRef = useRef(null);

  // Curate top featured projects
  const featuredProjects = useMemo(() => {
    const featured = projectsData.filter((p) => p.featured);
    return featured.length > 0 ? featured : projectsData.slice(0, 3);
  }, []);

  useEffect(() => {
    // Respect user reduced-motion preference & automated browsers
    if (prefersReducedMotion() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current.querySelectorAll(`.${styles.cardItem}`);
      if (!cards || cards.length === 0) return;

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [featuredProjects]);

  return (
    <section id="featuredProjects" className={styles.section} ref={sectionRef}>
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