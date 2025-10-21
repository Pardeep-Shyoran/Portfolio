import About from "../About/About";
import styles from "./Home.module.css";
import Projects from "../Projects/Projects";
import Contact from "../Contact/Contact";
import { Helmet } from "react-helmet";

const Home = () => {
  const onButtonClick = () => {
    const pdfUrl =
      "https://drive.google.com/file/d/1xanOw0mqgqmVEqKn7VI4I2795ZhmDizT/view";
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
        <img
          className={styles.image}
          src="https://ik.imagekit.io/00zfvrear/Images/man-in-long-shirt-white-pointing-side-with-both-index-fingers-3d-illustration-of-a-smart-businessman-pointing-png.webp?updatedAt=1760714540976"
          alt=""
        />
        <button className={styles.button} onClick={onButtonClick}>
          Resume
        </button>
      </section>
      <About />
      <Projects />
      <Contact />
    </>
  );
};

export default Home;
