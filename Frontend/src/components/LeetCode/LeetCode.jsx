import { useEffect, useState, useCallback } from 'react';
import { statsCache } from '../../utils/statsCache';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import styles from './LeetCode.module.css';

const SiLeetcode = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
  </svg>
);

const FaTrophy = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
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

const LEETCODE_USERNAME = 'Pardeep_Shyoran';
const LEETCODE_PROFILE_URL = `https://leetcode.com/u/${LEETCODE_USERNAME}/`;
const LEETCODE_API_ENDPOINT = `https://leetcode-api-faisalshohag.vercel.app/${LEETCODE_USERNAME}`;

// Verified accurate snapshot based on LeetCode profile
const VERIFIED_FALLBACK = {
  totalSolved: 196,
  totalQuestions: 3972,
  easySolved: 83,
  totalEasy: 870,
  mediumSolved: 109,
  totalMedium: 1840,
  hardSolved: 4,
  totalHard: 820,
  ranking: 892928,
  contributionPoint: 196,
};

const LeetCode = () => {
  const [cardRef, isNearViewport] = useIntersectionObserver({ rootMargin: '400px' });
  const [data, setData] = useState(() => statsCache.getRaw('leetcode') || VERIFIED_FALLBACK);
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(true);

  const fetchData = useCallback(async (force = false) => {
    try {
      if (!force) {
        const cached = statsCache.get('leetcode');
        if (cached) {
          setData(cached);
          setIsLive(true);
          return;
        }
      }

      setLoading(true);
      const res = await fetch(LEETCODE_API_ENDPOINT);
      if (!res.ok) {
        throw new Error(`LeetCode proxy returned ${res.status}`);
      }
      const result = await res.json();
      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message || 'User not found');
      }

      if (typeof result.totalSolved === 'number') {
        setData(result);
        statsCache.set('leetcode', result);
        setIsLive(true);
      } else {
        throw new Error('Incomplete data received');
      }
    } catch {
      const cached = statsCache.getRaw('leetcode');
      setData(cached || VERIFIED_FALLBACK);
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
    totalSolved = 196,
    easySolved = 83,
    mediumSolved = 109,
    hardSolved = 4,
    ranking = 892928,
  } = data || {};

  const easyPercent = totalSolved > 0 ? (easySolved / totalSolved) * 100 : 0;
  const mediumPercent = totalSolved > 0 ? (mediumSolved / totalSolved) * 100 : 0;
  const hardPercent = totalSolved > 0 ? (hardSolved / totalSolved) * 100 : 0;

  return (
    <article ref={cardRef} className={styles.platformCard} aria-label="LeetCode Profile">
      <div className={styles.cardHeader}>
        <div className={styles.platformMeta}>
          <div className={styles.platformIconWrapper}>
            <SiLeetcode className={styles.platformIcon} aria-hidden="true" />
          </div>
          <div className={styles.titleLine}>
            <h3 className={styles.platformTitle}>LeetCode</h3>
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
            href={LEETCODE_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.profileLink}
          >
            <span>@{LEETCODE_USERNAME}</span>
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
            <FaTrophy className={styles.metricIcon} />
            <span className={styles.metricLabel}>Global Rank</span>
          </div>
          <span className={styles.metricValue}>~{Math.round(ranking / 1000)}k</span>
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
          aria-label="LeetCode solved problems by difficulty"
          aria-valuenow={totalSolved}
          aria-valuemin={0}
          aria-valuemax={Math.max(1, totalSolved)}
        >
          <div
            className={`${styles.segment} ${styles.segmentEasy}`}
            style={{ width: `${easyPercent}%` }}
            title={`Easy: ${easySolved}`}
          />
          <div
            className={`${styles.segment} ${styles.segmentMedium}`}
            style={{ width: `${mediumPercent}%` }}
            title={`Medium: ${mediumSolved}`}
          />
          <div
            className={`${styles.segment} ${styles.segmentHard}`}
            style={{ width: `${hardPercent}%` }}
            title={`Hard: ${hardSolved}`}
          />
        </div>

        {/* Legend / Counts */}
        <div className={styles.legendRow}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotEasy}`} />
            <span className={styles.legendLabel}>Easy</span>
            <span className={styles.legendCount}>{easySolved}</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotMedium}`} />
            <span className={styles.legendLabel}>Medium</span>
            <span className={styles.legendCount}>{mediumSolved}</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotHard}`} />
            <span className={styles.legendLabel}>Hard</span>
            <span className={styles.legendCount}>{hardSolved}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default LeetCode;