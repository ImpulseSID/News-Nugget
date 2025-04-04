import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Summarizer.module.css";

function Summarizer() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url) {
      setError("Please enter a URL to summarize");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSummary("");
      setCopied(false);

      // Fetch from backend API
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/summarize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSummary(data.summary);
      } else {
        setError(data.error || "Failed to summarize article");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logoLink}>
            <h1 className={styles.logo}>News Nugget</h1>
            <p className={styles.tagline}>Smart News Summarizer</p>
          </Link>
        </div>

        <div className={styles.navButtonsContainer}>
          <Link to="/" className={styles.navButton}>
            Home
          </Link>
          <Link
            to="/summarizer"
            className={`${styles.navButton} ${styles.active}`}
          >
            AI Summarizer
          </Link>
        </div>
      </header>

      <div className={styles.content}>
        <main className={styles.mainContent}>
          {error ? (
            <div className={styles.errorMessage}>
              <h2>Error</h2>
              <p>{error}</p>
              <button
                onClick={() => setError("")}
                className={styles.retryButton}
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className={styles.summarizerSection}>
                <h2 className={styles.sectionTitle}>AI News Summarizer</h2>
                <div className={styles.summarizerCard}>
                  <p className={styles.cardDescription}>
                    Enter a news article URL and get an AI-powered summary in
                    seconds.
                  </p>

                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="url" className={styles.label}>
                        News Article URL
                      </label>
                      <input
                        type="url"
                        id="url"
                        placeholder="https://example.com/news-article"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className={styles.input}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={isLoading}
                    >
                      {isLoading ? "Summarizing..." : "Summarize Article"}
                    </button>
                  </form>

                  {summary && (
                    <div className={styles.summaryResult}>
                      <div className={styles.summaryHeader}>
                        <h3>Summary</h3>
                        <button
                          onClick={copyToClipboard}
                          className={styles.copyButton}
                        >
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <div className={styles.summaryContent}>
                        {summary.split("\n\n").map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {isLoading && (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Generating summary...</p>
            </div>
          )}
        </main>
      </div>

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
          <div className={`${styles.footerSection} ${styles.quickLinks}`}>
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/summarizer">AI Summarizer</Link>
              </li>
              <li>About Us</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Summarizer;
