import Skills from "../Skills/Skills";
import styles from "./About.module.css";
import { Helmet } from "react-helmet";
import { useEffect, useMemo } from "react";
import gsap from "gsap";

const About = () => {
  useEffect(() => {
    gsap.to(window, { scrollTo: 0, duration: 0.5 });
  }, []);

  const focusAreas = useMemo(
    () => [
      {
        title: "Full-stack delivery",
        copy: "API-first backends with Express/MongoDB, paired with responsive React fronts that stay quick.",
      },
      {
        title: "Product-minded execution",
        copy: "Iterate in thin slices, ship small improvements, measure, and adjust fast.",
      },
      {
        title: "Quality & reliability",
        copy: "Readable code, predictable deploys, and smooth DX so teams extend features confidently.",
      },
    ],
    [],
  );

  const quickFacts = useMemo(
    () => [
      { label: "Primary stack", value: "MongoDB · Express.js · React · Node.js" },
      { label: "Strengths", value: "API-first design, component systems, performance-aware UI" },
      { label: "Collaboration", value: "Pair, async updates, clear handoffs, crisp notes" },
      { label: "Mindset", value: "Curious, delivery-first, motivated by user impact" },
    ],
    [],
  );

  const principles = useMemo(
    () => [
      "Keep feedback loops short—ship, measure, refine.",
      "Build resilient services first, then polish the experience layer.",
      "Document decisions so the team moves faster than memory.",
      "Design for readability—future teammates are the main users of the codebase.",
    ],
    [],
  );

  return (
    <>
      <Helmet>
        <title>About Pardeep Shyoran | Developer & Creator</title>
        <meta
          name="description"
          content="Learn how Pardeep Shyoran approaches full-stack development—pairing MERN fundamentals with product thinking and reliable delivery."
        />
        <meta
          name="keywords"
          content="About Pardeep Shyoran, MERN developer, full stack, product thinking, backend, frontend"
        />
      </Helmet>

      <section id="about" className={styles.aboutSection}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>About</p>
          <h1 className={styles.title}>Pardeep Shyoran</h1>
          <p className={styles.subtitle}>
            MERN stack developer pairing stable backends with refined, user-first interfaces. I like API-driven
            products, close collaboration, and turning complex ideas into reliable experiences.
          </p>
        </div>

        <div className={styles.heroGrid}>
          <article className={styles.introCard}>
            <div className={styles.introCopy}>
              <p className={styles.overline}>MERN Stack Developer</p>
              <h2 className={styles.heroHeading}>Building thoughtful, production-ready web experiences.</h2>
              <p className={styles.body}>
                I design data models, craft APIs, and shape React interfaces that feel polished and intuitive. The
                focus: clarity, performance, and impact—software that reads well and works reliably.
              </p>
              <p className={styles.body}>
                From faster queries to tidy components and clear handoffs, I keep codebases calm and maintainable
                so teams can ship without friction.
              </p>
            </div>

            <div className={styles.tagRow}>
              {["API-first", "Component-driven", "Performance-aware", "Accessible UI"].map((tag) => (
                <span className={styles.tag} key={tag}>
                  {tag}
                </span>
              ))}
            </div>

            <div className={styles.calloutRow}>
              <div className={styles.calloutBox}>
                <p className={styles.calloutLabel}>How I work</p>
                <p className={styles.calloutValue}>Ship in slices, measure impact, iterate with intention.</p>
              </div>
              <div className={styles.calloutBox}>
                <p className={styles.calloutLabel}>Focus right now</p>
                <p className={styles.calloutValue}>Backend robustness, UI polish, and seamless developer experience.</p>
              </div>
            </div>
          </article>
        </div>

        <div className={styles.cardsGrid}>
          <article className={styles.card}>
            <p className={styles.cardLabel}>Focus areas</p>
            <h3 className={styles.cardTitle}>Where I add the most value</h3>
            <div className={styles.listStack}>
              {focusAreas.map((area) => (
                <div className={styles.listItem} key={area.title}>
                  <h4 className={styles.listHeading}>{area.title}</h4>
                  <p className={styles.listCopy}>{area.copy}</p>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.card}>
            <p className={styles.cardLabel}>Quick facts</p>
            <h3 className={styles.cardTitle}>How I approach delivery</h3>
            <dl className={styles.statsList}>
              {quickFacts.map((item) => (
                <div className={styles.statRow} key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </article>

          <article className={styles.card}>
            <p className={styles.cardLabel}>Principles</p>
            <h3 className={styles.cardTitle}>How I like to work with teams</h3>
            <ul className={styles.principlesList}>
              {principles.map((line) => (
                <li key={line} className={styles.principle}>
                  {line}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <Skills />
    </>
  );
};

export default About;
