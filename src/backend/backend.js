import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import unfluff from "unfluff";
import { JSDOM } from "jsdom";
import natural from "natural";

// Load environment variables
dotenv.config({ path: "./.env" });

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("✅ News Nugget backend is running");
});

// Summarize article from URL
app.post("/api/summarize", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Missing 'url' in request body" });
  }

  try {
    const summary = await summarizeArticle(url);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch news by category (default = general)
app.get("/api/news", async (req, res) => {
  const apiKey = process.env.VITE_GNEWS_API_KEY || "YOUR_API_KEY_HERE";
  const topic = req.query.topic || "general";

  try {
    const news = await fetchNewsFromGNews(topic, apiKey);
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch news" });
  }
});

// 🔍 Fetch news using search query
app.get("/api/news/search", async (req, res) => {
  const apiKey = process.env.VITE_GNEWS_API_KEY || "YOUR_API_KEY_HERE";
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Missing 'q' query parameter" });
  }

  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
      query
    )}&apikey=${apiKey}&lang=en&max=10`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }

    const data = await response.json();

    if (data.articles && data.articles.length > 0) {
      const results = data.articles.map((article) => ({
        title: article.title,
        description: article.description,
        content: article.content,
        image_url: article.image,
        link: article.url,
        pubDate: article.publishedAt,
        source: article.source.name,
        category: ["Search"],
      }));
      res.json(results);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error("Error during search:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

// --------- Summarization Pipeline ---------
async function summarizeArticle(articleUrl) {
  try {
    const apiKey =
      process.env.VITE_HUGGINGFACE_API_KEY || "YOUR_HUGGINGFACE_API_KEY";

    if (!apiKey) {
      throw new Error("Missing Hugging Face API Key");
    }

    const articleContent = await fetchArticleContent(articleUrl);

    // Step 1: Extractive summarization
    const extractiveSummary = extractTopSentences(articleContent, 0.7); // Top 70%

    // Step 2: BART Abstractive summarization
    const refinedSummary = await callHuggingFaceAPI(extractiveSummary, apiKey);

    return refinedSummary;
  } catch (error) {
    console.error("Error summarizing article:", error);
    throw error;
  }
}

function extractTopSentences(text, percentage = 0.7) {
  const tokenizer = new natural.SentenceTokenizer();
  const sentences = tokenizer.tokenize(text);

  const sentenceScores = sentences.map((sentence, index) => {
    const words = new Set(
      sentence
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
    );
    return {
      index,
      sentence,
      score: words.size,
    };
  });

  const numSentencesToExtract = Math.ceil(sentences.length * percentage);
  const topSentences = sentenceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, numSentencesToExtract)
    .sort((a, b) => a.index - b.index)
    .map((s) => s.sentence)
    .join(" ");

  return topSentences;
}

async function callHuggingFaceAPI(text, apiKey) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          max_length: 1000,
          min_length: 200,
          do_sample: false,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to summarize text");
  }

  const data = await response.json();
  if (Array.isArray(data) && data[0].summary_text) {
    return data[0].summary_text.trim();
  }

  throw new Error("Invalid summary format from Hugging Face API");
}

// --------- Clean & Extract Article Content ---------
async function fetchArticleContent(url) {
  try {
    console.log("Extracting article content from:", url);
    const response = await fetch(url);
    const html = await response.text();

    const parsed = unfluff(html);

    if (!parsed.text || parsed.text.length < 200) {
      throw new Error("Unfluff failed to extract enough content");
    }

    const cleanedText = parsed.text.trim().replace(/\s{2,}/g, " ");
    console.log("🧼 Cleaned text length:", cleanedText.length);
    console.log("📰 Preview of cleaned content:\n", cleanedText.slice(0, 1000));

    return cleanedText;
  } catch (error) {
    console.error("Error extracting article:", error);
    throw new Error("Could not retrieve article content");
  }
}

// --------- News Fetching by Category ---------
async function fetchNewsFromGNews(category = null, apiKey) {
  try {
    if (!apiKey) {
      throw new Error("API key not found.");
    }

    let url = `https://gnews.io/api/v4/top-headlines?apikey=${apiKey}&lang=en&max=10`;

    if (category && category !== "General") {
      url += `&topic=${category.toLowerCase()}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch news from GNews API");
    }

    const data = await response.json();

    if (data.articles && data.articles.length > 0) {
      return data.articles.map((article) => ({
        title: article.title,
        description: article.description,
        content: article.content,
        image_url: article.image,
        link: article.url,
        pubDate: article.publishedAt,
        source: article.source.name,
        category: [category || "General"],
      }));
    } else {
      throw new Error("No news found");
    }
  } catch (err) {
    console.error("Error fetching news from GNews:", err);
    throw err;
  }
}
