import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import StructuredData from "../../components/StructuredData/StructuredData";
import profileData from "../../data/profile";
import GitHubCalendar from "../../components/GitHub/GitHub.jsx";
import LeetCode from "../../components/LeetCode/LeetCode.jsx";
import GFG from "../../components/GFG/GFG.jsx";
import styles from "./Stats.module.css";

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