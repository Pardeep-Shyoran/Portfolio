import { useEffect, useState } from 'react';
import styles from './GitHub.module.css';
import { GitHubCalendar } from 'react-github-calendar';
import { FaGithub, FaFolderOpen, FaUsers, FaUserPlus, FaLocationDot, FaLink, FaArrowRotateRight } from 'react-icons/fa6';
import { statsCache } from '../../utils/statsCache';

const GitHub = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') || 'dark';
    }
    return 'dark';
  });

  const [calendarConfig, setCalendarConfig] = useState({
    blockSize: 13,
    blockMargin: 4,
    fontSize: 14
  });

  // Track window resize to make the GitHub calendar responsive
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setCalendarConfig({
          blockSize: 8,
          blockMargin: 2,
          fontSize: 11
        });
      } else if (width < 768) {
        setCalendarConfig({
          blockSize: 10,
          blockMargin: 3,
          fontSize: 12
        });
      } else {
        setCalendarConfig({
          blockSize: 13,
          blockMargin: 4,
          fontSize: 14
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track global theme changes from the body or html tag
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      setCurrentTheme(theme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  const fetchUserData = async (force = false) => {
    try {
      if (!force) {
        // 1. Try to load valid cache first (instant paint)
        const cached = statsCache.get('github');
        if (cached) {
          setUserData(cached);
          setLoading(false);
          setError(null);
          return;
        }

        // 2. Expired or empty? Try raw cache fallback for immediate display, then sync in background
        const rawCached = statsCache.getRaw('github');
        if (rawCached) {
          setUserData(rawCached);
          setLoading(false);
          setError(null);
          // Trigger silent background sync
          try {
            const response = await fetch('https://api.github.com/users/Pardeep-Shyoran');
            if (response.ok) {
              const freshData = await response.json();
              setUserData(freshData);
              statsCache.set('github', freshData);
            }
          } catch (bgErr) {
            console.warn('Background GitHub sync failed, using cached data:', bgErr);
          }
          return;
        }
      }

      // 3. No cache available or forcing sync
      setLoading(true);
      setError(null);
      const response = await fetch('https://api.github.com/users/Pardeep-Shyoran');
      if (!response.ok) {
        throw new Error('Failed to fetch GitHub profile data');
      }
      const data = await response.json();
      setUserData(data);
      statsCache.set('github', data);
    } catch (err) {
      console.error(err);
      // Fail-safe: try to fall back to whatever cached data we have
      const rawCached = statsCache.getRaw('github');
      if (rawCached) {
        setUserData(rawCached);
        setError(null);
      } else {
        setError(err.message || 'Failed to fetch profile');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch GitHub User Info
  useEffect(() => {
    fetchUserData();
  }, []);

  // Custom theme configurations for the contribution calendar
  const calendarTheme = {
    light: ['#ebedf0', '#ffe4b5', '#ffb84d', '#ff9900', '#cc7a00'],
    dark: ['#161b22', '#3a2d1d', '#614824', '#b87c28', '#ffa116']
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        {/* Profile Card Skeleton */}
        <div className={`${styles.skeletonCard} ${styles.profileSkeleton}`}>
          <div className={styles.skeletonLogo}></div>
          <div className={styles.skeletonInfo}>
            <div className={styles.skeletonLineShort}></div>
            <div className={styles.skeletonLineMedium}></div>
            <div className={styles.skeletonLineLong}></div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className={styles.statsGrid}>
          {[1, 2, 3].map((n) => (
            <div key={n} className={`${styles.skeletonCard} ${styles.statSkeleton}`}>
              <div className={styles.skeletonIcon}></div>
              <div className={styles.skeletonLineShort}></div>
              <div className={styles.skeletonLineMedium}></div>
            </div>
          ))}
        </div>

        {/* Calendar Skeleton */}
        <div className={`${styles.skeletonCard} ${styles.calendarSkeleton}`}>
          <div className={styles.skeletonLineMedium}></div>
          <div className={styles.skeletonCalendarBlocks}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FaGithub className={styles.errorIcon} />
        <h3>Unable to load GitHub Profile</h3>
        <p>{error}</p>
        <button 
          className={styles.retryButton}
          onClick={() => fetchUserData(true)}
        >
          <FaArrowRotateRight className={styles.retryIcon} />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.gitHubContainer}>
      {/* Profile Header Card */}
      {userData && (
        <div className={styles.profileCard}>
          <div className={styles.logoWrapper}>
            <div className={styles.githubLogoBg}>
              <FaGithub className={styles.githubLogo} />
            </div>
            <div className={styles.logoGlow}></div>
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.profileMeta}>
              <h2 className={styles.name}>{userData.name || userData.login}</h2>
              <span className={styles.username}>@{userData.login}</span>
            </div>
            {/* <p className={styles.bio}>{userData.bio || 'MERN Stack Developer | Crafting seamless user experiences'}</p> */}
            
            <div className={styles.detailsList}>
              {userData.location && (
                <div className={styles.detailItem}>
                  <FaLocationDot className={styles.detailIcon} />
                  <span>{userData.location}</span>
                </div>
              )}
              {userData.blog && (
                <div className={styles.detailItem}>
                  <FaLink className={styles.detailIcon} />
                  <a href={userData.blog.startsWith('http') ? userData.blog : `https://${userData.blog}`} target="_blank" rel="noopener noreferrer" className={styles.detailLink}>
                    {userData.blog.replace(/(^\w+:|^)\/\//, '')}
                  </a>
                </div>
              )}
            </div>

            <div className={styles.actionButtons}>
              <a 
                href={userData.html_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.githubLink}
              >
                <FaGithub className={styles.btnIcon} />
                <span>Follow on GitHub</span>
              </a>
              <button 
                onClick={() => fetchUserData(true)} 
                className={styles.syncButton}
                title="Sync Live Stats"
              >
                <FaArrowRotateRight className={styles.syncIcon} />
                <span>Sync Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards Grid */}
      {userData && (
        <div className={styles.statsGrid}>
          {/* Repositories */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <FaFolderOpen className={styles.statIcon} />
              <span className={styles.statTitle}>Public Repositories</span>
            </div>
            <div className={styles.statValue}>{userData.public_repos}</div>
            <p className={styles.statDesc}>Open source projects and repositories</p>
          </div>

          {/* Followers */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <FaUsers className={styles.statIcon} />
              <span className={styles.statTitle}>Followers</span>
            </div>
            <div className={styles.statValue}>{userData.followers}</div>
            <p className={styles.statDesc}>Developers following my work</p>
          </div>

          {/* Following */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <FaUserPlus className={styles.statIcon} />
              <span className={styles.statTitle}>Following</span>
            </div>
            <div className={styles.statValue}>{userData.following}</div>
            <p className={styles.statDesc}>Inspiring developers I follow</p>
          </div>
        </div>
      )}

      {/* Calendar Card */}
      <div className={styles.calendarCard}>
        <div className={styles.calendarHeader}>
          <h3>Contribution Graph</h3>
          <p>My contributions on GitHub over the past year</p>
        </div>
        <div className={styles.calendarWrapper}>
          <GitHubCalendar 
            username="Pardeep-Shyoran" 
            colorScheme={currentTheme}
            theme={calendarTheme}
            blockSize={calendarConfig.blockSize}
            blockMargin={calendarConfig.blockMargin}
            blockRadius={3}
            fontSize={calendarConfig.fontSize}
          />
        </div>
        <p className={styles.mobileScrollTip}>Swipe or scroll horizontally to view full calendar</p>
      </div>
    </div>
  );
};

export default GitHub;