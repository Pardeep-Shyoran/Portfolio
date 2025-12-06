import { Helmet } from "react-helmet";
import Button from "../../components/Button/Button";
import certificates from "../../data/certificates";
import styles from "./Certificates.module.css";

const Certificates = () => {
  return (
    <>
      <Helmet>
        <title>Certificates & Achievements | Pardeep Shyoran</title>
        <meta
          name="description"
          content="Verified certifications that back up Pardeep Shyoran's full stack, backend, and cloud expertise."
        />
        <meta
          name="keywords"
          content="Certificates, Achievements, Pardeep Shyoran, AWS, Backend, Full Stack"
        />
      </Helmet>

      <section id="certificates" className={styles.certificatesSection}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Verified credentials</p>
          <h2 className={styles.title}>Certificates & Achievements</h2>
          <p className={styles.subtitle}>
            A curated set of credentials that mirror the stack used across my projects—backend rigor, cloud
            readiness, and production-focused JavaScript.
          </p>
        </div>

        <div className={styles.grid}>
          {certificates.map((cert) => {
            const accent = cert.accentColor || "var(--text-color2)";

            return (
              <article
                className={styles.card}
                key={`${cert.title}-${cert.year}`}
                style={{
                  ["--cert-accent"]: accent,
                  ["--cert-accent-weak"]: `${accent}20`,
                  ["--cert-accent-strong"]: `${accent}40`,
                }}
              >
                <div className={styles.cardLeft}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardHeading}>
                      <p className={styles.issuer}>{cert.issuer}</p>
                      <h3 className={styles.certTitle}>{cert.title}</h3>
                    </div>
                    <span className={styles.yearBadge}>{cert.year}</span>
                  </div>

                  <p className={styles.summary}>{cert.summary}</p>

                  <div className={styles.skillRow}>
                    {cert.skills.map((skill) => (
                      <span className={styles.skillTag} key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.cardRight}>
                  <div className={styles.credentialBlock}>
                    <p className={styles.credentialLabel}>Credential ID</p>
                    <p className={styles.credentialValue}>{cert.credentialId}</p>
                  </div>
                  {cert.link && (
                    <Button href={cert.link} variant="secondary" size="sm" className={styles.linkButton}>
                      View Certificate
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Certificates;