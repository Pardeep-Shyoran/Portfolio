import { useEffect, useState, useCallback } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { FaGithub, FaFolderOpen, FaUsers, FaArrowUpRightFromSquare, FaArrowRotateRight } from 'react-icons/fa6';
import { statsCache } from '../../utils/statsCache';
import styles from './GitHub.module.css';

const GITHUB_USERNAME = 'Pardeep-Shyoran';
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

// Verified fallback snapshot in case GitHub API rate limits unauthenticated requests
const VERIFIED_FALLBACK = {
  login: GITHUB_USERNAME,
  name: 'Pardeep Shyoran',
  public_repos: 41,
  followers: 17,
  following: 17,
  location: 'Haryana, India',
  html_url: GITHUB_PROFILE_URL,
};

const GitHub = () => {
  const [userData, setUserData] = useState(() => statsCache.getRaw('github') || VERIFIED_FALLBACK);
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') || 'dark';
    }
    return 'dark';
  });

  const [calendarConfig, setCalendarConfig] = useState({
    blockSize: 12,
    blockMargin: 4,
    fontSize: 13,
  });

  // Responsive calendar sizing
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setCalendarConfig({ blockSize: 8, blockMargin: 2, fontSize: 11 });
      } else if (width < 768) {
        setCalendarConfig({ blockSize: 10, blockMargin: 3, fontSize: 12 });
      } else {
        setCalendarConfig({ blockSize: 12, blockMargin: 4, fontSize: 13 });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync with global data-theme changes
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      setCurrentTheme(theme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const fetchUserData = useCallback(async (force = false) => {
    try {
      if (!force) {
        const cached = statsCache.get('github');
        if (cached) {
          setUserData(cached);
          setIsLive(true);
          return;
        }
      }

      setLoading(true);
      const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
      if (!res.ok) {
        throw new Error(`GitHub API status ${res.status}`);
      }
      const data = await res.json();
      setUserData(data);
      statsCache.set('github', data);
      setIsLive(true);
    } catch (err) {
      console.warn('GitHub live fetch error, using verified cache:', err);
      const cached = statsCache.getRaw('github');
      setUserData(cached || VERIFIED_FALLBACK);
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Calendar theme aligned with centralized design tokens (Matte Luxury OLED)
  const calendarTheme = {
    light: ['#ebedf0', '#d4d4d8', '#a1a1aa', '#52525b', '#18181b'],
    dark: ['#18181b', '#27272a', '#52525b', '#a1a1aa', '#ffffff'],
  };

  return (
    <article className={styles.platformCard} aria-label="GitHub Activity">
      <div className={styles.cardHeader}>
        <div className={styles.platformMeta}>
          <div className={styles.platformIconWrapper}>
            <FaGithub className={styles.platformIcon} aria-hidden="true" />
          </div>
          <div className={styles.titleLine}>
            <h3 className={styles.platformTitle}>GitHub</h3>
            <span className={`${styles.statusBadge} ${isLive ? styles.statusLive : styles.statusCached}`}>
              {isLive ? 'Live' : 'Cached'}
            </span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            onClick={() => fetchUserData(true)}
            className={styles.syncBtn}
            title="Sync Live Data"
            aria-label="Sync Live Data"
            disabled={loading}
          >
            <FaArrowRotateRight className={`${styles.syncIcon} ${loading ? styles.spinning : ''}`} />
            <span>Sync</span>
          </button>
          <a
            href={userData?.html_url || GITHUB_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.profileLink}
          >
            <span>@{userData?.login || GITHUB_USERNAME}</span>
            <FaArrowUpRightFromSquare className={styles.linkIcon} />
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricItem}>
          <div className={styles.metricTop}>
            <FaFolderOpen className={styles.metricIcon} />
            <span className={styles.metricLabel}>Repositories</span>
          </div>
          <span className={styles.metricValue}>{userData?.public_repos ?? 41}</span>
        </div>

        <div className={styles.metricItem}>
          <div className={styles.metricTop}>
            <FaUsers className={styles.metricIcon} />
            <span className={styles.metricLabel}>Followers</span>
          </div>
          <span className={styles.metricValue}>{userData?.followers ?? 17}</span>
        </div>

        <div className={styles.metricItem}>
          <div className={styles.metricTop}>
            <FaUsers className={styles.metricIcon} />
            <span className={styles.metricLabel}>Following</span>
          </div>
          <span className={styles.metricValue}>{userData?.following ?? 17}</span>
        </div>
      </div>

      {/* Contribution Calendar */}
      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeader}>
          <span className={styles.calendarTitle}>Contributions</span>
        </div>
        <div className={styles.calendarWrapper}>
          <GitHubCalendar
            username={GITHUB_USERNAME}
            colorScheme={currentTheme}
            theme={calendarTheme}
            blockSize={calendarConfig.blockSize}
            blockMargin={calendarConfig.blockMargin}
            blockRadius={3}
            fontSize={calendarConfig.fontSize}
          />
        </div>
      </div>
    </article>
  );
};

export default GitHub;