import React, { useMemo, useState, useEffect, useRef } from "react";
import ProjectCard from "../../components/ProjectCard/ProjectCard.jsx";
import projectsData from "../../data/project.js";
import styles from "./Projects.module.css";
import { Helmet } from "react-helmet";
import Button from "../../components/Button/Button";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ProjectsPage = () => {
  const [selectedTheme, setSelectedTheme] = useState("All");
  const containerRef = useRef(null);

  const themes = useMemo(() => {
    const set = new Set(projectsData.map((p) => p.theme || "General"));
    return ["All", ...Array.from(set)];
  }, []);

  const visible = useMemo(() => {
    if (selectedTheme === "All") return projectsData;
    return projectsData.filter((p) => (p.theme || "General") === selectedTheme);
  }, [selectedTheme]);

  useEffect(() => {
    gsap.to(window, { scrollTo: 0, duration: 0.5 });
  }, []);

  // Stack effect animation
  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll(`.${styles["project-card-stack"]}`);
    
    if (!cards || cards.length === 0) return;

    // Clear any existing animations
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    gsap.killTweensOf(cards);

    cards.forEach((card, index) => {
      // Initial state - stack the cards
      gsap.set(card, {
        y: index * 25,
        opacity: 1 - index * 0.1,
        rotationX: index * 1.5,
        scale: 1 - index * 0.015,
        zIndex: cards.length - index,
      });

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
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [visible]);

  return (
    <>
      <Helmet>
        <title>Projects | Pardeep Shyoran's Portfolio Work</title>
        <meta
          name="description"
          content="Browse Pardeep's featured projects—each showcasing backend mastery, milestone visuals, and concise branding."
        />
        <meta
          name="keywords"
          content="Portfolio Projects, Web Development, Backend Architecture, Milestone Posts, GitHub Projects"
        />
      </Helmet>

      <section className={styles["projects-section"]} id="projects">
        <div className={styles["projects-container"]}>
          <h2 className={styles["projects-heading"]}>My Work & Projects</h2>
          <div className={styles["projects-filters"]}>
            {themes.map((th) => (
              <button
                key={th}
                type="button"
                onClick={() => setSelectedTheme(th)}
                className={`${styles["project-filter-chip"]} ${
                  selectedTheme === th ? styles.active : ""
                }`}
                aria-pressed={selectedTheme === th}
              >
                {th}
              </button>
            ))}
          </div>
          <div className={styles["projects-grid"]} ref={containerRef}>
            {visible.map((project) => (
              <div key={project.id} className={styles["project-card-stack"]}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectsPage;
