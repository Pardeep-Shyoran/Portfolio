import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import styles from './Stats.module.css'
import GitHubCalendar from '../../components/GitHub/GitHub.jsx'
import LeetCode from '../../components/LeetCode/LeetCode.jsx'
import GFG from '../../components/GFG/GFG.jsx'

const Stats = () => {
    const [sectionRef, isVisible] = useIntersectionObserver({ rootMargin: '300px' })

    return (
        <section id="stats" ref={sectionRef} className={styles.stats}>
            {isVisible ? (
                <>
                    <h1 className={styles.title}>GitHub Stats</h1>
                    <GitHubCalendar />

                    <h1 className={styles.title}>LeetCode Stats</h1>
                    <LeetCode />

                    <h1 className={styles.title}>GeeksForGeeks Stats</h1>
                    <GFG />
                </>
            ) : (
                // Subtle, height-matching placeholder to prevent layout shifts
                <div style={{ minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ opacity: 0.15, fontSize: '0.9rem', letterSpacing: '1px' }}>LOADING STATISTICS...</div>
                </div>
            )}
        </section>
    )
}

export default Stats