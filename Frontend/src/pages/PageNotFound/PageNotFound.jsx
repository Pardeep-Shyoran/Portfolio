import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Button from '../../components/Button/Button';
import styles from './PageNotFound.module.css';

const HomeIcon = () => (
  <svg
    className={styles.buttonIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const FolderIcon = () => (
  <svg
    className={styles.buttonIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
  </svg>
);

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Pardeep Shyoran</title>
        <meta name="robots" content="noindex, follow" />
        <meta
          name="description"
          content="The page you are looking for does not exist on Pardeep Shyoran's portfolio."
        />
      </Helmet>

      <section className={styles.notFoundSection} aria-labelledby="error-title">
        <div className={styles.container}>
          <div className={styles.kickerBadge}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span>404 Error</span>
          </div>

          <h1 id="error-title" className={styles.title}>
            Page not found
          </h1>

          <p className={styles.description}>
            The page you are looking for doesn’t exist, has been removed, or the URL might have been mistyped.
          </p>

          <div className={styles.actions}>
            <Button
              onClick={() => navigate('/')}
              variant="primary"
              size="lg"
              className={styles.primaryBtn}
            >
              <HomeIcon />
              <span>Back to Home</span>
            </Button>

            <Button
              onClick={() => navigate('/projects')}
              variant="secondary"
              size="lg"
              className={styles.secondaryBtn}
            >
              <FolderIcon />
              <span>View Projects</span>
            </Button>
          </div>

          <div className={styles.quickLinksBox}>
            <span className={styles.quickLinksLabel}>Or jump directly to:</span>
            <div className={styles.quickLinksRow}>
              <button
                type="button"
                onClick={() => navigate('/about')}
                className={styles.quickLink}
              >
                About Me
              </button>
              <span className={styles.divider} aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => navigate('/certificates')}
                className={styles.quickLink}
              >
                Certificates
              </button>
              <span className={styles.divider} aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => navigate('/stats')}
                className={styles.quickLink}
              >
                Coding Stats
              </button>
              <span className={styles.divider} aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className={styles.quickLink}
              >
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PageNotFound;