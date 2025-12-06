import About from "../About/About";
import styles from "./Home.module.css";
// import Projects from "../Projects/Projects";
import Contact from "../Contact/Contact";
import { Helmet } from "react-helmet";
import FeaturedProjects from "../../components/FeaturedProjects/FeaturedProjects";
import Button from "../../components/Button/Button";
import Certificates from "../Certificates/Certificates";

const Home = () => {
  const onLetsTalkClick = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const onResumeClick = () => {
    const pdfUrl =
      "https://drive.google.com/file/d/1MZEmMEvYlfCkLt4I3PyEYByxNI6X3QXw/view";
    window.open(pdfUrl, "_blank");
  };

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
        <div className={styles.title1}>Full Stack</div>
        <div className={styles.title2}>Developer</div>
        {/* Hero content positioned at bottom right */}
        <div className={styles.heroContent}>
          <div className={styles.heroTitle}>Hello, I'm Pardeep 👋</div>
          <p className={styles.heroDescription}>
            A passionate Full Stack Developer crafting seamless web experiences with modern technologies.
          </p>
          {/* <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statLabel}>Projects</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>3+</span>
              <span className={styles.statLabel}>Years Exp</span>
            </div>
          </div> */}
        </div>
        <div className={styles.buttonContainer}>
          <Button
            onClick={onResumeClick}
            variant="primary"
            size="lg"
            className={styles.resumeButton}
          >
            Resume
          </Button>
          <Button
            onClick={onLetsTalkClick}
            variant="primary"
            size="lg"
            className={styles.letsTalkButton}
          >
            Let's Talk
          </Button>
        </div>
      </section>
      <About />
      {/* <Projects /> */}
      <FeaturedProjects />
      <Certificates />
      <Contact />
    </>
  );
};

export default Home;
