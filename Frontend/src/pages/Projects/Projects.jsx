import React, { useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ProjectCard from "../../components/ProjectCard/ProjectCard.jsx";
import StructuredData from "../../components/StructuredData/StructuredData.jsx";
import projectsData from "../../data/project.js";
import profileData from "../../data/profile.js";
import { prefersReducedMotion } from "../../utils/scrollHelper.js";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTag = (searchParams.get("tag") || "").trim();
  const matchedOption = FILTER_OPTIONS.find(
    (opt) => opt.value.toLowerCase() === rawTag.toLowerCase()
  );
  const activeTagFromUrl = rawTag
    ? matchedOption
      ? matchedOption.value
      : rawTag
    : "All";
  const [selectedFilter, setSelectedFilter] = useState(activeTagFromUrl);
  const containerRef = useRef(null);

  // Keep filter state synchronized when URL query parameters change (e.g. via WebMCP navigation)
  useEffect(() => {
    setSelectedFilter(activeTagFromUrl);
  }, [activeTagFromUrl]);

  const handleSelectFilter = (value) => {
    setSelectedFilter(value);
    if (value === "All") {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ tag: value }, { replace: true });
    }
  };

  const filterOptions = useMemo(() => {
    if (
      selectedFilter === "All" ||
      FILTER_OPTIONS.some((opt) => opt.value.toLowerCase() === selectedFilter.toLowerCase())
    ) {
      return FILTER_OPTIONS;
    }
    return [...FILTER_OPTIONS, { label: selectedFilter, value: selectedFilter }];
  }, [selectedFilter]);

  // Compute live counts per technology filter
  const filterCounts = useMemo(() => {
    const counts = { All: projectsData.length };
    filterOptions.slice(1).forEach(({ value }) => {
      counts[value] = projectsData.filter((p) =>
        p.tags?.some((t) => t.toLowerCase().includes(value.toLowerCase()))
      ).length;
    });
    return counts;
  }, [filterOptions]);

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
    if (prefersReducedMotion() || !containerRef.current) return;

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
        <link rel="alternate" type="text/markdown" href="/projects.md" title="Markdown version" />
      </Helmet>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Selected Works — Pardeep Shyoran",
          url: `${profileData.siteUrl}/projects`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: projectsData.map((p, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: p.title,
              url: `${profileData.siteUrl}/projects/${p.slug}`,
            })),
          },
        }}
      />

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
              {filterOptions.map(({ label, value }) => {
                const isActive = selectedFilter === value;
                const count = filterCounts[value] || 0;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleSelectFilter(value)}
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
                  onClick={() => handleSelectFilter("All")}
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
