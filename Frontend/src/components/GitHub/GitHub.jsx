import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { statsCache } from '../../utils/statsCache';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import styles from './GitHub.module.css';

const FaGithub = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const FaFolderOpen = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
  </svg>
);

const FaUsers = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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

const LazyGitHubCalendar = lazy(() =>
  import('react-github-calendar').then((m) => ({ default: m.GitHubCalendar }))
);

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
  const [cardRef, isNearViewport] = useIntersectionObserver({ rootMargin: '400px' });
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
    } catch {
      const cached = statsCache.getRaw('github');
      setUserData(cached || VERIFIED_FALLBACK);
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isNearViewport) return;
    fetchUserData();
  }, [fetchUserData, isNearViewport]);

  // Calendar theme aligned with centralized design tokens (Matte Luxury OLED)
  const calendarTheme = {
    light: ['#ebedf0', '#d4d4d8', '#a1a1aa', '#52525b', '#18181b'],
    dark: ['#18181b', '#27272a', '#52525b', '#a1a1aa', '#ffffff'],
  };

  return (
    <article ref={cardRef} className={styles.platformCard} aria-label="GitHub Activity">
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
          {isNearViewport ? (
            <Suspense fallback={<div style={{ minHeight: 132 }} aria-hidden="true" />}>
              <LazyGitHubCalendar
                username={GITHUB_USERNAME}
                colorScheme={currentTheme}
                theme={calendarTheme}
                blockSize={calendarConfig.blockSize}
                blockMargin={calendarConfig.blockMargin}
                blockRadius={3}
                fontSize={calendarConfig.fontSize}
              />
            </Suspense>
          ) : (
            <div style={{ minHeight: 132 }} aria-hidden="true" />
          )}
        </div>
      </div>
    </article>
  );
};

export default GitHub;