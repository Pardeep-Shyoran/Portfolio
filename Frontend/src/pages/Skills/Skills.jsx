import { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import skillsData from "../../data/skills";
import { prefersReducedMotion } from "../../utils/scrollHelper";
import styles from "./Skills.module.css";

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  // GSAP Entrance animation
  useGSAP(
    () => {
      if (prefersReducedMotion() || !sectionRef.current) return;

      const header = sectionRef.current.querySelector(`.${styles.header}`);
      const cards = sectionRef.current.querySelectorAll(`.${styles.categoryCard}`);

      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  const getCategoryIcon = (categoryIcon) => {
    switch (categoryIcon) {
      case "code":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        );
      case "server":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="3" width="20" height="7" rx="2" />
            <rect x="2" y="14" width="20" height="7" rx="2" />
            <line x1="6" y1="6.5" x2="6.01" y2="6.5" strokeWidth="2.5" />
            <line x1="6" y1="17.5" x2="6.01" y2="17.5" strokeWidth="2.5" />
          </svg>
        );
      case "database":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <ellipse cx="12" cy="5" rx="8" ry="3" />
            <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
            <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
          </svg>
        );
      case "tools":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
    }
  };

  const getSkillIcon = (iconName) => {
    switch (iconName) {
      case "react":
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="2.2" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1.4" fill="none">
              <ellipse cx="12" cy="12" rx="9" ry="3.8" />
              <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)" />
              <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)" />
            </g>
          </svg>
        );
      case "javascript":
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 16.5c0 .8-.5 1.5-1.5 1.5-.7 0-1.2-.4-1.5-1m9-3.5c-.8-.5-1.7-.5-2.2 0-.6.6-.5 1.5.2 2s1.8.8 1.8 1.8c0 .8-.7 1.5-1.8 1.5-.9 0-1.6-.4-2-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          </svg>
        );
      case "html":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 3l1.5 15.5L12 21l6.5-2.5L20 3H4z" />
            <path d="M8 7h8l-.5 4.5H9l.3 3 2.7.8 2.7-.8.3-2.5" />
          </svg>
        );
      case "tailwind":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6 12c.7-2.7 2.4-4 5.2-4 3.9 0 4.4 3 6.3 3.5 1.4.4 2.6-.2 3.5-1.5-.7 2.7-2.4 4-5.2 4-3.9 0-4.4-3-6.3-3.5C8.1 10.1 6.9 10.7 6 12zm-4 5.5c.7-2.7 2.4-4 5.2-4 3.9 0 4.4 3 6.3 3.5 1.4.4 2.6-.2 3.5-1.5-.7 2.7-2.4 4-5.2 4-3.9 0-4.4-3-6.3-3.5-1.4-.5-2.6.1-3.5 1.5z" />
          </svg>
        );
      case "gsap":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        );
      case "nodejs":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2l8.5 4.9v9.8L12 21.6l-8.5-4.9V6.9L12 2z" />
            <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
          </svg>
        );
      case "express":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="monospace" fill="currentColor" stroke="none">ex</text>
          </svg>
        );
      case "api":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M7 8h10M7 12h6M7 16h8" />
          </svg>
        );
      case "socket":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        );
      case "jwt":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2L4 6v6c0 5.25 3.4 10.15 8 11.35 4.6-1.2 8-6.1 8-11.35V6l-8-4z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        );
      case "mongodb":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2c-.3 2.5-4 5.5-4 10.5 0 4 3 6.5 4 7.5 1-1 4-3.5 4-7.5 0-5-3.7-8-4-10.5z" />
            <path d="M12 2v18" strokeWidth="1.2" />
          </svg>
        );
      case "mysql":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <ellipse cx="12" cy="6" rx="8" ry="3" />
            <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
            <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
          </svg>
        );
      case "redis":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
            <polygon points="12 3 21 7.5 12 12 3 7.5 12 3" />
            <path d="M3 12l9 4.5 9-4.5" />
            <path d="M3 16.5l9 4.5 9-4.5" />
          </svg>
        );
      case "aws":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
          </svg>
        );
      case "git":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="9" r="3" />
            <path d="M6 9v6M9 6h4a5 5 0 0 1 5 3" />
          </svg>
        );
      case "docker":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="9" width="3" height="3" fill="currentColor" />
            <rect x="8" y="9" width="3" height="3" fill="currentColor" />
            <rect x="12" y="9" width="3" height="3" fill="currentColor" />
            <rect x="8" y="5" width="3" height="3" fill="currentColor" />
            <rect x="12" y="5" width="3" height="3" fill="currentColor" />
            <path d="M2 13c1.5 5 5 8 11 8 6 0 9-3 10-6-1.5-.5-3 0-4-1 0-2-1-3-2-3H2z" />
          </svg>
        );
      case "postman":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        );
      case "vercel":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="12 3 22 20 2 20 12 3" />
          </svg>
        );
      case "vscode":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
            <path d="M17 2l4 2v16l-4 2-8-6.5L3.5 19 2 17.5 6 12 2 6.5 3.5 5 9 8.5 17 2z" />
            <path d="M17 6v12" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="12" cy="12" r="8" />
          </svg>
        );
    }
  };

  const filterTabs = [
    { id: "all", label: "All" },
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend" },
    { id: "database", label: "Database" },
    { id: "tools", label: "DevOps & Tools" },
  ];

  const displayedCategories =
    activeCategory === "all"
      ? skillsData
      : skillsData.filter((cat) => cat.id === activeCategory);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className={styles.skillsSection}
      aria-label="Technical Skills and Stack"
    >
      <header className={styles.header}>
        <span className={styles.kicker}>Tech Stack</span>
        <h2 className={styles.title}>Skills &amp; Technologies</h2>
        <p className={styles.subtitle}>
          The core frameworks, databases, and engineering tools I use to build full-stack web applications.
        </p>

        {/* Category Filter Pills */}
        <div className={styles.filterBar} role="tablist" aria-label="Skill Categories">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              id={`skill-tab-${tab.id}`}
              role="tab"
              aria-selected={activeCategory === tab.id}
              aria-controls="skills-tabpanel"
              className={`${styles.filterBtn} ${activeCategory === tab.id ? styles.filterBtnActive : ""}`}
              onClick={() => setActiveCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Symmetrical, High-End Category Grid */}
      <div
        ref={gridRef}
        id="skills-tabpanel"
        role="tabpanel"
        aria-labelledby={`skill-tab-${activeCategory}`}
        className={`${styles.categoriesGrid} ${
          displayedCategories.length === 1 ? styles.singleCategoryGrid : ""
        }`}
      >
        {displayedCategories.map((category) => (
          <article className={styles.categoryCard} key={category.id}>
            <div className={styles.cardHeader}>
              <div className={styles.categoryIdentity}>
                <span className={styles.categoryIconWrap}>
                  {getCategoryIcon(category.icon)}
                </span>
                <h3 className={styles.categoryTitle}>{category.category}</h3>
              </div>
              <span className={styles.taglineBadge}>
                {category.tagline}
              </span>
            </div>

            <div className={styles.skillsGrid}>
              {category.skills.map((skill) => (
                <div key={skill.name} className={styles.skillItem}>
                  <span className={styles.skillIconWrap}>
                    {getSkillIcon(skill.icon)}
                  </span>
                  <span className={styles.skillName}>{skill.name}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Skills;
