import { useEffect, useState, useCallback } from 'react';
import { SiLeetcode } from 'react-icons/si';
import { FaTrophy, FaArrowUpRightFromSquare, FaArrowRotateRight } from 'react-icons/fa6';
import { statsCache } from '../../utils/statsCache';
import styles from './LeetCode.module.css';

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
    } catch (err) {
      console.warn('LeetCode live fetch warning, using verified snapshot:', err);
      const cached = statsCache.getRaw('leetcode');
      setData(cached || VERIFIED_FALLBACK);
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    <article className={styles.platformCard} aria-label="LeetCode Profile">
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
        <div className={styles.segmentedTrack} role="progressbar" aria-valuenow={totalSolved} aria-valuemin={0} aria-valuemax={totalSolved}>
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