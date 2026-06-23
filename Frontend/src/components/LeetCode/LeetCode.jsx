import { useEffect, useState } from 'react';
import styles from './LeetCode.module.css';
import { SiLeetcode } from 'react-icons/si';
import { FaTrophy, FaFire, FaArrowUpRightFromSquare, FaArrowRotateRight } from 'react-icons/fa6';
import { ActivityCalendar } from 'react-activity-calendar';
import { statsCache } from '../../utils/statsCache';

const LeetCode = () => {
    const [data, setData] = useState(null);
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

    const username = 'Pardeep_Shyoran';
    const apiEndpoint = `https://leetcode-api-faisalshohag.vercel.app/${username}`;
    const profileUrl = `https://leetcode.com/u/${username}/`;

    // Track window resize to make the calendar responsive
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

    // Track global theme changes
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

    const fetchData = async (force = false) => {
        try {
            if (!force) {
                // 1. Try to load valid cache first (instant paint)
                const cached = statsCache.get('leetcode');
                if (cached) {
                    setData(cached);
                    setLoading(false);
                    setError(null);
                    return;
                }

                // 2. Expired or empty? Try raw cache fallback and sync in background
                const rawCached = statsCache.getRaw('leetcode');
                if (rawCached) {
                    setData(rawCached);
                    setLoading(false);
                    setError(null);
                    // Background sync
                    try {
                        const response = await fetch(apiEndpoint);
                        if (response.ok) {
                            const result = await response.json();
                            if (!result.errors || result.errors.length === 0) {
                                setData(result);
                                statsCache.set('leetcode', result);
                            }
                        }
                    } catch (bgErr) {
                        console.warn('Background LeetCode sync failed, using cached data:', bgErr);
                    }
                    return;
                }
            }

            // 3. No cache or forced sync
            setLoading(true);
            setError(null);
            const response = await fetch(apiEndpoint);
            if (!response.ok) {
                throw new Error('Failed to fetch LeetCode statistics');
            }
            const result = await response.json();

            // Check if user exists or API returned error message
            if (result.errors && result.errors.length > 0) {
                throw new Error(result.errors[0].message || 'User not found');
            }

            setData(result);
            statsCache.set('leetcode', result);
        } catch (err) {
            console.error('LeetCode fetch error:', err);
            // Fail-safe
            const rawCached = statsCache.getRaw('leetcode');
            if (rawCached) {
                setData(rawCached);
                setError(null);
            } else {
                setError(err.message || 'Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Helper to generate 365 days of activity data from LeetCode submissionCalendar
    const parseSubmissionCalendar = (submissionCalendar) => {
        const submissionMap = {};
        if (submissionCalendar) {
            Object.entries(submissionCalendar).forEach(([timestampStr, count]) => {
                const timestamp = parseInt(timestampStr, 10);
                const date = new Date(timestamp * 1000);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const dateKey = `${year}-${month}-${day}`;
                submissionMap[dateKey] = (submissionMap[dateKey] || 0) + count;
            });
        }

        const calendarData = [];
        const today = new Date();

        for (let i = 364; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            const count = submissionMap[dateStr] || 0;
            let level = 0;
            if (count > 0) {
                if (count <= 2) level = 1;
                else if (count <= 4) level = 2;
                else if (count <= 7) level = 3;
                else level = 4;
            }

            calendarData.push({
                date: dateStr,
                count,
                level
            });
        }

        return calendarData;
    };

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
                    </div>
                </div>

                {/* Stats Content Skeleton */}
                <div className={styles.statsLayoutSkeleton}>
                    <div className={`${styles.skeletonCard} ${styles.circleSkeletonCard}`}>
                        <div className={styles.skeletonCircle}></div>
                        <div className={styles.skeletonLineShort} style={{ margin: '1rem auto 0' }}></div>
                    </div>
                    <div className={styles.progressBarsSkeleton}>
                        {[1, 2, 3].map((n) => (
                            <div key={n} className={styles.progressBarSkeletonItem}>
                                <div className={styles.skeletonLineShort}></div>
                                <div className={styles.skeletonBar}></div>
                            </div>
                        ))}
                    </div>
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
                <SiLeetcode className={styles.errorIcon} />
                <h3>Unable to Load LeetCode Stats</h3>
                <p className={styles.errorMsg}>{error}</p>
                <p className={styles.errorHint}>This could be due to LeetCode API rate-limiting. Please try again later.</p>
                <button className={styles.retryButton} onClick={() => fetchData(true)}>
                    <FaArrowRotateRight className={styles.retryIcon} />
                    <span>Retry</span>
                </button>
            </div>
        );
    }

    if (!data) return null;

    // Destructure needed values
    const {
        totalSolved = 0,
        totalQuestions = 3972,
        easySolved = 0,
        totalEasy = 0,
        mediumSolved = 0,
        totalMedium = 0,
        hardSolved = 0,
        totalHard = 0,
        ranking = 0,
        contributionPoint = 0,
        submissionCalendar = {}
    } = data;

    // Calculate percentages
    const overallPercentage = ((totalSolved / totalQuestions) * 100).toFixed(1);
    const easyPercentage = totalEasy > 0 ? ((easySolved / totalEasy) * 100).toFixed(1) : 0;
    const mediumPercentage = totalMedium > 0 ? ((mediumSolved / totalMedium) * 100).toFixed(1) : 0;
    const hardPercentage = totalHard > 0 ? ((hardSolved / totalHard) * 100).toFixed(1) : 0;

    // SVG Circular Progress config
    const radius = 65;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const fillPercentage = totalSolved > 0 ? Math.max(1.5, parseFloat(overallPercentage)) : 0;
    const strokeDashoffset = circumference - (fillPercentage / 100) * circumference;

    // Process the submission calendar data
    const processedCalendarData = parseSubmissionCalendar(submissionCalendar);

    return (
        <div className={styles.leetCodeContainer}>
            {/* Profile Info Header */}
            <div className={styles.profileCard}>
                <div className={styles.logoWrapper}>
                    <div className={styles.leetcodeLogoBg}>
                        <SiLeetcode className={styles.leetcodeLogo} />
                    </div>
                    <div className={styles.logoGlow}></div>
                </div>
                <div className={styles.profileInfo}>
                    <div className={styles.profileMeta}>
                        <h2 className={styles.name}>Pardeep Shyoran</h2>
                        <span className={styles.username}>@{username}</span>
                    </div>
                    <div className={styles.statsBadges}>
                        <div className={styles.badgeItem}>
                            <FaTrophy className={styles.badgeIcon} />
                            <div className={styles.badgeText}>
                                <span className={styles.badgeLabel}>Global Rank</span>
                                <span className={styles.badgeVal}>{ranking.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className={styles.badgeItem}>
                            <FaFire className={styles.badgeIcon} style={{ color: '#ff6a00' }} />
                            <div className={styles.badgeText}>
                                <span className={styles.badgeLabel}>XP / Points</span>
                                <span className={styles.badgeVal}>{contributionPoint}</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.actionButtons}>
                        <a href={profileUrl} target="_blank" rel="noopener noreferrer" className={styles.leetcodeLink}>
                            <span>Visit LeetCode Profile</span>
                            <FaArrowUpRightFromSquare className={styles.btnIcon} />
                        </a>
                        <button 
                            onClick={() => fetchData(true)} 
                            className={styles.syncButton}
                            title="Sync Live Stats"
                        >
                            <FaArrowRotateRight className={styles.syncIcon} />
                            <span>Sync Profile</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Stats Layout */}
            <div className={styles.statsLayout}>
                {/* Left: Overall Solved Circular Card */}
                <div className={styles.circleCard}>
                    <div className={styles.circleWrapper}>
                        <svg className={styles.progressSvg} width="160" height="160">
                            <circle
                                className={styles.circleTrack}
                                cx="80"
                                cy="80"
                                r={radius}
                                strokeWidth={strokeWidth}
                            />
                            <circle
                                className={styles.circleProgress}
                                cx="80"
                                cy="80"
                                r={radius}
                                strokeWidth={strokeWidth}
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                transform="rotate(-90 80 80)"
                            />
                        </svg>
                        <div className={styles.circleContent}>
                            <span className={styles.solvedCount}>{totalSolved}</span>
                            <span className={styles.solvedLabel}>Solved</span>
                            <span className={styles.totalCount}>/ {totalQuestions}</span>
                        </div>
                    </div>
                    <div className={styles.solvedPercentageText}>
                        Progress: <strong>{overallPercentage}%</strong> of total LeetCode catalog
                    </div>
                </div>

                {/* Right: Difficulties Breakdown Progress Bars */}
                <div className={styles.progressBarsCard}>
                    <h3 className={styles.cardTitle}>Difficulty Breakdown</h3>
                    <div className={styles.difficultyList}>
                        {/* Easy Row */}
                        <div className={styles.difficultyRow} style={{ '--diff-color': '#00b8a3' }}>
                            <div className={styles.rowHeader}>
                                <span className={styles.diffName}>Easy</span>
                                <span className={styles.rowStats}>
                                    <strong>{easySolved}</strong> <span className={styles.divider}>/</span> {totalEasy}
                                </span>
                            </div>
                            <div className={styles.barTrack}>
                                <div
                                    className={styles.barFill}
                                    style={{ width: `${easyPercentage}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Medium Row */}
                        <div className={styles.difficultyRow} style={{ '--diff-color': '#ffc01e' }}>
                            <div className={styles.rowHeader}>
                                <span className={styles.diffName}>Medium</span>
                                <span className={styles.rowStats}>
                                    <strong>{mediumSolved}</strong> <span className={styles.divider}>/</span> {totalMedium}
                                </span>
                            </div>
                            <div className={styles.barTrack}>
                                <div
                                    className={styles.barFill}
                                    style={{ width: `${mediumPercentage}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Hard Row */}
                        <div className={styles.difficultyRow} style={{ '--diff-color': '#ef4743' }}>
                            <div className={styles.rowHeader}>
                                <span className={styles.diffName}>Hard</span>
                                <span className={styles.rowStats}>
                                    <strong>{hardSolved}</strong> <span className={styles.divider}>/</span> {totalHard}
                                </span>
                            </div>
                            <div className={styles.barTrack}>
                                <div
                                    className={styles.barFill}
                                    style={{ width: `${hardPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submission Calendar Card */}
            <div className={styles.calendarCard}>
                <div className={styles.calendarHeader}>
                    <h3>Submission Activity</h3>
                    <p>My problem solving submissions on LeetCode over the past year</p>
                </div>
                <div className={styles.calendarWrapper}>
                    <ActivityCalendar
                        data={processedCalendarData}
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

export default LeetCode;