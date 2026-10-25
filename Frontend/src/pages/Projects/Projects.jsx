import React, { useMemo, useState, useEffect, useRef } from "react";
import ProjectCard from "../../components/ProjectCard/ProjectCard.jsx";
import projectsData from "../../data/project.js";
import styles from "./Projects.module.css";
import { Helmet } from "react-helmet";
import gsap from "gsap";
import { FaFolderOpen, FaRedo } from "react-icons/fa";

const FILTER_OPTIONS = [
  { label: "All", value: "All" },
  { label: "React", value: "React" },
  { label: "Node.js", value: "Node.js" },
  { label: "MongoDB", value: "MongoDB" },
  { label: "JavaScript", value: "JavaScript" },
];

const ProjectsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const containerRef = useRef(null);

  // Compute live counts per technology filter
  const filterCounts = useMemo(() => {
    const counts = { All: projectsData.length };
    FILTER_OPTIONS.slice(1).forEach(({ value }) => {
      counts[value] = projectsData.filter((p) =>
        p.tags?.some((t) => t.toLowerCase().includes(value.toLowerCase()))
      ).length;
    });
    return counts;
  }, []);

  // Filter projects by selected technology
  const visibleProjects = useMemo(() => {
    if (selectedFilter === "All") return projectsData;
    return projectsData.filter((p) =>
      p.tags?.some((t) => t.toLowerCase().includes(selectedFilter.toLowerCase()))
    );
  }, [selectedFilter]);

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Subtle staggered entrance animation on filter change
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const cards = containerRef.current.querySelectorAll(`.${styles.cardItem}`);
      if (!cards || cards.length === 0) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: "power2.out",
          clearProps: "transform,opacity",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [visibleProjects]);

  return (
    <>
      <Helmet>
        <title>Projects & Archive | Pardeep Shyoran</title>
        <meta
          name="description"
          content="Explore Pardeep Shyoran's portfolio of production applications, real-time architectures, full-stack systems, and interactive web experiments."
        />
        <meta
          name="keywords"
          content="Pardeep Shyoran, Web Development, Full-Stack, React, Node.js, Express, MongoDB, Portfolio Projects"
        />
        <link rel="canonical" href="https://pardeep-shyoran.me/projects" />
      </Helmet>

      <div className={styles.page}>
        <section className={styles.introSection} aria-labelledby="page-heading">
          <div className={styles.introContainer}>
            <span className={styles.kicker}>Archive & Case Studies</span>
            <h1 id="page-heading" className={styles.heading}>
              Selected Works
            </h1>
            <p className={styles.lead}>
              A curated catalog of full-stack platforms, real-time collaboration engines, and frontend experiments built with modern web technologies.
            </p>

            {/* Filter Navigation */}
            <div
              className={styles.filters}
              role="group"
              aria-label="Filter projects by technology"
            >
              {FILTER_OPTIONS.map(({ label, value }) => {
                const isActive = selectedFilter === value;
                const count = filterCounts[value] || 0;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelectedFilter(value)}
                    className={`${styles.filterChip} ${isActive ? styles.activeChip : ""}`}
                    aria-pressed={isActive}
                  >
                    <span>{label}</span>
                    <span className={styles.chipCount}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Projects Gallery */}
        <section
          className={styles.gallerySection}
          aria-label={`Projects list, showing ${visibleProjects.length} ${visibleProjects.length === 1 ? "project" : "projects"}`}
        >
          <div className={styles.galleryContainer} ref={containerRef}>
            {visibleProjects.length > 0 ? (
              visibleProjects.map((project) => (
                <div key={project.id} className={styles.cardItem}>
                  <ProjectCard project={project} />
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIconWrapper}>
                  <FaFolderOpen className={styles.emptyIcon} aria-hidden="true" />
                </div>
                <h2 className={styles.emptyTitle}>No Projects Found</h2>
                <p className={styles.emptyDescription}>
                  No projects currently match the "{selectedFilter}" filter criteria.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedFilter("All")}
                  className={styles.resetButton}
                >
                  <FaRedo className={styles.resetIcon} aria-hidden="true" />
                  <span>Show All Projects</span>
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default ProjectsPage;
