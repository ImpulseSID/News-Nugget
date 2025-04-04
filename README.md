# 🗞️ News Nugget

News Nugget is an AI-powered news aggregator website that scrapes the latest headlines from the web and provides concise summaries using natural language processing. Built using Express.js for the backend and React for the frontend, it leverages APIs like GNews and Hugging Face to deliver categorized, searchable, and summarized news articles.

---

## 🚀 Features

- 🔍 **Search News** — Search global news articles by keywords using GNews API.
- 📰 **Category-wise Headlines** — Browse top news from categories like Technology, Sports, Business, and more.
- ✂️ **AI Summarization** — Summarizes full articles using extractive + abstractive methods (via Hugging Face's BART model).
- 🌐 **Clean Web Scraping** — Scrapes article content using `unfluff` for accurate and clean summaries.
- ⚡ **Fast and Lightweight** — Node.js + Express backend with minimal dependencies.

---

## 🛠️ Tech Stack

- **Frontend**: React
- **Backend**: Express.js
- **NLP & Summarization**:
  - `natural` for extractive summarization
  - Hugging Face Transformers API (BART model) for abstractive summarization
- **Scraping**: `unfluff`, `node-fetch`
- **News Provider**: GNews API
- **Environment Variables**: `dotenv`

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/news-nugget.git
cd news-nugget
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Create `.env` File

Create a `.env` file in the root directory and add the following:

```
VITE_GNEWS_API_KEY=your_gnews_api_key
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key
```

### 4. Start the Server

```bash
npm run dev
```

Frontend will run at: [http://localhost:8080](http://localhost:8080)

Backend will run at: [http://localhost:5000](http://localhost:5000)

---

## 🧪 API Endpoints

### GET `/api/news`

Fetch top headlines (default category: general)

**Example:**

```
/api/news?topic=technology
```

---

### GET `/api/news/search`

Search news by query

**Example:**

```
/api/news/search?q=climate change
```

---

### POST `/api/summarize`

Summarize a news article from a URL

**Request Body:**

```json
{
  "url": "https://example.com/news-article"
}
```

**Response:**

```json
{
  "summary": "AI-generated summary text..."
}
```

---

## 🧠 How It Works

1. **Scrape** full content from a news article URL using `unfluff`.
2. **Extract** top 70% of information-rich sentences using `natural`.
3. **Summarize** those sentences using Hugging Face's `facebook/bart-large-cnn` model.
4. **Serve** the summary via the API.

---

## ✨ Future Enhancements

- 📊 Keyword-based trend analysis
- 📅 Date/source filtering

---

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

© 2025 News Nugget Team

---

## 🙌 Acknowledgements

- [GNews.io](https://gnews.io/) — Free news data API
- [Hugging Face](https://huggingface.co/) — AI model hosting
- [Unfluff](https://github.com/ageitgey/node-unfluff) — Article scraping
