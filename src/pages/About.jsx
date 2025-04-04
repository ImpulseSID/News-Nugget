import React from "react";
import styles from "./About.module.css";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logoLink}>
            <h1 className={styles.logo}>News Nugget</h1>
            <p className={styles.tagline}>Your daily dose of curated news</p>
          </Link>
        </div>
      </header>

      <main className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>About the App</h2>
          <p className={styles.text}>
            News Nugget is a modern news aggregator designed to bring you the
            latest headlines from around the world in a clean, user-friendly
            format. It features category-based filtering, keyword search, and a
            powerful AI summarizer that gives you the essence of each news
            article in seconds. Whether you're short on time or looking to
            explore headlines by topic, News Nugget delivers curated content
            fast and smart.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>About the Developer</h2>
          <p className={styles.text}>
            Hi! I'm the developer behind News Nugget — a tech enthusiast with a
            passion for building intuitive and impactful web applications. I
            enjoy working on full-stack projects, experimenting with new
            technologies, and solving real-world problems through code.
          </p>
          <p className={styles.text}>
            Connect with me on{" "}
            <a
              href="https://www.linkedin.com/in/sidharthprads/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              LinkedIn
            </a>{" "}
            and{" "}
            <a
              href="https://github.com/ImpulseSID"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              GitHub
            </a>
            .
          </p>
        </section>

        <div className={styles.backButtonContainer}>
          <Link to="/" className={styles.backButton}>
            Back to News
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>News Nugget</h3>
            <p>
              Your trusted source for the latest news across the globe. We
              aggregate content from reliable sources to deliver the most
              relevant information to you.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
