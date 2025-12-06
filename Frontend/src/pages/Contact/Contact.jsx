import styles from "./Contact.module.css";
import { Helmet } from "react-helmet";
import { useEffect, useMemo } from "react";
import Button from "../../components/Button/Button";
import gsap from "gsap";

const Contact = () => {
  useEffect(() => {
    gsap.to(window, { scrollTo: 0, duration: 0.5 });
  }, []);

  const channels = useMemo(
    () => [
      {
        label: "Email",
        value: "pardeepshyoran@outlook.com",
        href: "mailto:pardeepshyoran@outlook.com",
        detail: "Best for briefs, roadmaps, and quick follow-ups",
        icon: (
          <path d="M48 64c-26.5 0-48 21.5-48 48 0 15.1 7.1 29.3 19.2 38.4l208 156c17.1 12.8 40.5 12.8 57.6 0l208-156c12.1-9.1 19.2-23.3 19.2-38.4 0-26.5-21.5-48-48-48L48 64zM0 196L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-188-198.4 148.8c-34.1 25.6-81.1 25.6-115.2 0L0 196z" />
        ),
      },
      {
        label: "LinkedIn",
        value: "linkedin.com/in/pardeepshyoran",
        href: "https://www.linkedin.com/in/pardeepshyoran/",
        detail: "Collaboration chats, async updates, and references",
        icon: (
          <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm5 170.2l66.5 0 0 213.8-66.5 0 0-213.8zm71.7-67.7a38.5 38.5 0 1 1 -77 0 38.5 38.5 0 1 1 77 0zM317.9 416l0-104c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9l0 105.8-66.4 0 0-213.8 63.7 0 0 29.2 .9 0c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9l0 117.2-66.4 0z" />
        ),
      },
      {
        label: "Phone",
        value: "+91 97297 75889",
        href: "tel:+919729775889",
        detail: "IST • Great for quick alignment calls",
        icon: (
          <path d="M160.2 25C152.3 6.1 131.7-3.9 112.1 1.4l-5.5 1.5c-64.6 17.6-119.8 80.2-103.7 156.4 37.1 175 174.8 312.7 349.8 349.8 76.3 16.2 138.8-39.1 156.4-103.7l1.5-5.5c5.4-19.7-4.7-40.3-23.5-48.1l-97.3-40.5c-16.5-6.9-35.6-2.1-47 11.8l-38.6 47.2C233.9 335.4 177.3 277 144.8 205.3L189 169.3c13.9-11.3 18.6-30.4 11.8-47L160.2 25z" />
        ),
      },
    ],
    [],
  );

  const syncItems = useMemo(
    () => [
      "Frontend polish: React, GSAP, and component systems that stay maintainable.",
      "Backend readiness: Express + MongoDB APIs with clear contracts and monitoring hooks.",
      "Project flow: plan → ship in slices → measure → iterate, as used across showcased work.",
      "Collaboration: async-friendly updates, crisp notes, and predictable handoffs.",
    ],
    [],
  );

  const meta = useMemo(
    () => [
      { label: "Response time", value: "Under 24 hours" },
      { label: "Timezone", value: "IST (UTC+5:30)" },
      { label: "Collab modes", value: "Freelance • Fractional • Project-based" },
    ],
    [],
  );

  return (
    <>
      <Helmet>
        <title>Contact | Pardeep Shyoran</title>
        <meta
          name="description"
          content="Start a project, discuss collaboration, or ask about the stack behind recent work."
        />
        <meta
          name="keywords"
          content="Contact Pardeep Shyoran, Developer Collaboration, Freelance Developer, Connect with Pardeep"
        />
      </Helmet>

      <section id="contact" className={styles.contactSection}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Contact</p>
          <h2 className={styles.title}>Let&apos;s build what&apos;s next</h2>
          <p className={styles.subtitle}>
            Tie together the skills, about, and project work you saw—whether it&apos;s a focused feature, a
            full-stack launch, or a collaboration sprint. I keep feedback loops tight and delivery steady.
          </p>
        </div>

        <div className={styles.topGrid}>
          <article className={`${styles.card} ${styles.heroCard}`}>
            <div className={styles.overline}>Available for new work</div>
            <h3 className={styles.heroHeading}>API-first builds with polished frontends.</h3>
            <p className={styles.heroCopy}>
              From the GSAP-powered interactions you saw in Projects to the component discipline outlined in
              About and Skills, I align on outcomes, ship in slices, and document decisions so teams move fast.
            </p>

            <div className={styles.actions}>
              <Button href="mailto:pardeepshyoran@outlook.com" variant="primary" size="lg">
                Email Pardeep
              </Button>
              <Button href="https://www.linkedin.com/in/pardeepshyoran/" variant="secondary" size="lg">
                Connect on LinkedIn
              </Button>
            </div>

            <div className={styles.metaGrid}>
              {meta.map((item) => (
                <div key={item.label} className={styles.metaItem}>
                  <p className={styles.metaLabel}>{item.label}</p>
                  <p className={styles.metaValue}>{item.value}</p>
                </div>
              ))}
            </div>
          </article>

          <article className={`${styles.card} ${styles.contactCard}`}>
            <p className={styles.cardLabel}>Direct channels</p>
            <h3 className={styles.cardTitle}>Pick the fastest line</h3>
            <div className={styles.contactList}>
              {channels.map((channel) => (
                <a
                  key={channel.label}
                  className={styles.contactItem}
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  <div className={styles.contactIconWrap}>
                    <svg className={styles.contactIcon} viewBox="0 0 512 512" aria-hidden="true">
                      {channel.icon}
                    </svg>
                  </div>
                  <div className={styles.contactText}>
                    <span className={styles.contactLabel}>{channel.label}</span>
                    <span className={styles.contactValue}>{channel.value}</span>
                    <span className={styles.contactDetail}>{channel.detail}</span>
                  </div>
                </a>
              ))}
            </div>

            {/* <div className={styles.pillRow}>
              <span className={styles.pill}>MERN</span>
              <span className={styles.pill}>API-first</span>
              <span className={styles.pill}>Performance-aware UI</span>
              <span className={styles.pill}>Async-friendly</span>
            </div> */}
          </article>
        </div>

        <article className={`${styles.card} ${styles.syncCard}`}>
          <p className={styles.cardLabel}>How it aligns</p>
          <h3 className={styles.cardTitle}>Same rigor as Skills, About, and Projects</h3>
          <div className={styles.syncList}>
            {syncItems.map((item) => (
              <div key={item} className={styles.syncItem}>
                <span className={styles.syncBullet} aria-hidden="true">
                  •
                </span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
};

export default Contact;
