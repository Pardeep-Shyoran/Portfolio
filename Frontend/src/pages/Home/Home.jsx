import React, { lazy, Suspense } from "react";
import styles from "./Home.module.css";
import { Helmet } from "react-helmet";
import FeaturedProjects from "../../components/FeaturedProjects/FeaturedProjects";
import Button from "../../components/Button/Button";
import Certificates from "../Certificates/Certificates";
import gsap from "gsap";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

const About = lazy(() => import("../About/About"));
const Contact = lazy(() => import("../Contact/Contact"));
const Stats = lazy(() => import("../Stats/Stats"));

gsap.registerPlugin(ScrollToPlugin);

const ResumeIcon = () => (
  <svg className={styles.buttonIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M7.5 3.75h7.08L18 7.17v10.08A2.75 2.75 0 0 1 15.25 20H7.5A2.75 2.75 0 0 1 4.75 17.25v-10.75A2.75 2.75 0 0 1 7.5 3.75Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M14.58 3.75V7.2h3.42" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 8.25v6.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9.8 12.7 12 14.9l2.2-2.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const TalkIcon = () => (
  <svg className={styles.buttonIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M5 4.75h14A2.25 2.25 0 0 1 21.25 7v6A2.25 2.25 0 0 1 19 15.25h-7.35L8 19v-3.75H5A2.25 2.25 0 0 1 2.75 13V7A2.25 2.25 0 0 1 5 4.75Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M7.5 8.25h9M7.5 11.25h6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const ArrowIcon = () => (
  <svg className={styles.codolioArrowIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="m13 7 6 5-6 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)


const Home = () => {
  const location = useLocation()
  const heroHighlights = ["React + Node", "API design", "Responsive UI"]

  useEffect(() => {
    const targetId = location.state?.scrollTarget

    if (!targetId) return

    const element = document.getElementById(targetId)
    if (!element) return

      const headerOffset = document.querySelector("header")?.offsetHeight ?? 0;
      const offsetY = headerOffset + 16;

      gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: element,
          offsetY,
        },
        ease: "power2.inOut",
      });
  }, [location.state])

  const onLetsTalkClick = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      const stickyHeader = document.querySelector("header");
      const offsetY = (stickyHeader?.offsetHeight ?? 0) + 16;

      gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: contactSection,
          offsetY,
        },
        ease: "power2.inOut",
      });
    }
  };

  const onResumeClick = () => {
    const pdfUrl =
      "https://drive.google.com/file/d/1MZEmMEvYlfCkLt4I3PyEYByxNI6X3QXw/view";
    window.open(pdfUrl, "_blank");
  };

  const codolioProfileUrl = "https://codolio.com/profile/Pardeep_Shyoran/card";
  const codolioLogoUrl = "https://codolio.com/codolio_assets/codolio.svg";

  return (
    <>
      <Helmet>
        <title>Pardeep Shyoran | Full Stack Developer Portfolio</title>
        <meta
          name="description"
          content="Explore Pardeep Shyoran's journey in full stack development—backend architecture, milestone visuals, and branding."
        />
        <meta
          name="keywords"
          content="Pardeep Shyoran, Full Stack Developer, ReactJS, MongoDB, Portfolio, Backend Developer"
        />
      </Helmet>

      <section id="home" className={styles.home}>
        <div className={styles.titleWrap}>
          <div className={styles.title1}>Full Stack</div>
          <div className={styles.title2}>Developer</div>
        </div>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>MERN stack developer · Product-focused · Remote-ready</p>
          <div className={styles.heroTitle}>Hello, I&apos;m Pardeep</div>
          <p className={styles.heroDescription}>
            I build polished web products with dependable backends, responsive interfaces, and a strong focus on
            clarity, speed, and maintainability.
          </p>
          <div className={styles.heroHighlights}>
            {heroHighlights.map((highlight) => (
              <span className={styles.heroHighlight} key={highlight}>
                {highlight}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            onClick={onResumeClick}
            variant="primary"
            size="lg"
            className={styles.resumeButton}
          >
            <ResumeIcon />
            Resume
          </Button>
          <Button
            onClick={onLetsTalkClick}
            variant="primary"
            size="lg"
            className={styles.letsTalkButton}
          >
            <TalkIcon />
            Let's Talk
          </Button>
          <Button
            href={codolioProfileUrl}
            variant="secondary"
            size="lg"
            className={styles.codolioButton}
          >
            <span className={styles.codolioLeft}>
              <span className={styles.codolioIconWrap}>
                <img className={styles.codolioIcon} src={codolioLogoUrl} alt="Codolio logo" />
              </span>
              <span className={styles.codolioTextBlock}>
                <span className={styles.codolioTitle}>View Codolio profile</span>
                <span className={styles.codolioSubtitle}>GFG + LeetCode achievements</span>
              </span>
            </span>
            <ArrowIcon />
          </Button>
        </div>
      </section>
      <Suspense fallback={<div style={{ minHeight: '300px' }} />}>
        <About />
      </Suspense>
      {/* <Projects /> */}
      <FeaturedProjects />
      <Certificates />
      <Suspense fallback={<div style={{ minHeight: '300px' }} />}>
        <Stats />
      </Suspense>
      <Suspense fallback={<div style={{ minHeight: '300px' }} />}>
        <Contact />
      </Suspense>
    </>
  );
};

export default Home;
