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
// Inline SVGs replace react-icons to eliminate the vendor-icons chunk from the critical path
const FaFolderOpen = ({ className }) => (
  <svg className={className} viewBox="0 0 576 512" fill="currentColor" aria-hidden="true">
    <path d="M572.694 292.093L500.27 416.248A63.997 63.997 0 0 1 444.989 448H45.025c-18.26 0-31.023-18.5-24.634-35.572l72.424-192C99.44 203.231 116.027 192 134.482 192H544c18.654 0 31.3 19.071 28.694 100.093zM64 224L0 448V64c0-35.346 28.654-64 64-64h220.284c14.142 0 27.714 5.629 37.713 15.627l37.37 37.372A64.028 64.028 0 0 0 405.08 68H512c35.346 0 64 28.654 64 64v32H144c-27.042 0-51.049 16.714-60.496 42.023z"/>
  </svg>
);

const FaRedo = ({ className }) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
    <path d="M500.33 0h-47.41a12 12 0 0 0-12 12.57l4 72A247.16 247.16 0 0 0 256 8C119.34 8 7.9 119.53 8 256.19 8.1 393.07 119.1 504 256 504a247.1 247.1 0 0 0 166.18-63.91 12 12 0 0 0 .48-17.43l-34-34a12 12 0 0 0-16.38-.55A176 176 0 1 1 402.1 157.8l-101.53-4.87a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12h200.33a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12z"/>
  </svg>
);

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
