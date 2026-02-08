# Dynamic Portfolio Dashboard

A full-stack stock portfolio dashboard built with Next.js and TypeScript that fetches live market prices from Yahoo Finance, company fundamentals from Google Finance, aggregates holdings by sector, and visualizes performance in real time.

This project was developed as part of the Full Stack Engineer technical assignment for 8byte.

---

## 🚀 Live Demo

https://dynamic-portfolio-dashboard-eta.vercel.app/

---

## ✨ Features

- Live Current Market Price (CMP) via Yahoo Finance
- P/E ratio and earnings scraping from Google Finance
- Sector-wise portfolio aggregation
- Donut chart for allocation
- Bar chart for sector performance
- Expandable holdings table (desktop & mobile)
- Auto refresh every 15 seconds
- In-memory caching to reduce API calls
- Graceful handling of partial failures
- Deployed on Vercel

---

## 🛠 Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Recharts

### Backend
- Next.js API Routes
- Yahoo Finance SDK
- Axios + Cheerio for scraping
- Node-cache (in-memory caching)

---

## 📊 Architecture & Data Flow

1. Holdings are read from `src/data/portfolio.json`.
2. `/api/stocks` fetches:
   - CMP from Yahoo Finance.
   - Fundamentals from Google Finance.
3. Responses are cached in memory.
4. Holdings are enriched with financial metrics:
   - Present value
   - Gain / loss
   - Portfolio percentage
5. Sector summaries are calculated.
6. Frontend polls the API every 15 seconds.

---

## ⚙️ Local Setup

```bash
git clone https://github.com/<your-username>/dynamic-portfolio-dashboard.git
cd dynamic-portfolio-dashboard
npm install
npm run dev
