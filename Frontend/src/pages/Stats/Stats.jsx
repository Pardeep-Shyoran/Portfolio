import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { prefersReducedMotion } from "../../utils/scrollHelper";
import GitHubCalendar from "../../components/GitHub/GitHub.jsx";
import LeetCode from "../../components/LeetCode/LeetCode.jsx";
import GFG from "../../components/GFG/GFG.jsx";
import styles from "./Stats.module.css";

gsap.registerPlugin(ScrollTrigger);

const CODOLIO_URL = "https://codolio.com/profile/Pardeep_Shyoran/card";

const SUMMARY_METRICS = [
  { label: "DSA Solved", value: "400+", hint: "LeetCode & GFG" },
  { label: "Repositories", value: "41", hint: "GitHub" },
  { label: "Medium DSA", value: "200+", hint: "LeetCode & GFG" },
  { label: "Yearly Commits", value: "380+", hint: "Open Source" },
];

const PLATFORM_TABS = [
  { id: "all", label: "All" },
  { id: "github", label: "GitHub" },
  { id: "leetcode", label: "LeetCode" },
  { id: "gfg", label: "GeeksforGeeks" },
];

const Stats = () => {
  const location = useLocation();
  const isStandalonePage = location.pathname === "/stats";
  const [activePlatform, setActivePlatform] = useState("all");
  const [sectionRef, isVisible] = useIntersectionObserver({ rootMargin: "300px" });

  const shouldRender = isStandalonePage || isVisible;

  useGSAP(
    () => {
      if (prefersReducedMotion() || !sectionRef.current) return;

      const header = sectionRef.current.querySelector(`.${styles.header}`);
      const summaryBar = sectionRef.current.querySelector(`.${styles.summaryBar}`);
      const platformArea = sectionRef.current.querySelector(`.${styles.platformArea}`);

      const animTargets = [header, summaryBar, platformArea].filter(Boolean);

      if (animTargets.length > 0) {
        gsap.fromTo(
          animTargets,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  const HeadingTag = isStandalonePage ? "h1" : "h2";

  return (
    <>
      {isStandalonePage && (
        <Helmet>
          <title>Coding Stats | Pardeep Shyoran</title>
          <meta
            name="description"
            content="Explore Pardeep Shyoran's coding metrics and problem-solving records across GitHub, LeetCode, and GeeksforGeeks."
          />
          <meta
            name="keywords"
            content="Pardeep Shyoran stats, LeetCode, GitHub, GeeksforGeeks, coding metrics, problem solving"
          />
          <link rel="canonical" href="https://pardeep-shyoran.me/stats" />
        </Helmet>
      )}

      <section
        id="stats"
        ref={sectionRef}
        className={styles.statsSection}
        aria-label="Developer Statistics and Coding Activity"
      >
        <header className={styles.header}>
          <span className={styles.kicker}>Activity &amp; Metrics</span>
          <HeadingTag className={styles.title}>Coding Stats</HeadingTag>
          <p className={styles.subtitle}>
            A live snapshot of my open-source code and algorithmic problem-solving.
          </p>

          {/* Platform Filter Bar */}
          <div className={styles.filterBar} role="tablist" aria-label="Platform Filters">
            {PLATFORM_TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activePlatform === tab.id}
                className={`${styles.filterBtn} ${activePlatform === tab.id ? styles.filterBtnActive : ""}`}
                onClick={() => setActivePlatform(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* High-Level Overview Metrics */}
        <div className={styles.summaryBar}>
          {SUMMARY_METRICS.map((metric) => (
            <div className={styles.summaryCard} key={metric.label}>
              <span className={styles.summaryValue}>{metric.value}</span>
              <span className={styles.summaryLabel}>{metric.label}</span>
              <span className={styles.summaryHint}>{metric.hint}</span>
            </div>
          ))}
        </div>

        {/* Dynamic Platforms Content */}
        {shouldRender ? (
          <div className={styles.platformArea}>
            {activePlatform === "all" && (
              <div className={styles.allLayout}>
                <div className={styles.fullWidthCard}>
                  <GitHubCalendar />
                </div>
                <div className={styles.twoColumnGrid}>
                  <LeetCode />
                  <GFG />
                </div>
              </div>
            )}

            {activePlatform === "github" && (
              <div className={styles.singlePlatform}>
                <GitHubCalendar />
              </div>
            )}

            {activePlatform === "leetcode" && (
              <div className={styles.singlePlatform}>
                <LeetCode />
              </div>
            )}

            {activePlatform === "gfg" && (
              <div className={styles.singlePlatform}>
                <GFG />
              </div>
            )}

            {/* Codolio Profile Card Banner */}
            <div className={styles.codolioFooter}>
              <span className={styles.codolioText}>Aggregated profile on Codolio:</span>
              <a
                href={CODOLIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.codolioLink}
              >
                <span>View Codolio Stats Card</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        ) : (
          <div className={styles.placeholder} aria-hidden="true">
            <div className={styles.placeholderText}>LOADING CODING STATS...</div>
          </div>
        )}
      </section>
    </>
  );
};

export default Stats;