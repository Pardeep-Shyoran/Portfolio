import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import Button from "../../components/Button/Button";
import certificatesData from "../../data/certificates";
import styles from "./Certificates.module.css";

const VerifiedIcon = () => (
  <svg
    className={styles.verifiedIcon}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 2l2.4 2.1 3.2-.2 1.2 3 2.9 1.4-.7 3.1 1.8 2.6-2 2.5.3 3.2-3.1.9-1.5 2.8L12 22l-2.4 1.4-1.5-2.8-3.1-.9.3-3.2-2-2.5 1.8-2.6-.7-3.1 2.9-1.4 1.2-3 3.2.2L12 2zm-1 14.5l6-6-1.4-1.4-4.6 4.6-2.6-2.6-1.4 1.4 4 4z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    className={styles.linkIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const Certificates = () => {
  const location = useLocation();
  const isStandalonePage = location.pathname === "/certificates";
  const HeadingTag = isStandalonePage ? "h1" : "h2";

  return (
    <>
      {isStandalonePage && (
        <Helmet>
          <title>Certificates & Credentials | Pardeep Shyoran</title>
          <meta
            name="description"
            content="Verified certifications and credentials earned by Pardeep Shyoran in MERN stack development and full-stack engineering."
          />
          <meta
            name="keywords"
            content="Certificates, Pardeep Shyoran, MERN Stack, Full Stack, Credentials"
          />
          <link rel="canonical" href="https://pardeep-shyoran.me/certificates" />
        </Helmet>
      )}

      <section
        id="certificates"
        className={`${styles.certificatesSection} ${isStandalonePage ? styles.standaloneSection : ""}`}
        aria-label="Certificates and Credentials"
      >
        <header className={styles.header}>
          <span className={styles.kicker}>Credentials</span>
          <HeadingTag className={styles.title}>Certifications & Specializations</HeadingTag>
          <p className={styles.subtitle}>
            Verified coursework and professional cohort credentials backing up my full-stack MERN engineering practice.
          </p>
        </header>

        <div className={styles.grid}>
          {certificatesData.map((cert) => (
            <article className={styles.card} key={cert.id || cert.title}>
              <div className={styles.cardMain}>
                <div className={styles.cardMeta}>
                  <div className={styles.issuerRow}>
                    <span className={styles.issuerName}>{cert.issuer}</span>
                    {cert.verified && (
                      <span className={styles.verifiedBadge} title="Verified Credential">
                        <VerifiedIcon />
                        <span>{cert.credentialType || "Verified Credential"}</span>
                      </span>
                    )}
                  </div>
                  <span className={styles.yearBadge}>{cert.year}</span>
                </div>

                <h3 className={styles.certTitle}>{cert.title}</h3>
                <p className={styles.summary}>{cert.summary}</p>

                <div className={styles.skillsRow}>
                  {cert.skills.map((skill) => (
                    <span className={styles.skillTag} key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.idBlock}>
                  <span className={styles.idLabel}>Credential ID</span>
                  <code className={styles.idCode}>{cert.credentialId}</code>
                </div>

                {cert.link && (
                  <Button
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    size="sm"
                    className={styles.verifyBtn}
                  >
                    <span>Verify Credential</span>
                    <ExternalLinkIcon />
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default Certificates;