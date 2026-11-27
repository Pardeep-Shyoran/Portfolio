import { useState, useEffect, useCallback } from 'react';
import { statsCache } from '../../utils/statsCache';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import styles from './GFG.module.css';

const SiGeeksforgeeks = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const FaCalendarCheck = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
    <path d="m9 16 2 2 4-4" />
  </svg>
);

const FaArrowUpRightFromSquare = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

const FaArrowRotateRight = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);

const GFG_USERNAME = 'pardeepsheqqo4';
const GFG_PROFILE_URL = `https://www.geeksforgeeks.org/profile/${GFG_USERNAME}/?tab=activity`;
const GFG_STATS_API = `/api/gfg/${GFG_USERNAME}`;
const GFG_SUMMARY_API = `/api/gfg-summary/${GFG_USERNAME}`;

// Real verified stats for pardeepsheqqo4
const VERIFIED_GFG_STATS = {
  totalSolved: 204,
  easy: 83,
  medium: 99,
  basicSchool: 22,
  activeDays: 165,
};

const GFG = () => {
  const [cardRef, isNearViewport] = useIntersectionObserver({ rootMargin: '400px' });
  const [data, setData] = useState(() => statsCache.getRaw('gfg') || VERIFIED_GFG_STATS);
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(true);

  const fetchData = useCallback(async (force = false) => {
    try {
      if (!force) {
        const cached = statsCache.get('gfg');
        if (cached) {
          setData(cached);
          setIsLive(true);
          return;
        }
      }

      setLoading(true);
      const [statsRes, summaryRes] = await Promise.allSettled([
        fetch(GFG_STATS_API),
        fetch(GFG_SUMMARY_API),
      ]);

      let totalSolved = VERIFIED_GFG_STATS.totalSolved;
      let easy = VERIFIED_GFG_STATS.easy;
      let medium = VERIFIED_GFG_STATS.medium;
      let basicSchool = VERIFIED_GFG_STATS.basicSchool;
      let activeDays = VERIFIED_GFG_STATS.activeDays;

      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        const statsJson = await statsRes.value.json();
        if (statsJson?.data?.totalSolved) {
          totalSolved = statsJson.data.totalSolved;
          easy = statsJson.data.byDifficulty?.easy ?? easy;
          medium = statsJson.data.byDifficulty?.medium ?? medium;
          const basic = statsJson.data.byDifficulty?.basic ?? 0;
          const school = statsJson.data.byDifficulty?.school ?? 0;
          basicSchool = basic + school;
        }
      }

      if (summaryRes.status === 'fulfilled' && summaryRes.value.ok) {
        const summaryJson = await summaryRes.value.json();
        if (summaryJson?.data?.totalActiveDays) {
          activeDays = summaryJson.data.totalActiveDays;
        }
      }

      const normalized = {
        totalSolved,
        easy,
        medium,
        basicSchool,
        activeDays,
      };

      setData(normalized);
      statsCache.set('gfg', normalized);
      setIsLive(true);
    } catch {
      const cached = statsCache.getRaw('gfg');
      setData(cached || VERIFIED_GFG_STATS);
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isNearViewport) return;
    fetchData();
  }, [fetchData, isNearViewport]);

  const {
    totalSolved = 204,
    easy = 83,
    medium = 99,
    basicSchool = 22,
    activeDays = 165,
  } = data || {};

  const easyPercent = totalSolved > 0 ? (easy / totalSolved) * 100 : 0;
  const mediumPercent = totalSolved > 0 ? (medium / totalSolved) * 100 : 0;
  const basicPercent = totalSolved > 0 ? (basicSchool / totalSolved) * 100 : 0;

  return (
    <article ref={cardRef} className={styles.platformCard} aria-label="GeeksforGeeks Profile">
      <div className={styles.cardHeader}>
        <div className={styles.platformMeta}>
          <div className={styles.platformIconWrapper}>
            <SiGeeksforgeeks className={styles.platformIcon} aria-hidden="true" />
          </div>
          <div className={styles.titleLine}>
            <h3 className={styles.platformTitle}>GeeksforGeeks</h3>
            <span className={`${styles.statusBadge} ${isLive ? styles.statusLive : styles.statusCached}`}>
              {isLive ? 'Live' : 'Cached'}
            </span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            onClick={() => fetchData(true)}
            className={styles.syncBtn}
            title="Sync Live Data"
            aria-label="Sync Live Data"
            disabled={loading}
          >
            <FaArrowRotateRight className={`${styles.syncIcon} ${loading ? styles.spinning : ''}`} />
            <span>Sync</span>
          </button>
          <a
            href={GFG_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.profileLink}
          >
            <span>@{GFG_USERNAME}</span>
            <FaArrowUpRightFromSquare className={styles.linkIcon} />
          </a>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Total Solved</span>
          <span className={styles.metricValue}>{totalSolved}</span>
        </div>

        <div className={styles.metricItem}>
          <div className={styles.metricTop}>
            <FaCalendarCheck className={styles.metricIcon} />
            <span className={styles.metricLabel}>Active Days</span>
          </div>
          <span className={styles.metricValue}>{activeDays}</span>
        </div>
      </div>

      {/* Difficulty Distribution Breakdown */}
      <div className={styles.breakdownCard}>
        <div className={styles.breakdownHeader}>
          <span className={styles.breakdownTitle}>Difficulty Distribution</span>
        </div>

        {/* Compound Segmented Progress Bar */}
        <div
          className={styles.segmentedTrack}
          role="progressbar"
          aria-label="GeeksforGeeks solved problems by difficulty"
          aria-valuenow={totalSolved}
          aria-valuemin={0}
          aria-valuemax={Math.max(1, totalSolved)}
        >
          <div
            className={`${styles.segment} ${styles.segmentEasy}`}
            style={{ width: `${easyPercent}%` }}
            title={`Easy: ${easy}`}
          />
          <div
            className={`${styles.segment} ${styles.segmentMedium}`}
            style={{ width: `${mediumPercent}%` }}
            title={`Medium: ${medium}`}
          />
          <div
            className={`${styles.segment} ${styles.segmentBasic}`}
            style={{ width: `${basicPercent}%` }}
            title={`Basic & School: ${basicSchool}`}
          />
        </div>

        {/* Legend / Counts */}
        <div className={styles.legendRow}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotEasy}`} />
            <span className={styles.legendLabel}>Easy</span>
            <span className={styles.legendCount}>{easy}</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotMedium}`} />
            <span className={styles.legendLabel}>Medium</span>
            <span className={styles.legendCount}>{medium}</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotBasic}`} />
            <span className={styles.legendLabel}>Basic</span>
            <span className={styles.legendCount}>{basicSchool}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default GFG;