import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Homepage.module.css";

const Homepage = () => {
  const [news, setNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState(null);
  const [secondaryNews, setSecondaryNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("world");

  const categories = [
    "World",
    "Business",
    "Technology",
    "Entertainment",
    "Sports",
    "Science",
    "Health",
    "India",
  ];

  const categoryMap = {
    World: "world",
    Business: "business",
    Technology: "technology",
    Entertainment: "entertainment",
    Sports: "sports",
    Science: "science",
    Health: "health",
    India: "nation",
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/news?topic=${selectedCategory}`,
        { mode: "cors" }
      );
      const newsResults = await response.json();

      if (newsResults.length > 0) {
        setFeaturedNews(newsResults[0]);
        setSecondaryNews(newsResults.slice(1, 3));
        setNews(newsResults.slice(3));
      } else {
        throw new Error("No news found");
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/news/search?q=${searchQuery}`,
        {
          mode: "cors",
        }
      );
      const searchResults = await response.json();

      if (searchResults.length > 0) {
        setFeaturedNews(searchResults[0]);
        setSecondaryNews(searchResults.slice(1, 3));
        setNews(searchResults.slice(3));
      } else {
        throw new Error("No news found for the search query");
      }
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryLabel) => {
    const topic = categoryMap[categoryLabel] || "world";
    setSelectedCategory(topic);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "";

    const now = new Date();
    const publishedDate = new Date(dateString);
    const seconds = Math.floor((now - publishedDate) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;

    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;

    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;

    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;

    return `${Math.floor(seconds)} seconds ago`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logoLink}>
            <h1 className={styles.logo}>News Nugget</h1>
            <p className={styles.tagline}>Your daily dose of curated news</p>
          </Link>
        </div>

        <div className={styles.navButtonsContainer}>
          <Link to="/" className={`${styles.navButton} ${styles.active}`}>
            Home
          </Link>
          <Link to="/summarizer" className={styles.navButton}>
            AI Summarizer
          </Link>
        </div>
      </header>

      <div className={styles.subHeader}>
        <div className={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <div
              key={index}
              className={`${styles.categoryPill} ${
                selectedCategory === category ? styles.categoryActive : ""
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </div>
          ))}
        </div>
        <div className={styles.searchBar}>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </div>

      <div className={styles.content}>
        <main className={styles.mainContent}>
          {error ? (
            <div className={styles.errorMessage}>
              <h2>Error Loading News</h2>
              <p>{error}</p>
              <button onClick={fetchNews} className={styles.retryButton}>
                Retry
              </button>
            </div>
          ) : loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading latest news...</p>
            </div>
          ) : (
            <>
              <div className={styles.featuredSection}>
                <h2 className={styles.sectionTitle}>
                  {selectedCategory
                    ? `${selectedCategory} News`
                    : "Trending Stories"}
                </h2>
                <div className={styles.featuredNews}>
                  {featuredNews && (
                    <div className={styles.primaryNews}>
                      <div
                        className={styles.newsImage}
                        style={
                          featuredNews.image_url
                            ? {
                                backgroundImage: `url(${featuredNews.image_url})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }
                            : {}
                        }
                      ></div>
                      <h3>{featuredNews.title}</h3>
                      <p>
                        {featuredNews.description ||
                          featuredNews.content?.substring(0, 150) + "..."}
                      </p>
                      <div className={styles.newsFooter}>
                        <span className={styles.timestamp}>
                          {getTimeAgo(featuredNews.pubDate)}
                        </span>
                        <a
                          href={featuredNews.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.readMoreBtn}
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  )}
                  <div className={styles.secondaryNews}>
                    {secondaryNews.map((item, index) => (
                      <div key={index} className={styles.newsItem}>
                        <div
                          className={styles.smallNewsImage}
                          style={
                            item.image_url
                              ? {
                                  backgroundImage: `url(${item.image_url})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }
                              : {}
                          }
                        ></div>
                        <div>
                          <h4>{item.title}</h4>
                          <div className={styles.newsItemFooter}>
                            <span className={styles.timestamp}>
                              {getTimeAgo(item.pubDate)}
                            </span>
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.readMoreBtn}
                            >
                              Read More
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.latestNewsSection}>
                <h2 className={styles.sectionTitle}>Latest Updates</h2>
                <div className={styles.newsGrid}>
                  {news.map((article, index) => (
                    <div key={index} className={styles.newsCard}>
                      <div
                        className={styles.cardImage}
                        style={
                          article.image_url
                            ? {
                                backgroundImage: `url(${article.image_url})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }
                            : {}
                        }
                      ></div>
                      <div className={styles.cardContent}>
                        <span className={styles.category}>
                          {article.source || article.category?.[0] || "General"}
                        </span>
                        <h3 className={styles.newsTitle}>{article.title}</h3>
                        <p className={styles.newsSnippet}>
                          {article.description ||
                            article.content?.substring(0, 120) + "..."}
                        </p>
                        <div className={styles.newsFooter}>
                          <span className={styles.date}>
                            {formatDate(article.pubDate)}
                          </span>
                          <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.readMoreBtn}
                          >
                            Read More
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
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
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
