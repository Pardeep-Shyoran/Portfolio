import { useEffect, useState } from 'react';
import styles from './GFG.module.css';
import { SiGeeksforgeeks } from 'react-icons/si';
import { FaTrophy, FaFire, FaArrowUpRightFromSquare, FaArrowRotateRight, FaCode, FaCalendarDays } from 'react-icons/fa6';
import { statsCache } from '../../utils/statsCache';

const GFG = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLive, setIsLive] = useState(false);

    const username = 'pardeepsheqqo4';
    const apiEndpoint = `/api/gfg/${username}`;
    const summaryEndpoint = `/api/gfg-summary/${username}`;
    const heatmapEndpoint = `/api/gfg-heatmap/${username}`;
    const cacheKey = 'gfg-v5';
    const profileUrl = `https://www.geeksforgeeks.org/profile/${username}/?tab=activity`;

    // Verified GFG stats for pardeepsheqqo4 as of June 2026
    const fallbackData = {
        userHandle: 'pardeepsheqqo4',
        total_score: 183,
        monthly_score: 88,
        total_problems_solved: 79,
        pod_solved_longest_streak: 9,
        pod_solved_global_longest_streak: 1786,
        pod_solved_current_streak: 6,
        pod_correct_submissions_count: 27,
        School: 0,
        Basic: 14,
        Easy: 45,
        Medium: 20,
        Hard: 0,
        ProgressBar: 1.58
    };

    const fetchData = async (force = false) => {
        try {
            if (!force) {
                // 1. Try to load valid cache first (instant paint)
                const cached = statsCache.get(cacheKey);
                if (cached) {
                    setData(cached);
                    setIsLive(true);
                    setLoading(false);
                    return;
                }

                // 2. Expired or empty? Try raw cache fallback and sync in background
                const rawCached = statsCache.getRaw(cacheKey);
                if (rawCached) {
                    setData(rawCached);
                    setIsLive(true);
                    setLoading(false);
                    // Background sync
                    try {
                        const [response, summaryResponse, heatmapResponse] = await Promise.all([
                            fetch(apiEndpoint),
                            fetch(summaryEndpoint),
                            fetch(heatmapEndpoint)
                        ]);
                        if (response.ok && summaryResponse.ok && heatmapResponse.ok) {
                            const result = await response.json();
                            const summary = await summaryResponse.json();
                            const heatmap = await heatmapResponse.json();
                            const stats = normalizeStats(result, summary, heatmap);
                            if (stats) {
                                setData(stats);
                                statsCache.set(cacheKey, stats);
                            }
                        }
                    } catch (bgErr) {
                        console.warn('Background GFG sync failed, using cached data:', bgErr);
                    }
                    return;
                }
            }

            // 3. No cache or forced sync
            setLoading(true);
            const [response, summaryResponse, heatmapResponse] = await Promise.all([
                fetch(apiEndpoint),
                fetch(summaryEndpoint),
                fetch(heatmapEndpoint)
            ]);
            if (!response.ok || !summaryResponse.ok || !heatmapResponse.ok) {
                throw new Error('API response failed');
            }
            const result = await response.json();
            const summary = await summaryResponse.json();
            const heatmap = await heatmapResponse.json();
            const stats = normalizeStats(result, summary, heatmap);

            // Validate response has key statistics
            if (!stats) {
                throw new Error('Invalid stats data structure');
            }

            setData(stats);
            statsCache.set(cacheKey, stats);
            setIsLive(true);
        } catch (err) {
            console.warn('GFG live fetch error, falling back to cached portfolio stats:', err);
            // Gracefully fall back to local/cached data
            const rawCached = statsCache.getRaw(cacheKey);
            if (rawCached) {
                setData(rawCached);
                setIsLive(true);
            } else {
                setData(fallbackData);
                setIsLive(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const normalizeStats = (result, summaryResult, heatmapResult) => {
        const stats = result?.data;
        const summary = summaryResult?.data;
        const heatmap = heatmapResult?.data;
        if (!stats || typeof stats.totalSolved !== 'number') return null;

        const byDifficulty = stats.byDifficulty || {};
        return {
            total_problems_solved: stats.totalSolved,
            School: byDifficulty.school || 0,
            Basic: byDifficulty.basic || 0,
            Easy: byDifficulty.easy || 0,
            Medium: byDifficulty.medium || 0,
            Hard: byDifficulty.hard || 0,
            total_active_days: summary?.totalActiveDays || 0,
            total_contests: summary?.totalContests || 0,
            current_streak: heatmap?.currentStreak || 0,
            longest_streak: heatmap?.longestStreak || 0,
            max_daily_submissions: heatmap?.maxDailySubmissions || 0
        };
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className={styles.progressBarSkeletonItem}>
                                <div className={styles.skeletonLineShort}></div>
                                <div className={styles.skeletonBar}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    // Destructure stats from data
    const {
        total_problems_solved = 0,
        total_active_days = 0,
        total_contests = 0,
        current_streak = 0,
        longest_streak = 0,
        max_daily_submissions = 0,
        School = 0,
        Basic = 0,
        Easy = 0,
        Medium = 0,
        Hard = 0
    } = data;

    // We combine School + Basic for a clean difficulty list or show Basic/School
    const basicSchoolCount = School + Basic;

    // Setting a personal milestone goal for total problems solved
    const targetMilestone = 150;
    const overallPercentage = ((total_problems_solved / targetMilestone) * 100).toFixed(1);

    // SVG Circular Progress configuration
    const radius = 65;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const fillPercentage = Math.min(100, parseFloat(overallPercentage));
    const strokeDashoffset = circumference - (fillPercentage / 100) * circumference;

    // Difficulties percentage calculations for the progress bars
    const basicPercentage = Math.min(100, basicSchoolCount > 0 ? (basicSchoolCount / targetMilestone) * 100 : 0).toFixed(1);
    const easyPercentage = Math.min(100, Easy > 0 ? (Easy / targetMilestone) * 100 : 0).toFixed(1);
    const mediumPercentage = Math.min(100, Medium > 0 ? (Medium / targetMilestone) * 100 : 0).toFixed(1);
    const hardPercentage = Math.min(100, Hard > 0 ? (Hard / targetMilestone) * 100 : 0).toFixed(1);
    return (
        <div className={styles.gfgContainer}>
            {/* Profile Info Header */}
            <div className={styles.profileCard}>
                <div className={styles.logoWrapper}>
                    <div className={styles.gfgLogoBg}>
                        <SiGeeksforgeeks className={styles.gfgLogo} />
                    </div>
                    <div className={styles.logoGlow}></div>
                </div>
                <div className={styles.profileInfo}>
                    <div className={styles.profileMeta}>
                        <div className={styles.metaLeft}>
                            <h2 className={styles.name}>Pardeep Shyoran</h2>
                            <span className={styles.username}>@{username}</span>
                        </div>
                        <div className={`${styles.statusBadge} ${isLive ? styles.statusLive : styles.statusOffline}`}>
                            <span className={styles.statusIndicator}></span>
                            <span>{isLive ? 'Live Connection' : 'Cached Stats'}</span>
                        </div>
                    </div>
                    <div className={styles.statsBadges}>
                        <div className={styles.badgeItem}>
                            <FaCode className={styles.badgeIcon} />
                            <div className={styles.badgeText}>
                                <span className={styles.badgeLabel}>Problems Solved</span>
                                <span className={styles.badgeVal}>{total_problems_solved}</span>
                            </div>
                        </div>
                            <div className={styles.badgeItem}>
                                <FaTrophy className={styles.badgeIcon} />
                                <div className={styles.badgeText}>
                                    <span className={styles.badgeLabel}>Active Days</span>
                                    <span className={styles.badgeVal}>{total_active_days}</span>
                                </div>
                            </div>
                        <div className={styles.badgeItem}>
                            <FaFire className={styles.badgeIcon} style={{ color: '#ff6a00' }} />
                            <div className={styles.badgeText}>
                                <span className={styles.badgeLabel}>Total Contests</span>
                                <span className={styles.badgeVal}>{total_contests}</span>
                            </div>
                        </div>
                    </div>
                    <a href={profileUrl} target="_blank" rel="noopener noreferrer" className={styles.gfgLink}>
                        <span>Visit GeeksForGeeks Profile</span>
                        <FaArrowUpRightFromSquare className={styles.btnIcon} />
                    </a>
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
                            <span className={styles.solvedCount}>{total_problems_solved}</span>
                            <span className={styles.solvedLabel}>Solved</span>
                            <span className={styles.totalCount}>/ {targetMilestone} Target</span>
                        </div>
                    </div>
                    <div className={styles.solvedPercentageText}>
                        Milestone Progress: <strong>{overallPercentage}%</strong> toward target of {targetMilestone} solved questions
                    </div>
                </div>

                {/* Right: Difficulties Breakdown Progress Bars */}
                <div className={styles.progressBarsCard}>
                    <h3 className={styles.cardTitle}>Difficulty Breakdown</h3>
                    <div className={styles.difficultyList}>
                        {/* Basic & School Row */}
                        <div className={styles.difficultyRow} style={{ '--diff-color': '#00b8a3' }}>
                            <div className={styles.rowHeader}>
                                <span className={styles.diffName}>Basic & School</span>
                                <span className={styles.rowStats}>
                                    <strong>{basicSchoolCount}</strong> solved
                                </span>
                            </div>
                            <div className={styles.barTrack}>
                                <div
                                    className={styles.barFill}
                                    style={{ width: `${basicPercentage}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Easy Row */}
                        <div className={styles.difficultyRow} style={{ '--diff-color': '#34a853' }}>
                            <div className={styles.rowHeader}>
                                <span className={styles.diffName}>Easy</span>
                                <span className={styles.rowStats}>
                                    <strong>{Easy}</strong> solved
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
                                    <strong>{Medium}</strong> solved
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
                                    <strong>{Hard}</strong> solved
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

            {/* Streaks & Consistency metrics card */}
            <div className={styles.streaksCard}>
                <h3 className={styles.cardTitle}>Streaks & Consistency</h3>
                <div className={styles.streaksGrid}>
                    <div className={styles.streakItem}>
                        <div className={styles.streakIconWrapper}>
                            <FaFire />
                        </div>
                        <div className={styles.streakInfo}>
                            <span className={styles.streakVal}>{current_streak} Days</span>
                            <span className={styles.streakLabel}>Current Streak</span>
                        </div>
                    </div>
                    <div className={styles.streakItem}>
                        <div className={styles.streakIconWrapper} style={{ color: '#d9a711', background: 'rgba(217, 167, 17, 0.08)' }}>
                            <FaTrophy />
                        </div>
                        <div className={styles.streakInfo}>
                            <span className={styles.streakVal}>{longest_streak} Days</span>
                            <span className={styles.streakLabel}>Longest Streak</span>
                        </div>
                    </div>
                    <div className={styles.streakItem}>
                        <div className={styles.streakIconWrapper} style={{ color: '#4285f4', background: 'rgba(66, 133, 244, 0.08)' }}>
                            <FaCalendarDays />
                        </div>
                        <div className={styles.streakInfo}>
                            <span className={styles.streakVal}>{max_daily_submissions}</span>
                            <span className={styles.streakLabel}>Peak Daily Submissions</span>
                        </div>
                    </div>
                    <div className={styles.streakItem}>
                        <div className={styles.streakIconWrapper} style={{ color: '#a73df5', background: 'rgba(167, 61, 245, 0.08)' }}>
                            <FaArrowRotateRight className={styles.retryIcon} onClick={() => fetchData(true)} style={{ cursor: 'pointer' }} />
                        </div>
                        <div className={styles.streakInfo}>
                            <span className={styles.streakVal} style={{ fontSize: '1rem', fontWeight: 600 }}>Sync Stats</span>
                            <span className={styles.streakLabel}>Click to Refresh Live</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GFG;