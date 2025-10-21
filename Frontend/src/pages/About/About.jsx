import Skills from "../../components/Skills/Skills";
import styles from "./About.module.css";
import { Helmet } from "react-helmet";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Pardeep Shyoran | Developer & Creator</title>
        <meta
          name="description"
          content="Learn more about Pardeep Shyoran—his background, technical skills, creative vision, and passion for impactful development."
        />
        <meta
          name="keywords"
          content="About Pardeep Shyoran, Developer Bio, Full Stack Journey, Tech Background"
        />
      </Helmet>

      <section id="about" className={styles.about}>
        <div className={styles.aboutLeft}>
          <h1 className={styles.title}>About Me</h1>
          <p>
            Hi, I'm <strong>Pardeep Shyoran — a MERN Stack Developer</strong>{" "}
            who thrives at the intersection of logic and creativity. I build
            full-stack web applications using{" "}
            <strong>MongoDB, Express.js, React, and Node.js,</strong> crafting
            seamless user experiences backed by robust backend architecture.
          </p>
          <p>
            For me, development is more than code — it's about designing
            intuitive digital journeys that connect emotionally and function
            effortlessly. Whether I'm optimizing databases or refining
            responsive interfaces, I'm driven by clarity, impact, and the joy of
            bringing ideas to life.
          </p>
        </div>
        <div className={styles.aboutRight}>
          <img
            className={styles.image}
            src="https://ik.imagekit.io/00zfvrear/Images/man-in-long-shirt-white-pointing-side-with-both-index-fingers-3d-illustration-of-a-smart-businessman-pointing-png.webp?updatedAt=1760714540976"
            alt="About Me"
          />
        </div>
      </section>

      <Skills />
    </>
  );
};

export default About;
