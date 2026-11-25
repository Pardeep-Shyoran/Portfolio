import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../../utils/scrollHelper";
import StructuredData from "../../components/StructuredData/StructuredData";
import profileData from "../../data/profile";
import GitHubCalendar from "../../components/GitHub/GitHub.jsx";
import LeetCode from "../../components/LeetCode/LeetCode.jsx";
import GFG from "../../components/GFG/GFG.jsx";
import styles from "./Stats.module.css";

gsap.registerPlugin(ScrollTrigger);

const CODOLIO_URL = profileData.profiles.codolio.cardUrl;
const SUMMARY_METRICS = profileData.statsSnapshot.summary;

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
  const sectionRef = useRef(null);

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
        <>
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
            <link rel="alternate" type="text/markdown" href="/stats.md" title="Markdown version" />
          </Helmet>
          <StructuredData
            data={{
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Coding Stats — Pardeep Shyoran",
              url: `${profileData.siteUrl}/stats`,
              about: {
                "@type": "Person",
                name: profileData.name,
                url: profileData.siteUrl,
              },
            }}
          />
        </>
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
                type="button"
                id={`stats-tab-${tab.id}`}
                role="tab"
                aria-selected={activePlatform === tab.id}
                aria-controls="stats-tabpanel"
                className={`${styles.filterBtn} ${activePlatform === tab.id ? styles.filterBtnActive : ""}`}
                onClick={() => setActivePlatform(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* High-Level Overview Metrics */}
        <dl className={styles.summaryBar} aria-label="Coding summary metrics">
          {SUMMARY_METRICS.map((metric) => (
            <div className={styles.summaryCard} key={metric.label}>
              <dd className={styles.summaryValue}>{metric.value}</dd>
              <dt className={styles.summaryLabel}>{metric.label}</dt>
              <dd className={styles.summaryHint}>{metric.hint}</dd>
            </div>
          ))}
        </dl>

        {/* Dynamic Platforms Content (always mounted for immediate accessibility/agent inspection) */}
        <div
          id="stats-tabpanel"
          role="tabpanel"
          aria-labelledby={`stats-tab-${activePlatform}`}
          className={styles.platformArea}
        >
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
      </section>
    </>
  );
};

export default Stats;